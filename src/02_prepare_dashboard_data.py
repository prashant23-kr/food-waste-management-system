import pandas as pd
from pathlib import Path


# ============================================================
# PROJECT PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
OUTPUT_DIR = BASE_DIR / "output"

# Create output folder if it doesn't exist
OUTPUT_DIR.mkdir(exist_ok=True)


# ============================================================
# EXCEL FILE
# ============================================================

excel_file = DATA_DIR / "P2_hackathon_data.xlsx"


# ============================================================
# CHECK AVAILABLE SHEETS
# ============================================================

excel = pd.ExcelFile(excel_file)

print("\nAVAILABLE SHEETS:")
print(excel.sheet_names)


# ============================================================
# LOAD ALL SHEETS
# ============================================================

donors = pd.read_excel(
    excel_file,
    sheet_name="P2_Donors"
)

donations = pd.read_excel(
    excel_file,
    sheet_name="P2_Donations"
)

ngos = pd.read_excel(
    excel_file,
    sheet_name="P2_NGO"
)

claims = pd.read_excel(
    excel_file,
    sheet_name="P2_Claims"
)


# ============================================================
# DATASET INFORMATION
# ============================================================

print("\nDATASET SHAPES:")

print("Donors:", donors.shape)
print("Donations:", donations.shape)
print("NGOs:", ngos.shape)
print("Claims:", claims.shape)


print("\nDONORS COLUMNS:")
print(donors.columns.tolist())


print("\nDONATIONS COLUMNS:")
print(donations.columns.tolist())


print("\nNGO COLUMNS:")
print(ngos.columns.tolist())


print("\nCLAIMS COLUMNS:")
print(claims.columns.tolist())


# ============================================================
# PREPARE DASHBOARD DATASETS
# ============================================================

print("\n" + "=" * 60)
print("PREPARING DASHBOARD DATASETS")
print("=" * 60)


# ============================================================
# 1. CLEAN DATA TYPES
# ============================================================

# Donation date
donations["Donation_Date"] = pd.to_datetime(
    donations["Donation_Date"],
    errors="coerce"
)


# Claim date
claims["Claim_Date"] = pd.to_datetime(
    claims["Claim_Date"],
    errors="coerce"
)


# Donation quantity
donations["Quantity_KG"] = pd.to_numeric(
    donations["Quantity_KG"],
    errors="coerce"
)


# Estimated meals
donations["Estimated_Meals"] = pd.to_numeric(
    donations["Estimated_Meals"],
    errors="coerce"
)


# Claimed quantity
claims["Claimed_Quantity_KG"] = pd.to_numeric(
    claims["Claimed_Quantity_KG"],
    errors="coerce"
)


# Pickup delay
claims["Pickup_Delay_Min"] = pd.to_numeric(
    claims["Pickup_Delay_Min"],
    errors="coerce"
)


# ============================================================
# 2. KPI DATA
# ============================================================

# ------------------------------------------------------------
# TOTAL FOOD DONATED
# ------------------------------------------------------------

total_food_donated = donations["Quantity_KG"].sum()


# ------------------------------------------------------------
# TOTAL ESTIMATED MEALS
# ------------------------------------------------------------

total_estimated_meals = donations["Estimated_Meals"].sum()


# ------------------------------------------------------------
# CLEAN DONATION STATUS
# ------------------------------------------------------------

donations["Status_Clean"] = (
    donations["Status"]
    .astype(str)
    .str.strip()
    .str.lower()
)


# Print status distribution for debugging
print("\nDONATION STATUS COUNTS:")
print(
    donations["Status_Clean"]
    .value_counts(dropna=False)
)


# ------------------------------------------------------------
# FOOD WASTE
# ------------------------------------------------------------

# We currently treat ONLY "wasted" as food waste.
#
# This keeps the Food Wasted KPI at the value we already
# verified in the dashboard.

waste_statuses = {
    "wasted"
}


wasted_donations = donations[
    donations["Status_Clean"].isin(waste_statuses)
]


food_wasted = wasted_donations["Quantity_KG"].sum()


wasted_estimated_meals = (
    wasted_donations["Estimated_Meals"].sum()
)


# ------------------------------------------------------------
# CLEAN DELIVERY STATUS
# ------------------------------------------------------------

claims["Delivery_Status_Clean"] = (
    claims["Delivery_Status"]
    .astype(str)
    .str.strip()
    .str.lower()
)


