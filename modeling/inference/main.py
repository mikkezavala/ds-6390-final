import pandas as pd
from fastapi import FastAPI
from pydantic import BaseModel
import numpy as np
import joblib
from keras import models
from keras.api.activations import gelu
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Taxpayer Anomaly Detection API")
embedding = models.load_model("keras_embedding_model.keras", custom_objects={"gelu": gelu})
model = models.load_model("final_keras_anomaly_model.keras", custom_objects={"gelu": gelu})

pca = joblib.load("kmeans_pca.pkl")
cat_vocab = joblib.load("cat_vocab.pkl")
kmeans = joblib.load("kmeans_model.pkl")
scaler = joblib.load("kmeans_scaler.pkl")
numeric_cols = joblib.load("numeric_cols.pkl")
categorical_cols = joblib.load("categorical_cols.pkl")
kmeans_feature_cols = joblib.load("kmeans_feature_cols.pkl")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TaxpayerInput(BaseModel):
    box_1_wages: float = 0
    box_3_social_security_wages: float = 0
    box_4_social_security_tax_withheld: float = 0
    box_5_medicare_wages: float = 0
    box_6_medicare_wages_tax_withheld: float = 0
    box_7_social_security_tips: float = 0
    box_8_allocated_tips: float = 0
    box_10_dependent_care_benefits: float = 0
    box_11_nonqualified_plans: float = 0
    box_13_statutary_employee: bool = False
    box_13_retirement_plan: bool = False
    box_13_third_part_sick_pay: bool = False
    box_16_1_state_wages: float = 0
    box_17_1_state_income_tax: float = 0
    box_18_1_local_wages: float = 0
    box_19_1_local_income_tax: float = 0
    box_16_2_state_wages: float = 0
    box_17_2_state_income_tax: float = 0
    box_18_2_local_wages: float = 0
    box_19_2_local_income_tax: float = 0

    # Categorical fields used for embeddings (trained only on codes, not values)
    box_12a_code: str = "None"
    box_12b_code: str = "None"
    box_12c_code: str = "None"
    box_12d_code: str = "None"
    box_15_1_state: str = "CA"
    box_15_2_state: str = "None"

    # Box 12 pairs
    box_12a_value: float = 0
    box_12b_value: float = 0
    box_12c_value: float = 0
    box_12d_value: float = 0

@app.post("/predict")
def predict_anomaly(payload: TaxpayerInput):
    input_dict = payload.model_dump()
    missing_keys = [col for col in numeric_cols if col not in input_dict]
    if missing_keys:
        raise ValueError(f"Missing numeric input(s): {missing_keys}")

    numeric_input = np.array([[input_dict[col] for col in numeric_cols]])

    categorical_input = {}
    for col in categorical_cols:
        raw_val = input_dict.get(col, "None")
        input_key = f"{col}_input"
        vocab_size = cat_vocab.get(input_key)

        if vocab_size is None:
            raise ValueError(f"Unexpected categorical column: {col}")

        try:
            categories = [str(i) for i in range(vocab_size)]
            code = categories.index(str(raw_val)) if str(raw_val) in categories else 0
        except Exception:
            code = 0

        categorical_input[input_key] = np.array([[code]])

    # Combine model inputs
    model_input = {"numeric_input": numeric_input, **categorical_input}
    proba = model.predict(model_input).flatten()[0]
    prediction = proba >= 0.4001

    pca_result = preprocess_user_input(input_dict, kmeans_feature_cols, scaler, pca, kmeans)
    return {
        "anomaly": bool(prediction),
        "probability": round(float(proba), 8),
        **pca_result
    }

def preprocess_user_input(user_input_dict, kmeans_feature_cols, scaler, pca, kmeans):
    # Convert dict to DataFrame
    user_df = pd.DataFrame([user_input_dict])

    # One-hot encode categorical features
    user_encoded = pd.get_dummies(user_df)

    # Align with training columns
    for col in kmeans_feature_cols:
        if col not in user_encoded.columns:
            user_encoded[col] = 0  # Add missing dummy columns

    user_encoded = user_encoded[kmeans_feature_cols]  # Ensure column order

    # Scale
    user_scaled = scaler.transform(user_encoded)

    # PCA projection
    pca_coords = pca.transform(user_scaled)

    # Predict cluster
    cluster_id = kmeans.predict(user_scaled)[0]

    return {
        "PC1": float(pca_coords[0][0]),
        "PC2": float(pca_coords[0][1]),
        "PC3": float(pca_coords[0][2]),
        "cluster": int(cluster_id)
    }
