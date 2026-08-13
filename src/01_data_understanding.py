# %%
from pathlib import Path
import pandas as pd

# Find project folder
project_root = Path(__file__).resolve().parents[1]

# Find data folder
data_folder = project_root / "data"

# Automatically find Excel files
excel_files = list(data_folder.glob("*.xlsx"))

print("Excel files found:")

for file in excel_files:
    print(file)


# %%
excel_file = excel_files[0]

excel_data = pd.ExcelFile(excel_file)

print("Excel sheets:")
print(excel_data.sheet_names)

# %%
donations = pd.read_excel(
    excel_file,
    sheet_name="P2_Donations"
)

print("Donations table loaded successfully!")

# %%
print(donations.head())

donations.head(10)

# %%
print("Donation columns:")
print(donations.columns.tolist())

print(donations.columns.tolist())

# %%
print("Dataset shape:")
print(donations.shape)

# %%
print("Data types:")
print(donations.dtypes)

# %%
print("Dataset information:")
donations.info()

# %%
print("Missing values in each column:")
print(donations.isnull().sum())

# %%
print("Duplicate rows:")
print(donations.duplicated().sum())

# %%
print("Duplicate Donation IDs:")
print(donations["Donation_ID"].duplicated().sum())

# %%
print("Food Categories:")
print(donations["Food_Category"].unique())

print("\nDonation Statuses:")
print(donations["Status"].unique())

print("\nPickup Locations:")
print(donations["Pickup_Location"].unique())

print("\nPickup Times:")
print(donations["Pickup_Time"].unique())

# %%
print("Negative Quantity_KG:")
print((donations["Quantity_KG"] < 0).sum())

print("\nNegative Expiry_Hours:")
print((donations["Expiry_Hours"] < 0).sum())

print("\nNegative Estimated_Meals:")
print((donations["Estimated_Meals"] < 0).sum())

# %%
print("Numerical Summary:")
print(donations[[
    "Quantity_KG",
    "Expiry_Hours",
    "Estimated_Meals"
]].describe())

# %%
print("\nDonation Date Range:")
print("Start Date:", donations["Donation_Date"].min())
print("End Date:", donations["Donation_Date"].max())

print("\nDonation Dates by Year:")
print(donations["Donation_Date"].dt.year.value_counts().sort_index())

# %%
print("\nDonation Status Counts:")
print(donations["Status"].value_counts())

print("\nDonation Status Percentage:")
print(
    donations["Status"]
    .value_counts(normalize=True)
    .mul(100)
    .round(2)
)

# %%
print("\nFood Quantity by Status:")
print(
    donations.groupby("Status")["Quantity_KG"]
    .agg(["count", "sum", "mean"])
    .sort_values("sum", ascending=False)
)

# %%
print("\nStatus vs Estimated Meals:")
print(
    donations.groupby("Status")["Estimated_Meals"]
    .agg(["count", "sum", "mean"])
    .sort_values("sum", ascending=False)
)

# %%
claims = pd.read_excel(
    excel_file,
    sheet_name="P2_Claims"
)

print("\nClaims Table:")
print(claims.head())

print("\nClaims Columns:")
print(claims.columns.tolist())

print("\nClaims Shape:")
print(claims.shape)


# %%
print("\nDelivery Status Counts:")
print(claims["Delivery_Status"].value_counts())

print("\nDelivery Status Percentages:")
print(
    claims["Delivery_Status"]
    .value_counts(normalize=True)
    .mul(100)
    .round(2)
)

print("\nClaimed Quantity by Delivery Status:")
print(
    claims.groupby("Delivery_Status")["Claimed_Quantity_KG"]
    .agg(["count", "sum", "mean"])
    .sort_values("sum", ascending=False)
)

# %%
print("\nSUCCESSFULLY DISTRIBUTED FOOD:")

delivered_claims = claims[
    claims["Delivery_Status"] == "Delivered"
]

print("Delivered Claims:", len(delivered_claims))

print(
    "Successfully Distributed Food (KG):",
    round(delivered_claims["Claimed_Quantity_KG"].sum(), 2)
)

print(
    "Average Delivered Quantity (KG):",
    round(delivered_claims["Claimed_Quantity_KG"].mean(), 2)
)

print(
    "Delivery Success Rate (%):",
    round(
        len(delivered_claims) / len(claims) * 100,
        2
    )
)

# %%
print("\nDONATION-CLAIM CONNECTION CHECK:")

print("Total Donations:", len(donations))
print("Total Claims:", len(claims))