print("\nDELIVERY STATUS COUNTS:")
print(
    claims["Delivery_Status_Clean"]
    .value_counts(dropna=False)
)


# ------------------------------------------------------------
# SUCCESSFULLY DELIVERED CLAIMS
# ------------------------------------------------------------

delivered_claims = claims[
    claims["Delivery_Status_Clean"] == "delivered"
]


successfully_distributed_food = (
    delivered_claims["Claimed_Quantity_KG"].sum()
)


# ------------------------------------------------------------
# DELIVERY SUCCESS RATE
# ------------------------------------------------------------

delivery_success_rate = (
    len(delivered_claims) / len(claims) * 100
    if len(claims) > 0
    else 0
)


# ------------------------------------------------------------
# DISTRIBUTION BASE
# ------------------------------------------------------------

distribution_base = (
    successfully_distributed_food
    + food_wasted
)


# ------------------------------------------------------------
# DISTRIBUTION EFFICIENCY
# ------------------------------------------------------------

distribution_efficiency = (
    successfully_distributed_food
    / distribution_base
    * 100
    if distribution_base > 0
    else 0
)


# ------------------------------------------------------------
# WASTE RATE
# ------------------------------------------------------------

waste_rate = (
    food_wasted
    / distribution_base
    * 100
    if distribution_base > 0
    else 0
)


# ------------------------------------------------------------
# AVERAGE PICKUP DELAY
# ------------------------------------------------------------

average_pickup_delay = (
    claims["Pickup_Delay_Min"].mean()
)


# ------------------------------------------------------------
# MEDIAN PICKUP DELAY
# ------------------------------------------------------------

median_pickup_delay = (
    claims["Pickup_Delay_Min"].median()
)


# ============================================================
# KPI DATAFRAME
# ============================================================

kpi_data = pd.DataFrame({

    "KPI": [
        "Total Food Donated (KG)",
        "Total Estimated Meals",
        "Successfully Distributed Food (KG)",
        "Food Wasted (KG)",
        "Food Waste Percentage (%)",
        "Distribution Efficiency (%)",
        "Waste Rate (%)",
        "Delivery Success Rate (%)",
        "Average Pickup Delay (Min)",
        "Median Pickup Delay (Min)"
    ],

    "Value": [

        round(
            total_food_donated,
            2
        ),

        round(
            total_estimated_meals,
            2
        ),

        round(
            successfully_distributed_food,
            2
        ),

        round(
            food_wasted,
            2
        ),

        round(
            food_wasted
            / total_food_donated
            * 100
            if total_food_donated > 0
            else 0,
            2
        ),

        round(
            distribution_efficiency,
            2
        ),

        round(
            waste_rate,
            2
        ),

        round(
            delivery_success_rate,
            2
        ),

        round(
            average_pickup_delay,
            2
        ),

        round(
            median_pickup_delay,
            2
        )
    ]
})


# ============================================================
# 3. DONATIONS BY FOOD CATEGORY
# ============================================================

category_data = (
    donations
    .groupby("Food_Category")
    .agg(
        Donation_Count=(
            "Donation_ID",
            "count"
        ),

        Total_Quantity_KG=(
            "Quantity_KG",
            "sum"
        ),

        Average_Quantity_KG=(
            "Quantity_KG",
            "mean"
        )
    )
    .reset_index()
    .sort_values(
        "Total_Quantity_KG",
        ascending=False
    )
)


category_data["Total_Quantity_KG"] = (
    category_data["Total_Quantity_KG"].round(2)
)


category_data["Average_Quantity_KG"] = (
    category_data["Average_Quantity_KG"].round(2)
)


# ============================================================
# 4. DONATIONS BY LOCATION
# ============================================================

location_data = (
    donations
    .groupby("Pickup_Location")
    .agg(
        Donation_Count=(
            "Donation_ID",
            "count"
        ),

        Total_Quantity_KG=(
            "Quantity_KG",
            "sum"
        ),

        Average_Quantity_KG=(
            "Quantity_KG",
            "mean"
        )
    )
    .reset_index()
    .sort_values(
        "Total_Quantity_KG",
        ascending=False
    )
)


location_data["Total_Quantity_KG"] = (
    location_data["Total_Quantity_KG"].round(2)
)


location_data["Average_Quantity_KG"] = (
    location_data["Average_Quantity_KG"].round(2)
)


