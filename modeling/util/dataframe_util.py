import keras
import numpy as np
import pandas as pd

from keras import layers, models, Input
from keras.api import optimizers
from keras.api.activations import gelu

def clean_dataframe(df):
    df_details = str_df(df).to_dict('records')
    # box_9_advance_eic_payment - All column is None
    target_drop = [
        'box_b_employer_identification_number',
        'box_d_control_number',
        'box_9_advance_eic_payment',
        'box_15_2_employee_state_id',
        'box_15_1_employee_state_id'
    ]
    continuous, categorical, drop_list = (
        [f['column'] for f in df_details if pd.api.types.is_numeric_dtype(f['dtype']) and len(f['sample_values']) > 3],
        [f['column'] for f in df_details if
         not pd.api.types.is_numeric_dtype(f['dtype']) or len(f['sample_values']) <= 3],
        [f['column'] for f in df_details if
         f["column"].startswith('box_c') or f["column"].startswith('box_a') or f["column"].startswith('box_e') or f[
             "column"].startswith('box_20') or f['column'] in target_drop],
    )

    # Now there are boxes looks like binary but encoded with x, None. x=True, None=False
    columns_encode = ['box_13_statutary_employee', 'box_13_retirement_plan', 'box_13_third_part_sick_pay']
    df[columns_encode] = df[columns_encode].replace({'x': True, "None": False, np.nan: False}).astype(bool)
    df[df.select_dtypes(exclude=['bool', 'float64', 'int64']).columns] = df.select_dtypes(
        exclude=['bool', 'float64', 'int64']).astype('category')
    df[df.select_dtypes(include=['bool']).columns] = df.select_dtypes(include=['bool']).astype('int64')
    # Drop and inspect
    return df.drop(drop_list, axis=1)

def str_df(df):
    summary = []
    for col in df.columns:
        col_data = df[col]
        dtype = col_data.dtype
        n_unique = col_data.nunique()
        sample_values = col_data.unique()[:5]
        summary.append({
            'column': col,
            'dtype': dtype,
            'n_unique': n_unique,
            'sample_values': sample_values
        })
    return pd.DataFrame(summary)


def high_correlated(corr_matrix, threshold=0.8):
    abs_corr = corr_matrix.abs()
    upper = abs_corr.where(np.triu(np.ones(abs_corr.shape), k=1).astype(bool))

    correlated_pairs = np.where(upper > threshold)
    correlated_features = set()
    for i, j in zip(*correlated_pairs):
        correlated_features.add(corr_matrix.columns[i])
        correlated_features.add(corr_matrix.columns[j])

    return sorted(list(correlated_features))


def data_features(df, target, features, exclusion = []):
    predictors = [f for f in features if f not in exclusion and f != target]
    df_trimmed = df[predictors].copy()
    # Ensure target is in the DataFrame
    if target not in df_trimmed.columns:
        df_trimmed[target] = df[target]

    return df_trimmed, predictors

def encode_retirement_features(df, prefix_list=['box_12a', 'box_12b', 'box_12c', 'box_12d'], fill_zero=False):
    df = df.copy()

    for prefix in prefix_list:
        code_col = f'{prefix}_code'
        val_col = f'{prefix}_value'

        if code_col in df.columns and val_col in df.columns:
            for code in df[code_col].dropna().unique():
                new_col = f'{prefix}_{code}'
                df[new_col] = df[val_col].where(df[code_col] == code, np.nan)

                if fill_zero:
                    df[new_col].fillna(0, inplace=True)

            df.drop([code_col, val_col], axis=1, inplace=True)

    return df