print(
    "Claims with matching Donation_ID:",
    claims["Donation_ID"].isin(donations["Donation_ID"]).sum()
)

print(
    "Claims without matching Donation_ID:",
    (~claims["Donation_ID"].isin(donations["Donation_ID"])).sum()
)

print(
    "Unique Donation IDs in Donations:",
    donations["Donation_ID"].nunique()
)

print(
    "Unique Donation IDs in Claims:",
    claims["Donation_ID"].nunique()
)

print(
    "Donation IDs having multiple claims:",
    claims["Donation_ID"].duplicated().sum()
)

# %%
print("\nMERGING DONATIONS WITH CLAIMS:")

donation_claims = donations.merge(
    claims,
    on="Donation_ID",
    how="left",
    suffixes=("_donation", "_claim"),
    validate="one_to_many"
)

print("Merged dataset shape:", donation_claims.shape)

print("\nMerged columns:")
print(donation_claims.columns.tolist())

print("\nFirst 5 merged rows:")
print(donation_claims.head())

# %%
print("\nTOTAL FOOD DONATED:")

total_food_donated = donations["Quantity_KG"].sum()

print(
    "Total Food Donated (KG):",
    round(total_food_donated, 2)
)

print(
    "Total Estimated Meals:",
    donations["Estimated_Meals"].sum()
)

# %%
print("\nFOOD WASTED:")

wasted_donations = donations[
    donations["Status"] == "Wasted"
]

wasted_food_kg = wasted_donations["Quantity_KG"].sum()

print(
    "Wasted Donations:",
    len(wasted_donations)
)

print(
    "Food Wasted (KG):",
    round(wasted_food_kg, 2)
)

print(
    "Wasted Estimated Meals:",
    wasted_donations["Estimated_Meals"].sum()
)

print(
    "Food Waste Percentage (%):",
    round(
        wasted_food_kg / total_food_donated * 100,
        2
    )
)

# %%
print("\nDISTRIBUTION VS WASTE:")

distributed_food_kg = delivered_claims["Claimed_Quantity_KG"].sum()
wasted_food_kg = wasted_donations["Quantity_KG"].sum()

total_handled_food_kg = distributed_food_kg + wasted_food_kg

print(
    "Successfully Distributed Food (KG):",
    round(distributed_food_kg, 2)
)

print(
    "Food Wasted (KG):",
    round(wasted_food_kg, 2)
)

print(
    "Total Distributed + Wasted (KG):",
    round(total_handled_food_kg, 2)
)

print(
    "Distribution Efficiency (%):",
    round(
        distributed_food_kg / total_handled_food_kg * 100,
        2
    )
)

print(
    "Waste Rate (%):",
    round(
        wasted_food_kg / total_handled_food_kg * 100,
        2
    )
)

# %%
print("\nDONATIONS BY FOOD CATEGORY:")

category_summary = (
    donations.groupby("Food_Category")["Quantity_KG"]
    .agg(["count", "sum", "mean"])
    .sort_values("sum", ascending=False)
)

print(category_summary)

# %%
print("\nDONATIONS BY LOCATION:")

location_summary = (
    donations.groupby("Pickup_Location")["Quantity_KG"]
    .agg(["count", "sum", "mean"])
    .sort_values("sum", ascending=False)
)

print(location_summary)

# %%
print("\nMOST ACTIVE DONORS:")

donor_summary = (
    donations.groupby("Donor_ID")["Quantity_KG"]
    .agg(["count", "sum", "mean"])
    .sort_values("count", ascending=False)
)

print(donor_summary.head(10))

# %%
print("\nMOST ACTIVE NGOS:")

ngo_summary = (
    claims.groupby("NGO_ID")["Claimed_Quantity_KG"]
    .agg(["count", "sum", "mean"])
    .sort_values("count", ascending=False)
)

print(ngo_summary.head(10))

# %%
print("\nMONTHLY DONATION TRENDS:")

monthly_donations = (
    donations
    .groupby(donations["Donation_Date"].dt.to_period("M"))["Quantity_KG"]
    .agg(["count", "sum", "mean"])
)

print(monthly_donations)

# %%
print("\nDONATIONS BY PICKUP TIME:")

pickup_time_summary = (
    donations.groupby("Pickup_Time")["Quantity_KG"]
    .agg(["count", "sum", "mean"])
    .sort_values("count", ascending=False)
)

print(pickup_time_summary)

# %%
print("\nPICKUP DELAY ANALYSIS:")

