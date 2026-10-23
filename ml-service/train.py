"""
Trains RandomForestClassifier on comprehensive satellite landslide dataset.
Features: Sentinel-2A/2B optical + Sentinel-1A SAR + terrain + rainfall + seismic.
Usage: python train.py
"""
import os
import joblib
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, roc_auc_score

FEATURES = [
    'rainfall_1d', 'rainfall_3d', 'rainfall_7d', 'rainfall_15d', 'rainfall_30d',
    'rainfall_intensity', 'rainfall_anomaly',
    'elevation', 'slope', 'aspect', 'curvature', 'twi', 'ruggedness',
    'forest_cover', 'tree_cover', 'forest_change',
    'ndvi', 'ndmi', 'nbr', 'satellite_change',
    'landcover',
    'earthquake_magnitude', 'earthquake_depth', 'earthquake_distance',
    'historical_landslide_density'
]

DATA_PATH = os.path.join(os.path.dirname(__file__), "data", "satellite_landslide_data.csv")
MODEL_PATH = os.path.join(os.path.dirname(__file__), "model", "landslide_model.joblib")


def main():
    if not os.path.exists(DATA_PATH):
        raise FileNotFoundError(
            f"Dataset not found at {DATA_PATH}. "
            "Run `python data/generate_satellite_data.py` first."
        )

    df = pd.read_csv(DATA_PATH)
    print(f"Dataset: {len(df)} rows, {df['landslide'].sum()} landslide=1 ({df['landslide'].mean()*100:.1f}%)")

    X = df[FEATURES]
    y = df["landslide"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    model = RandomForestClassifier(
        n_estimators=300, max_depth=12, random_state=42, class_weight="balanced"
    )
    model.fit(X_train, y_train)

    preds = model.predict(X_test)
    proba = model.predict_proba(X_test)[:, 1]
    print(classification_report(y_test, preds))
    print(f"ROC-AUC: {roc_auc_score(y_test, proba):.3f}")

    # Feature importance
    importances = sorted(zip(FEATURES, model.feature_importances_), key=lambda x: -x[1])
    print("\nTop 10 Feature Importances:")
    for feat, imp in importances[:10]:
        print(f"  {feat:30s} {imp:.4f}")

    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    joblib.dump({"model": model, "features": FEATURES}, MODEL_PATH)
    print(f"\nModel saved to {MODEL_PATH}")
    print("Satellite sources: Sentinel-2A, Sentinel-2B, Sentinel-1A SAR")
    print("Prediction window: 4-6 hours")


if __name__ == "__main__":
    main()
