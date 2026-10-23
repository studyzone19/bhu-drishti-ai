"""
Generates 8000 rows of realistic synthetic landslide data for NER India.
Features derived from Sentinel-2A/2B (optical) and Sentinel-1A SAR.
"""
import os, random, csv, math

random.seed(42)

NER_LOCATIONS = [
    ("Assam", ["Kamrup", "Dima Hasao", "Cachar", "Karbi Anglong", "Nagaon", "Dibrugarh", "Tinsukia", "Goalpara"]),
    ("Meghalaya", ["East Khasi Hills", "West Garo Hills", "Ri Bhoi", "Jaintia Hills", "South Garo Hills"]),
    ("Mizoram", ["Aizawl", "Lunglei", "Champhai", "Serchhip", "Kolasib"]),
    ("Nagaland", ["Kohima", "Dimapur", "Zunheboto", "Mokokchung", "Wokha", "Tuensang"]),
    ("Manipur", ["Imphal East", "Imphal West", "Churachandpur", "Senapati", "Chandel", "Ukhrul"]),
    ("Sikkim", ["East Sikkim", "North Sikkim", "South Sikkim", "West Sikkim"]),
    ("Arunachal Pradesh", ["Tawang", "Papum Pare", "Lower Subansiri", "West Kameng", "East Siang", "Changlang"]),
    ("Tripura", ["West Tripura", "Unakoti", "Dhalai", "North Tripura"]),
]

LAT_RANGE = {"Assam": (24.5, 27.5), "Meghalaya": (25.0, 26.0), "Mizoram": (22.0, 24.5),
             "Nagaland": (25.0, 27.0), "Manipur": (24.0, 25.5), "Sikkim": (27.0, 28.0),
             "Arunachal Pradesh": (26.5, 29.0), "Tripura": (22.5, 24.5)}
LON_RANGE = {"Assam": (89.5, 96.0), "Meghalaya": (89.5, 92.5), "Mizoram": (92.0, 93.5),
             "Nagaland": (93.5, 95.5), "Manipur": (93.0, 94.5), "Sikkim": (88.0, 89.0),
             "Arunachal Pradesh": (91.5, 97.0), "Tripura": (91.0, 92.5)}

FEATURES = [
    'latitude', 'longitude', 'state', 'district',
    'rainfall_1d', 'rainfall_3d', 'rainfall_7d', 'rainfall_15d', 'rainfall_30d',
    'rainfall_intensity', 'rainfall_anomaly',
    'elevation', 'slope', 'aspect', 'curvature', 'twi', 'ruggedness',
    'forest_cover', 'tree_cover', 'forest_change',
    'ndvi', 'ndmi', 'nbr', 'satellite_change',
    'landcover',
    'earthquake_magnitude', 'earthquake_depth', 'earthquake_distance',
    'historical_landslide_density',
    'landslide'
]

def sigmoid(x):
    return 1.0 / (1.0 + math.exp(-x))

def generate_row():
    state, districts = random.choice(NER_LOCATIONS)
    district = random.choice(districts)
    lat = round(random.uniform(*LAT_RANGE[state]), 4)
    lon = round(random.uniform(*LON_RANGE[state]), 4)

    # Rainfall
    r1d = round(random.expovariate(1/40) if random.random() > 0.3 else random.uniform(80, 300), 1)
    r3d = round(r1d + random.uniform(10, 200), 1)
    r7d = round(r3d + random.uniform(20, 300), 1)
    r15d = round(r7d + random.uniform(30, 400), 1)
    r30d = round(r15d + random.uniform(50, 800), 1)
    r_intensity = round(r1d / 24, 2)
    r_anomaly = round(random.gauss(20, 60), 1)

    # Terrain
    elevation = round(random.uniform(10, 3500), 1)
    slope = round(random.uniform(0, 65), 1)
    aspect = round(random.uniform(0, 360), 1)
    curvature = round(random.gauss(0, 0.6), 3)
    twi = round(random.uniform(2, 18), 2)
    ruggedness = round(random.uniform(0, 400), 1)

    # Vegetation (Sentinel-2)
    forest_cover = round(random.uniform(0, 100), 1)
    tree_cover = round(min(100, forest_cover + random.uniform(-20, 10)), 1)
    forest_change = round(random.gauss(-3, 8), 1)
    ndvi = round(random.uniform(-0.1, 0.9), 3)
    ndmi = round(random.uniform(-0.4, 0.6), 3)
    nbr = round(random.uniform(-0.4, 0.7), 3)
    satellite_change = round(random.betavariate(2, 5), 3)  # SAR change (Sentinel-1)

    # Land cover
    landcover = random.choice([1,1,1,2,2,3,3,4,5,6,7,8])

    # Earthquake
    eq_mag = round(random.expovariate(1/1.5), 1) if random.random() < 0.15 else 0.0
    eq_depth = round(random.uniform(5, 80), 1) if eq_mag > 0 else 0.0
    eq_dist = round(random.uniform(5, 400), 1) if eq_mag > 0 else round(random.uniform(100, 500), 1)

    # Historical
    hist_density = round(random.expovariate(1/3), 1)

    # Compute landslide probability
    score = -3.5
    score += 0.012 * r1d
    score += 0.004 * r3d
    score += 0.08 * r_intensity
    score += 0.005 * max(0, r_anomaly)
    score += 0.04 * max(0, slope - 15)
    score += 0.3 * max(0, curvature)
    score += 0.06 * max(0, twi - 8)
    score += 0.001 * ruggedness
    score += 0.8 * max(0, 0.4 - ndvi)
    score += 0.5 * max(0, -forest_change / 10)
    score += 1.2 * max(0, satellite_change - 0.4)
    if eq_mag > 3.5 and eq_dist < 80:
        score += 0.4 * (eq_mag - 3)
    score += 0.08 * hist_density
    if landcover in [4, 8]:
        score += 0.3

    prob = sigmoid(score)
    landslide = 1 if random.random() < prob else 0

    return [lat, lon, state, district,
            r1d, r3d, r7d, r15d, r30d, r_intensity, r_anomaly,
            elevation, slope, aspect, curvature, twi, ruggedness,
            forest_cover, tree_cover, forest_change,
            ndvi, ndmi, nbr, satellite_change,
            landcover,
            eq_mag, eq_depth, eq_dist,
            hist_density,
            landslide]

def main():
    out_path = os.path.join(os.path.dirname(__file__), "satellite_landslide_data.csv")
    rows = [generate_row() for _ in range(8000)]
    
    pos = sum(1 for r in rows if r[-1] == 1)
    print(f"Generated {len(rows)} rows ({pos} landslide=1, {len(rows)-pos} landslide=0)")
    
    with open(out_path, 'w', newline='') as f:
        w = csv.writer(f)
        w.writerow(FEATURES)
        w.writerows(rows)
    print(f"Saved to {out_path}")

if __name__ == "__main__":
    main()