pickup_delay_summary = claims["Pickup_Delay_Min"].describe()

print(pickup_delay_summary)

print(
    "\nAverage Pickup Delay (Minutes):",
    round(claims["Pickup_Delay_Min"].mean(), 2)
)

print(
    "Median Pickup Delay (Minutes):",
    round(claims["Pickup_Delay_Min"].median(), 2)
)

# %%
print("\nFINAL KPI DATASET:")

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
        round(donations["Quantity_KG"].sum(), 2),
        donations["Estimated_Meals"].sum(),
        round(delivered_claims["Claimed_Quantity_KG"].sum(), 2),
        round(wasted_food_kg, 2),
        round(wasted_food_kg / donations["Quantity_KG"].sum() * 100, 2),
        round(distributed_food_kg / total_handled_food_kg * 100, 2),
        round(wasted_food_kg / total_handled_food_kg * 100, 2),
        round(len(delivered_claims) / len(claims) * 100, 2),
        round(claims["Pickup_Delay_Min"].mean(), 2),
        round(claims["Pickup_Delay_Min"].median(), 2)
    ]
})

print(kpi_data)

# %%
print("\nCHART DATASET - FOOD CATEGORY:")

category_chart = (
    donations.groupby("Food_Category")
    .agg(
        Donation_Count=("Donation_ID", "count"),
        Total_Quantity_KG=("Quantity_KG", "sum"),
        Average_Quantity_KG=("Quantity_KG", "mean")
    )
    .sort_values("Total_Quantity_KG", ascending=False)
)

category_chart["Total_Quantity_KG"] = category_chart["Total_Quantity_KG"].round(2)
category_chart["Average_Quantity_KG"] = category_chart["Average_Quantity_KG"].round(2)

print(category_chart)

# %%
print("\nCHART DATASET - LOCATION:")

location_chart = (
    donations.groupby("Pickup_Location")
    .agg(
        Donation_Count=("Donation_ID", "count"),
        Total_Quantity_KG=("Quantity_KG", "sum"),
        Average_Quantity_KG=("Quantity_KG", "mean")
    )
    .sort_values("Total_Quantity_KG", ascending=False)
)

location_chart["Total_Quantity_KG"] = location_chart["Total_Quantity_KG"].round(2)
location_chart["Average_Quantity_KG"] = location_chart["Average_Quantity_KG"].round(2)

print(location_chart)

# %%
print("\nCHART DATASET - TOP DONORS:")

donor_chart = (
    donations.groupby("Donor_ID")
    .agg(
        Donation_Count=("Donation_ID", "count"),
        Total_Quantity_KG=("Quantity_KG", "sum"),
        Average_Quantity_KG=("Quantity_KG", "mean")
    )
    .sort_values("Donation_Count", ascending=False)
    .head(10)
)

donor_chart["Total_Quantity_KG"] = donor_chart["Total_Quantity_KG"].round(2)
donor_chart["Average_Quantity_KG"] = donor_chart["Average_Quantity_KG"].round(2)

print(donor_chart)

# %%
print("\nCHART DATASET - TOP NGOs:")

ngo_chart = (
    claims.groupby("NGO_ID")
    .agg(
        Claim_Count=("Claim_ID", "count"),
        Total_Claimed_KG=("Claimed_Quantity_KG", "sum"),
        Average_Claimed_KG=("Claimed_Quantity_KG", "mean")
    )
    .sort_values("Claim_Count", ascending=False)
    .head(10)
)

ngo_chart["Total_Claimed_KG"] = ngo_chart["Total_Claimed_KG"].round(2)
ngo_chart["Average_Claimed_KG"] = ngo_chart["Average_Claimed_KG"].round(2)

print(ngo_chart)

# %%
print("\nCHART DATASET - MONTHLY DONATIONS:")

monthly_chart = (
    donations.groupby(
        donations["Donation_Date"].dt.to_period("M")
    )
    .agg(
        Donation_Count=("Donation_ID", "count"),
        Total_Quantity_KG=("Quantity_KG", "sum"),
        Average_Quantity_KG=("Quantity_KG", "mean")
    )
    .reset_index()
)

monthly_chart["Donation_Date"] = monthly_chart["Donation_Date"].astype(str)

monthly_chart["Total_Quantity_KG"] = (
    monthly_chart["Total_Quantity_KG"].round(2)
)

monthly_chart["Average_Quantity_KG"] = (
    monthly_chart["Average_Quantity_KG"].round(2)
)

print(monthly_chart)