# ============================================================
# 5. MOST ACTIVE DONORS
# ============================================================

donor_data = (
    donations
    .groupby("Donor_ID")
    .agg(
        Donation_Count=(
            "Donation_ID",
            "count"
        ),

        Total_Quantity_KG=(
            "Quantity_KG",
            "sum"
        ),

        Average_Quantity_KG=(
            "Quantity_KG",
            "mean"
        )
    )
    .reset_index()
)


# ------------------------------------------------------------
# ADD DONOR INFORMATION
# ------------------------------------------------------------

donor_data = donor_data.merge(
    donors[
        [
            "Donor_ID",
            "Donor_Name",
            "Donor_Type",
            "City"
        ]
    ],

    on="Donor_ID",

    how="left"
)


# ------------------------------------------------------------
# SORT DONORS
# ------------------------------------------------------------

donor_data = donor_data.sort_values(
    "Donation_Count",
    ascending=False
)


donor_data["Total_Quantity_KG"] = (
    donor_data["Total_Quantity_KG"].round(2)
)


donor_data["Average_Quantity_KG"] = (
    donor_data["Average_Quantity_KG"].round(2)
)


# ============================================================
# 6. NGO DATA
# ============================================================
#
# FINAL NGO COLUMNS:
#
# NGO_ID
# User_ID
# Organization_Name
# Phone
# Address
# Capacity
# Food_Types
# Latitude
# Longitude
#
# IMPORTANT:
# The original P2_NGO sheet does NOT contain all these fields.
# We therefore derive or mark missing fields transparently.
# ============================================================


# ------------------------------------------------------------
# GET NGO IDs USED IN CLAIMS
# ------------------------------------------------------------

active_ngo_ids = (
    claims["NGO_ID"]
    .dropna()
    .astype(str)
    .unique()
)


# ------------------------------------------------------------
# COPY ORIGINAL NGO DATA
# ------------------------------------------------------------

ngo_data = ngos.copy()


ngo_data["NGO_ID"] = (
    ngo_data["NGO_ID"]
    .astype(str)
)


# Keep only NGOs that appear in claims
ngo_data = ngo_data[
    ngo_data["NGO_ID"].isin(active_ngo_ids)
].copy()


# ------------------------------------------------------------
# ORGANIZATION NAME
# ------------------------------------------------------------

ngo_data["Organization_Name"] = (
    ngo_data["NGO_Name"]
    .astype(str)
    .str.strip()
)


# ------------------------------------------------------------
# USER ID
# ------------------------------------------------------------

# User_ID does not exist in the original NGO sheet.
# We create a stable ID based on NGO_ID.

ngo_data["User_ID"] = (
    "USER_" + ngo_data["NGO_ID"]
)


# ------------------------------------------------------------
# PHONE
# ------------------------------------------------------------

# Phone information is not available in the dataset.

ngo_data["Phone"] = "Not Provided"


# ------------------------------------------------------------
# ADDRESS
# ------------------------------------------------------------

# Build an address from the available City and Service_Area.

ngo_data["Address"] = (
    ngo_data["City"]
    .fillna("Unknown")
    .astype(str)
    + " - "
    + ngo_data["Service_Area"]
    .fillna("Unknown")
    .astype(str)
)


# ------------------------------------------------------------
# CAPACITY
# ------------------------------------------------------------

# Original dataset provides:
# Beneficiaries_Served_Monthly
#
# It does NOT provide KG capacity.
#
# We use a simple estimated capacity:
#
# monthly beneficiaries × 5 KG
#
# This is an ESTIMATE for dashboard visualization.

ngo_data["Capacity"] = (
    pd.to_numeric(
        ngo_data["Beneficiaries_Served_Monthly"],
        errors="coerce"
    )
    .fillna(0)
    * 5
).round(2)


# ------------------------------------------------------------
# FOOD TYPES
# ------------------------------------------------------------

# Accepted food types are not available in the original NGO data.

ngo_data["Food_Types"] = "Mixed"


# ------------------------------------------------------------
# CITY COORDINATES
# ------------------------------------------------------------

# Approximate city-level coordinates for map visualization.

