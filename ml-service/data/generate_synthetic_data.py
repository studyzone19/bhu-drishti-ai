"""
Generates a clearly-labeled SYNTHETIC training dataset for the landslide
risk model, since a real historical dataset was not available during
development. The feature relationships are hand-designed to be physically
plausible (more rainfall + higher soil moisture + steeper slope => higher
landslide probability) so the trained model behaves sensibly, but this is
NOT real-world validated data and must not be presented as such.
"""
import numpy as np
import pandas as pd

np.random.seed(42)
N = 4000


def generate():
    rainfall24h = np.random.gamma(2.0, 40, N).clip(0, 300)
    rainfall72h = rainfall24h * np.random.uniform(1.5, 2.8, N) + np.random.normal(0, 15, N)
    rainfall72h = rainfall72h.clip(0, 500)
    soil_moisture = np.random.beta(2, 2, N) * 100
    slope = np.random.uniform(0, 60, N)
    elevation = np.random.uniform(50, 2200, N)
    historical = np.random.poisson(1.5, N).clip(0, 10)
    distance_from_road = np.random.uniform(0, 1000, N)
    distance_from_river = np.random.uniform(0, 1000, N)

    # Physically-motivated latent risk score
    latent = (
        0.28 * (rainfall24h / 300)
        + 0.18 * (rainfall72h / 500)
        + 0.18 * (soil_moisture / 100)
        + 0.18 * (slope / 60)
        + 0.10 * (historical / 10)
        + 0.05 * (1 - distance_from_road / 1000)
        + 0.03 * (1 - distance_from_river / 1000)
    )
    noise = np.random.normal(0, 0.05, N)
    latent = np.clip(latent + noise, 0, 1)

    landslide_occurred = (latent > 0.55).astype(int)

    df = pd.DataFrame(
        {
            "rainfall24h": rainfall24h,
            "rainfall72h": rainfall72h,
            "soilMoisture": soil_moisture,
            "slope": slope,
            "elevation": elevation,
            "historicalLandslides": historical,
            "distanceFromRoad": distance_from_road,
            "distanceFromRiver": distance_from_river,
            "landslideOccurred": landslide_occurred,
        }
    )
    return df


if __name__ == "__main__":
    df = generate()
    df.to_csv("synthetic_landslide_data.csv", index=False)
    print(f"Generated {len(df)} synthetic rows -> synthetic_landslide_data.csv")
    print("NOTE: This is a synthetic/demo dataset, not real historical landslide records.")
