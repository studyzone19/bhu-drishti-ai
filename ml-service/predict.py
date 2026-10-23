"""
Loads the trained satellite-based landslide model and exposes prediction function.
Supports 25 features from Sentinel-2A/2B optical + Sentinel-1A SAR data.
"""
import os
import joblib
import pandas as pd

MODEL_PATH = os.path.join(os.path.dirname(__file__), "model", "landslide_model.joblib")

_model_bundle = None


def _load():
    global _model_bundle
    if _model_bundle is None:
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(
                "No trained model found. Run `python data/generate_satellite_data.py` "
                "then `python train.py` first."
            )
        _model_bundle = joblib.load(MODEL_PATH)
    return _model_bundle


def classify(score):
    if score >= 71:
        return "CRITICAL"
    if score >= 51:
        return "HIGH"
    if score >= 31:
        return "MODERATE"
    return "LOW"


def recommended_action(level):
    return {
        "CRITICAL": "IMMEDIATE EVACUATION ADVISED. Sentinel-1A SAR detected significant surface displacement. Restrict all access and alert communities within 5km radius.",
        "HIGH": "URGENT: Schedule field verification within 4-6 hours. Satellite change detection shows soil instability. Monitor rainfall and NDVI closely.",
        "MODERATE": "Continue enhanced monitoring. Sentinel-2 NDVI shows minor vegetation stress. Re-check after next rainfall update.",
        "LOW": "No immediate action required. All satellite indices within normal range. Continue passive monitoring.",
    }[level]


def predict_risk(payload: dict):
    bundle = _load()
    model = bundle["model"]
    features = bundle["features"]

    row = pd.DataFrame([[payload.get(f, 0) for f in features]], columns=features)
    probability = float(model.predict_proba(row)[0][1])
    risk_score = round(probability * 100)
    risk_level = classify(risk_score)

    return {
        "riskScore": risk_score,
        "riskLevel": risk_level,
        "probability": round(probability, 2),
        "recommendedAction": recommended_action(risk_level),
        "predictionWindow": "4-6 hours",
        "modelType": "RandomForestClassifier (300 trees, depth=12)",
        "satelliteSources": ["Sentinel-2A_MSI_Level-2A", "Sentinel-2B_MSI_Level-2A", "Sentinel-1A_SAR_IW_GRD"],
        "features_used": len(features),
        "trainedOnSyntheticData": True,
    }