city_coordinates = {

    "Delhi NCR": (
        28.6139,
        77.2090
    ),

    "Delhi": (
        28.6139,
        77.2090
    ),

    "Mumbai": (
        19.0760,
        72.8777
    ),

    "Bengaluru": (
        12.9716,
        77.5946
    ),

    "Bangalore": (
        12.9716,
        77.5946
    ),

    "Chennai": (
        13.0827,
        80.2707
    ),

    "Kolkata": (
        22.5726,
        88.3639
    ),

    "Hyderabad": (
        17.3850,
        78.4867
    ),

    "Pune": (
        18.5204,
        73.8567
    ),

    "Lucknow": (
        26.8467,
        80.9462
    ),

    "Jaipur": (
        26.9124,
        75.7873
    ),

    "Ahmedabad": (
        23.0225,
        72.5714
    ),

    "Remote": (
        20.5937,
        78.9629
    )
}


# ------------------------------------------------------------
# LATITUDE
# ------------------------------------------------------------

ngo_data["Latitude"] = (
    ngo_data["City"]
    .map(
        lambda city:
        city_coordinates.get(
            str(city),
            (None, None)
        )[0]
    )
)


# ------------------------------------------------------------
# LONGITUDE
# ------------------------------------------------------------

ngo_data["Longitude"] = (
    ngo_data["City"]
    .map(
        lambda city:
        city_coordinates.get(
            str(city),
            (None, None)
        )[1]
    )
)


# ------------------------------------------------------------
# FINAL NGO COLUMNS
# ------------------------------------------------------------

ngo_data = ngo_data[
    [
        "NGO_ID",
        "User_ID",
        "Organization_Name",
        "Phone",
        "Address",
        "Capacity",
        "Food_Types",
        "Latitude",
        "Longitude"
    ]
].copy()


# ------------------------------------------------------------
# SORT NGO DATA
# ------------------------------------------------------------

ngo_data = ngo_data.sort_values(
    "Organization_Name",
    ascending=True
).reset_index(
    drop=True
)


# ------------------------------------------------------------
# ROUND NUMERIC COLUMNS
# ------------------------------------------------------------

ngo_data["Capacity"] = (
    ngo_data["Capacity"].round(2)
)


ngo_data["Latitude"] = (
    ngo_data["Latitude"].round(6)
)


ngo_data["Longitude"] = (
    ngo_data["Longitude"].round(6)
)


# ============================================================
# 7. MONTHLY DONATION TRENDS
# ============================================================

monthly_data = (
    donations
    .dropna(
        subset=["Donation_Date"]
    )
    .assign(
        Month=lambda x:
            x["Donation_Date"]
            .dt.to_period("M")
            .astype(str)
    )
    .groupby("Month")
    .agg(
        Donation_Count=(
            "Donation_ID",
            "count"
        ),

        Total_Quantity_KG=(
            "Quantity_KG",
            "sum"
        ),

        Average_Quantity_KG=(
            "Quantity_KG",
            "mean"
        )
    )
    .reset_index()
)


monthly_data["Total_Quantity_KG"] = (
    monthly_data["Total_Quantity_KG"].round(2)
)


monthly_data["Average_Quantity_KG"] = (
    monthly_data["Average_Quantity_KG"].round(2)
)


# ============================================================
# 8. PICKUP / DELIVERY STATUS DATA
# ============================================================

pickup_data = (
    claims
    .groupby("Delivery_Status")
    .agg(
        Claim_Count=(
            "Claim_ID",
            "count"
        ),

        Total_Claimed_KG=(
            "Claimed_Quantity_KG",
            "sum"
        ),

        Average_Pickup_Delay_Min=(
            "Pickup_Delay_Min",
            "mean"
        )
    )
    .reset_index()
)


pickup_data["Total_Claimed_KG"] = (
    pickup_data["Total_Claimed_KG"].round(2)
)


pickup_data["Average_Pickup_Delay_Min"] = (
    pickup_data["Average_Pickup_Delay_Min"].round(2)
)


# ============================================================
# 9. PICKUP TIME DATA
# ============================================================

pickup_time_data = (
    donations
    .groupby("Pickup_Time")
    .agg(
        Donation_Count=(
            "Donation_ID",
            "count"
        ),

        Total_Quantity_KG=(
            "Quantity_KG",
            "sum"
        ),

        Average_Quantity_KG=(
            "Quantity_KG",
            "mean"
        )
    )
    .reset_index()
    .sort_values(
        "Donation_Count",
        ascending=False
    )
)


pickup_time_data["Total_Quantity_KG"] = (
    pickup_time_data["Total_Quantity_KG"].round(2)
)