def transform(df, transformation, target, exclude=None, exclude_prefix=None, scope=3) -> pd.DataFrame:
    funcs = {
        'log': np.log,
        'log1p': np.log1p,
        'sqrt': np.sqrt,
        'pow_0_25': lambda x: np.power(x, 0.25)
    }

    if transformation not in funcs:
        raise NotImplementedError(f"Transformation '{transformation}' not implemented")

    if exclude is None:
        exclude = []
    if exclude_prefix is None:
        exclude_prefix = []

    df_copy = df.copy()
    func = funcs[transformation]

    # Build final list of columns to exclude
    cols_to_exclude = set(exclude)
    for prefix in exclude_prefix:
        matched = [col for col in df_copy.columns if col.startswith(prefix)]
        cols_to_exclude.update(matched)

    match scope:
        case 1:
            cols = df_copy.columns.difference(cols_to_exclude)
            df_copy[cols] = df_copy[cols].apply(func)
            return df_copy

        case 2:
            df_copy[target] = func(df_copy[target])
            return df_copy

        case 3:
            cols_to_exclude.add(target)
            features = df_copy.columns.difference(cols_to_exclude)
            df_copy[features] = df_copy[features].apply(func)
            return df_copy

        case _:
            raise ValueError(f"Invalid scope '{scope}'. Use 1 (all), 2 (target only), or 3 (features only)")


def build_anomaly_model(input_dim, embedding_dim=16):
    inputs = layers.Input(shape=(input_dim,), name="input")

    # First hidden block
    x = layers.Dense(128)(inputs)
    x = layers.BatchNormalization()(x)
    x = layers.Activation(gelu)(x)
    x = layers.Dropout(0.3)(x)

    # Second block
    x = layers.Dense(64)(x)
    x = layers.BatchNormalization()(x)
    x = layers.Activation(gelu)(x)
    x = layers.Dropout(0.3)(x)

    # Third block
    x = layers.Dense(32)(x)
    x = layers.BatchNormalization()(x)
    x = layers.Activation(gelu)(x)
    x = layers.Dropout(0.3)(x)

    # Embedding layer (named for export)
    embedding = layers.Dense(embedding_dim, activation=gelu, name="embedding")(x)
    x = layers.Dropout(0.2)(embedding)

    # Final transformation block before output
    x = layers.Dense(32)(x)
    x = layers.BatchNormalization()(x)
    x = layers.Activation(gelu)(x)
    x = layers.Dropout(0.2)(x)

    # Output
    output = layers.Dense(1, activation="sigmoid", name="output")(x)

    model = models.Model(inputs=inputs, outputs=output)
    model.compile(
        optimizer=optimizers.Adam(learning_rate=0.001),
        loss="binary_crossentropy",
        metrics=["accuracy", keras.metrics.AUC(name="AUC")]
    )

    return model

def build_embedding_model(input_dim_numeric, categorical_cardinalities, embedding_dim=16):
    numeric_input = Input(shape=(input_dim_numeric,), name="numeric_input")

    embedding_branches = []
    for col, cardinality in categorical_cardinalities.items():
        cat_input = Input(shape=(1,), name=col)
        embedding = layers.Embedding(input_dim=cardinality, output_dim=embedding_dim)(cat_input)
        embedding = layers.Reshape((embedding_dim,))(embedding)
        embedding_branches.append((cat_input, embedding))

    all_inputs = [numeric_input] + [b[0] for b in embedding_branches]
    all_embeddings = [numeric_input] + [b[1] for b in embedding_branches]

    x = layers.Concatenate()(all_embeddings)
    x = layers.Dense(128)(x)
    x = layers.BatchNormalization()(x)
    x = layers.Activation(gelu)(x)
    x = layers.Dropout(0.3)(x)

    x = layers.Dense(64)(x)
    x = layers.BatchNormalization()(x)
    x = layers.Activation(gelu)(x)
    x = layers.Dropout(0.3)(x)

    x = layers.Dense(32)(x)
    x = layers.BatchNormalization()(x)
    x = layers.Activation(gelu)(x)
    x = layers.Dropout(0.3)(x)

    embedding_output = layers.Dense(embedding_dim, activation=gelu, name="dense_embedding")(x)
    x = layers.Dropout(0.2)(embedding_output)

    x = layers.Dense(32)(x)
    x = layers.BatchNormalization()(x)
    x = layers.Activation(gelu)(x)
    x = layers.Dropout(0.2)(x)

    output = layers.Dense(1, activation="sigmoid", name="output")(x)

    model = models.Model(inputs=all_inputs, outputs=output)
    model.compile(optimizer=optimizers.Adam(learning_rate=0.001), loss="binary_crossentropy", metrics=["accuracy", keras.metrics.AUC(name="AUC")])
    return model

