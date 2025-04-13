# Taxpayer Anomaly Detection

Our modeling pipeline is designed to detect anomalous federal tax withholdings in W-2 forms by combining interpretable models with predictive power. Here's how each component contributes:

---

## Linear Regression (MLR) — Anomaly Label Engineering

**Objective:** Fit a baseline model to predict `box_2_federal_tax_withheld` using numeric features.

**Method:**
- Applied a √ square root transformation to stabilize variance.
- Trained a Multiple Linear Regression (MLR) model on a train/test split.
- Calculated residuals: `actual − predicted`.

**Labeling Strategy:**
- Taxpayers in the top and bottom 10% of residuals were labeled as anomalies.
- These binary labels (anomaly = True/False) became the ground truth for downstream models.

---

## KMeans Clustering — Taxpayer Peer Groups

**Objective:** Group taxpayers with similar profiles for peer-based anomaly comparison.

**Method:**
- Applied `StandardScaler` and PCA (for projection).
- Used KMeans (k=6) to cluster the full dataset.
- Clusters help frame outliers *within* similar income/taxpayer groups.

**Insight:**
- Some anomalies clustered together — validating their deviation even within peer groups.
- Used for exploratory visualization and enhanced interpretability.

---

## Keras Neural Network — Real-Time Anomaly Prediction

**Objective:** Train a predictive model to detect anomalies based on taxpayer inputs.

**Architecture:**
- Dense + BatchNorm + ReLU
- Intermediate embedding layer (16 dims) for dashboard/visualization
- Dropout for regularization
- Output: Sigmoid (binary classification)

**Performance:**
- ROC AUC: ~0.77–0.81
- Best threshold ≈ **0.545** chosen from precision-recall analysis

**Deployment-Ready:**
- Supports real-time predictions
- Embeddings enable clustering, dashboard integration, and explainability via SHAP

---

## Random Forest — Benchmark Model

**Objective:** Provide a classical ML benchmark.

**Method:**
- Trained using `RandomizedSearchCV` with balanced subsampling
- Used same anomaly labels from MLR

**Outcome:**
- AUC ~0.77 — solid but surpassed by the Keras model
- Retained for model comparison only, not used in final deployment

---

## 💡 Pipeline Summary

| Model            | Role                         | Output Used? | Notes |
|------------------|------------------------------|--------------|-------|
| Linear Regression| Residual-based labeling      | ✅           | Label engineering |
| KMeans Clustering| Peer group clustering        | ✅           | Visualization + feature insight |
| Random Forest    | Classical benchmark model    | ❌           | Inferior generalization |
| Keras Neural Net | Real-time anomaly prediction | ✅           | Final model for deployment |

---

## 📦 Future Work

- Train embeddings for dashboard clustering + similarity search
- Visualize taxpayer segments using UMAP/TSNE
- Incorporate external credit/income data (optional)

---