pickup_time_data["Average_Quantity_KG"] = (
    pickup_time_data["Average_Quantity_KG"].round(2)
)


# ============================================================
# 10. FILTER-READY MASTER DATA
# ============================================================
# This file keeps ONE ROW PER DONATION so dashboard filters can
# recalculate KPIs without double-counting donations when a
# donation has multiple claims.
# ============================================================

# -------------------------
# Aggregate claims to Donation_ID level
# -------------------------

claims_work = claims.copy()

claims_work["Claim_Date"] = pd.to_datetime(
    claims_work["Claim_Date"],
    errors="coerce"
)

# Latest claim for each donation - used for the dashboard's
# Delivery Status filter and NGO information.
latest_claim = (
    claims_work
    .sort_values(["Donation_ID", "Claim_Date"])
    .drop_duplicates("Donation_ID", keep="last")
    [[
        "Donation_ID",
        "NGO_ID",
        "Delivery_Status",
        "Claim_Date"
    ]]
    .copy()
)

# Claim-level metrics aggregated safely to donation level.
claim_summary = (
    claims_work
    .groupby("Donation_ID", dropna=False)
    .agg(
        Claim_Count=("Claim_ID", "count"),
        Total_Claimed_KG=("Claimed_Quantity_KG", "sum"),
        Delivered_Claim_Count=(
            "Delivery_Status_Clean",
            lambda x: (x == "delivered").sum()
        ),
        Delivered_Quantity_KG=(
            "Claimed_Quantity_KG",
            lambda x: x[
                claims_work.loc[x.index, "Delivery_Status_Clean"] == "delivered"
            ].sum()
        ),
        Average_Pickup_Delay_Min=("Pickup_Delay_Min", "mean")
    )
    .reset_index()
)

# Merge latest claim status/NGO with aggregated claim metrics.
filter_data = donations.copy()

filter_data = filter_data.merge(
    latest_claim,
    on="Donation_ID",
    how="left"
)

filter_data = filter_data.merge(
    claim_summary,
    on="Donation_ID",
    how="left"
)

# -------------------------
# Add donor information
# -------------------------

if "Donor_ID" in donors.columns:
    donor_lookup = donors.copy()

    donor_lookup = donor_lookup[
        [
            column
            for column in [
                "Donor_ID",
                "Donor_Name",
                "Donor_Type",
                "City"
            ]
            if column in donor_lookup.columns
        ]
    ].drop_duplicates("Donor_ID")

    filter_data = filter_data.merge(
        donor_lookup,
        on="Donor_ID",
        how="left",
        suffixes=("", "_Donor")
    )

# -------------------------
# Add NGO information
# -------------------------

if "NGO_ID" in ngos.columns:
    ngo_lookup = ngos.copy()

    # Keep only original columns that actually exist.
    ngo_columns = [
        column
        for column in [
            "NGO_ID",
            "NGO_Name",
            "City",
            "Service_Area",
            "Beneficiaries_Served_Monthly",
            "Volunteer_Count",
            "Active"
        ]
        if column in ngo_lookup.columns
    ]

    ngo_lookup = (
        ngo_lookup[ngo_columns]
        .drop_duplicates("NGO_ID")
    )

    filter_data = filter_data.merge(
        ngo_lookup,
        on="NGO_ID",
        how="left",
        suffixes=("", "_NGO")
    )

# -------------------------
# Create clean filter columns
# -------------------------

filter_data["Donation_Date"] = pd.to_datetime(
    filter_data["Donation_Date"],
    errors="coerce"
)

filter_data["Month"] = (
    filter_data["Donation_Date"]
    .dt.to_period("M")
    .astype(str)
)

filter_data["Year"] = (
    filter_data["Donation_Date"]
    .dt.year
)

filter_data["Status"] = (
    filter_data["Status"]
    .astype(str)
    .str.strip()
)

filter_data["Food_Category"] = (
    filter_data["Food_Category"]
    .astype(str)
    .str.strip()
)

filter_data["Pickup_Location"] = (
    filter_data["Pickup_Location"]
    .astype(str)
    .str.strip()
)

filter_data["Pickup_Time"] = (
    filter_data["Pickup_Time"]
    .astype(str)
    .str.strip()
)

filter_data["Delivery_Status"] = (
    filter_data["Delivery_Status"]
    .fillna("No Claim")
    .astype(str)
    .str.strip()
)

# Numeric columns used by the dashboard.
for column in [
    "Quantity_KG",
    "Estimated_Meals",
    "Claim_Count",
    "Total_Claimed_KG",
    "Delivered_Claim_Count",
    "Delivered_Quantity_KG",
    "Average_Pickup_Delay_Min"
]:
    if column in filter_data.columns:
        filter_data[column] = pd.to_numeric(
            filter_data[column],
            errors="coerce"
        )

# Fill claim metrics for donations that have no claim yet.
for column in [
    "Claim_Count",
    "Total_Claimed_KG",
    "Delivered_Claim_Count",
    "Delivered_Quantity_KG"
]:
    filter_data[column] = filter_data[column].fillna(0)

# Keep one row per Donation_ID and sort chronologically.
filter_data = (
    filter_data
    .drop_duplicates("Donation_ID")
    .sort_values("Donation_Date")
    .reset_index(drop=True)
)

# Save the master filter-ready dataset.
filter_data.to_csv(
    OUTPUT_DIR / "filter_data.csv",
    index=False
)

print("\nFILTER-READY DATA:")
print("Rows:", len(filter_data))
print("Columns:", filter_data.columns.tolist())
print(
    filter_data[
        [
            "Donation_ID",
            "Donation_Date",
            "Food_Category",
            "Pickup_Location",
            "Pickup_Time",
            "Delivery_Status",
            "Quantity_KG",
            "Delivered_Quantity_KG"
        ]
    ].head(10).to_string(index=False)
)


# ============================================================
# 11. SAVE CSV FILES
# ============================================================

kpi_data.to_csv(
    OUTPUT_DIR / "kpi_data.csv",
    index=False
)


category_data.to_csv(
    OUTPUT_DIR / "category_data.csv",
    index=False
)


location_data.to_csv(
    OUTPUT_DIR / "location_data.csv",
    index=False
)


donor_data.to_csv(
    OUTPUT_DIR / "donor_data.csv",
    index=False
)


ngo_data.to_csv(
    OUTPUT_DIR / "ngo_data.csv",
    index=False
)


monthly_data.to_csv(
    OUTPUT_DIR / "monthly_data.csv",
    index=False
)


pickup_data.to_csv(
    OUTPUT_DIR / "pickup_data.csv",
    index=False
)


pickup_time_data.to_csv(
    OUTPUT_DIR / "pickup_time_data.csv",
    index=False
)


# ============================================================
# 12. VERIFY OUTPUT
# ============================================================

print("\n" + "=" * 60)
print("DASHBOARD DATASETS CREATED SUCCESSFULLY")
print("=" * 60)


# ------------------------------------------------------------
# KPI
# ------------------------------------------------------------

print("\nKPI DATA:")
print(
    kpi_data.to_string(
        index=False
    )
)


# ------------------------------------------------------------
# CATEGORY
# ------------------------------------------------------------

print("\nCATEGORY DATA:")
print(
    category_data.to_string(
        index=False
    )
)


# ------------------------------------------------------------
# LOCATION
# ------------------------------------------------------------

print("\nLOCATION DATA:")
print(
    location_data
    .head(10)
    .to_string(
        index=False
    )
)


# ------------------------------------------------------------
# TOP DONORS
# ------------------------------------------------------------

print("\nTOP DONORS:")
print(
    donor_data
    .head(10)
    .to_string(
        index=False
    )
)


# ------------------------------------------------------------
# NGO DATA
# ------------------------------------------------------------

print("\nNGO DATA:")
print(
    ngo_data
    .head(10)
    .to_string(
        index=False
    )
)


# ------------------------------------------------------------
# MONTHLY DATA
# ------------------------------------------------------------

print("\nMONTHLY DATA:")
print(
    monthly_data.to_string(
        index=False
    )
)


# ------------------------------------------------------------
# PICKUP DATA
# ------------------------------------------------------------

print("\nPICKUP DATA:")
print(
    pickup_data.to_string(
        index=False
    )
)


# ------------------------------------------------------------
# PICKUP TIME DATA
# ------------------------------------------------------------

print("\nPICKUP TIME DATA:")
print(
    pickup_time_data.to_string(
        index=False
    )
)


# ------------------------------------------------------------
# OUTPUT FILES
# ------------------------------------------------------------

print("\nOUTPUT FILES:")

for file in sorted(
    OUTPUT_DIR.glob("*.csv")
):
    print(file)