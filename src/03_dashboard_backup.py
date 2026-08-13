# ============================================================
# FOOD WASTE MANAGEMENT DASHBOARD
# ============================================================

import streamlit as st
import pandas as pd
import plotly.express as px
from pathlib import Path


# ============================================================
# PAGE CONFIGURATION
# ============================================================

st.set_page_config(
    page_title="Food Waste Management Dashboard",
    page_icon="🍽️",
    layout="wide",
    initial_sidebar_state="expanded"
)


# ============================================================
# PROJECT PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent
OUTPUT_DIR = BASE_DIR / "output"


# ============================================================
# CUSTOM CSS
# ============================================================

st.markdown(
    """
    <style>

    .main-title {
        font-size: 42px;
        font-weight: 700;
        text-align: center;
        margin-bottom: 5px;
    }

    .sub-title {
        text-align: center;
        font-size: 18px;
        color: #666;
        margin-bottom: 30px;
    }

    .kpi-card {
        padding: 20px;
        border-radius: 12px;
        background-color: #f8f9fa;
        border: 1px solid #e5e7eb;
        text-align: center;
        min-height: 130px;
    }

    .kpi-title {
        font-size: 15px;
        color: #666;
        margin-bottom: 10px;
    }

    .kpi-value {
        font-size: 28px;
        font-weight: 700;
    }

    </style>
    """,
    unsafe_allow_html=True
)


# ============================================================
# LOAD DATA
# ============================================================

@st.cache_data
def load_data():

    kpi = pd.read_csv(OUTPUT_DIR / "kpi_data.csv")
    category = pd.read_csv(OUTPUT_DIR / "category_data.csv")
    location = pd.read_csv(OUTPUT_DIR / "location_data.csv")
    donor = pd.read_csv(OUTPUT_DIR / "donor_data.csv")
    ngo = pd.read_csv(OUTPUT_DIR / "ngo_data.csv")
    monthly = pd.read_csv(OUTPUT_DIR / "monthly_data.csv")
    pickup = pd.read_csv(OUTPUT_DIR / "pickup_data.csv")
    pickup_time = pd.read_csv(OUTPUT_DIR / "pickup_time_data.csv")

    return (
        kpi,
        category,
        location,
        donor,
        ngo,
        monthly,
        pickup,
        pickup_time
    )


# ============================================================
# CHECK OUTPUT DIRECTORY
# ============================================================

if not OUTPUT_DIR.exists():

    st.error(
        f"Output folder not found:\n\n{OUTPUT_DIR}"
    )

    st.stop()


# ============================================================
# LOAD ALL DATA
# ============================================================

try:

    (
        kpi,
        category,
        location,
        donor,
        ngo,
        monthly,
        pickup,
        pickup_time
    ) = load_data()

except FileNotFoundError as error:

    st.error(
        "A required CSV file is missing from the output folder."
    )

    st.code(str(error))

    st.stop()


# ============================================================
# CLEAN DATA
# ============================================================

# -------------------------
# KPI DATA
# -------------------------

if "KPI" in kpi.columns and "Value" in kpi.columns:

    kpi["Value"] = pd.to_numeric(
        kpi["Value"],
        errors="coerce"
    )


# -------------------------
# CATEGORY DATA
# -------------------------

if "Total_Quantity_KG" in category.columns:

    category["Total_Quantity_KG"] = pd.to_numeric(
        category["Total_Quantity_KG"],
        errors="coerce"
    )

if "Average_Quantity_KG" in category.columns:

    category["Average_Quantity_KG"] = pd.to_numeric(
        category["Average_Quantity_KG"],
        errors="coerce"
    )


# -------------------------
# LOCATION DATA
# -------------------------

if "Total_Quantity_KG" in location.columns:

    location["Total_Quantity_KG"] = pd.to_numeric(
        location["Total_Quantity_KG"],
        errors="coerce"
    )


# -------------------------
# DONOR DATA
# -------------------------

if "Total_Quantity_KG" in donor.columns:

    donor["Total_Quantity_KG"] = pd.to_numeric(
        donor["Total_Quantity_KG"],
        errors="coerce"
    )


# -------------------------
# NGO DATA
# -------------------------

if "Total_Claimed_KG" in ngo.columns:

    ngo["Total_Claimed_KG"] = pd.to_numeric(
        ngo["Total_Claimed_KG"],
        errors="coerce"
    )


# -------------------------
# MONTHLY DATA
# -------------------------

# IMPORTANT:
# Your actual monthly CSV contains "Month",
# NOT "Donation_Date".

if "Month" in monthly.columns:

    monthly["Month"] = monthly["Month"].astype(str)

if "Total_Quantity_KG" in monthly.columns:

    monthly["Total_Quantity_KG"] = pd.to_numeric(
        monthly["Total_Quantity_KG"],
        errors="coerce"
    )

if "Donation_Count" in monthly.columns:

    monthly["Donation_Count"] = pd.to_numeric(
        monthly["Donation_Count"],
        errors="coerce"
    )


# -------------------------
# PICKUP DATA
# -------------------------

if "Average_Pickup_Delay_Min" in pickup.columns:

    pickup["Average_Pickup_Delay_Min"] = pd.to_numeric(
        pickup["Average_Pickup_Delay_Min"],
        errors="coerce"
    )

if "Total_Claimed_KG" in pickup.columns:

    pickup["Total_Claimed_KG"] = pd.to_numeric(
        pickup["Total_Claimed_KG"],
        errors="coerce"
    )


# -------------------------
# PICKUP TIME DATA
# -------------------------

if "Total_Quantity_KG" in pickup_time.columns:

    pickup_time["Total_Quantity_KG"] = pd.to_numeric(
        pickup_time["Total_Quantity_KG"],
        errors="coerce"
    )


# ============================================================
# HEADER
# ============================================================

st.markdown(
    '<div class="main-title">🍽️ Food Waste Management Dashboard</div>',
    unsafe_allow_html=True
)

st.markdown(
    '<div class="sub-title">'
    'Food Donation • Distribution • Waste • Delivery Analytics'
    '</div>',
    unsafe_allow_html=True
)


# ============================================================
# SIDEBAR
# ============================================================

st.sidebar.title("🎛️ Dashboard Controls")

st.sidebar.markdown(
    """
    Use the dashboard sections below to understand:

    • Food donations  
    • Food distribution  
    • Food waste  
    • Donor activity  
    • NGO activity  
    • Pickup performance  
    • Monthly trends
    """
)


# ============================================================
# KPI SECTION
# ============================================================

st.header("📊 Key Performance Indicators")


# Create dictionary from KPI dataframe

kpi_dict = {}

for _, row in kpi.iterrows():

    if "KPI" in kpi.columns and "Value" in kpi.columns:

        kpi_name = str(row["KPI"])
        kpi_value = row["Value"]

        kpi_dict[kpi_name] = kpi_value


# Helper function

def get_kpi(name, default=0):

    value = kpi_dict.get(name, default)

    try:
        return float(value)
    except:
        return default


# Get KPI values

total_food_donated = get_kpi(
    "Total Food Donated (KG)"
)

total_estimated_meals = get_kpi(
    "Total Estimated Meals"
)

successfully_distributed = get_kpi(
    "Successfully Distributed Food (KG)"
)

food_wasted = get_kpi(
    "Food Wasted (KG)"
)

food_waste_percentage = get_kpi(
    "Food Waste Percentage (%)"
)

distribution_efficiency = get_kpi(
    "Distribution Efficiency (%)"
)

waste_rate = get_kpi(
    "Waste Rate (%)"
)

delivery_success_rate = get_kpi(
    "Delivery Success Rate (%)"
)

average_pickup_delay = get_kpi(
    "Average Pickup Delay (Min)"
)

median_pickup_delay = get_kpi(
    "Median Pickup Delay (Min)"
)


# ============================================================
# KPI ROW 1
# ============================================================

col1, col2, col3, col4 = st.columns(4)


with col1:

    st.metric(
        "🍱 Total Food Donated",
        f"{total_food_donated:,.2f} KG"
    )


with col2:

    st.metric(
        "🍽️ Estimated Meals",
        f"{total_estimated_meals:,.0f}"
    )


with col3:

    st.metric(
        "🚚 Food Distributed",
        f"{successfully_distributed:,.2f} KG"
    )


with col4:

    st.metric(
        "🗑️ Food Wasted",
        f"{food_wasted:,.2f} KG"
    )


# ============================================================
# KPI ROW 2
# ============================================================

col5, col6, col7, col8 = st.columns(4)


with col5:

    st.metric(
        "♻️ Waste Percentage",
        f"{food_waste_percentage:.2f}%"
    )


with col6:

    st.metric(
        "📦 Distribution Efficiency",
        f"{distribution_efficiency:.2f}%"
    )


with col7:

    st.metric(
        "🚚 Delivery Success",
        f"{delivery_success_rate:.2f}%"
    )


with col8:

    st.metric(
        "⏱️ Avg Pickup Delay",
        f"{average_pickup_delay:.2f} min"
    )


st.divider()


# ============================================================
# FOOD CATEGORY ANALYSIS
# ============================================================

st.header("🍱 Food Category Analysis")


col1, col2 = st.columns(2)


# -------------------------
# Donation Count
# -------------------------

with col1:

    fig_category_count = px.bar(
        category,
        x="Food_Category",
        y="Donation_Count",
        title="Donations by Food Category",
        text_auto=True
    )

    fig_category_count.update_layout(
        xaxis_title="Food Category",
        yaxis_title="Number of Donations",
        xaxis_tickangle=-45
    )

    st.plotly_chart(
        fig_category_count,
        width="stretch"
    )


# -------------------------
# Total Quantity
# -------------------------

with col2:

    fig_category_quantity = px.bar(
        category,
        x="Food_Category",
        y="Total_Quantity_KG",
        title="Total Food Donated by Category",
        text_auto=".2s"
    )

    fig_category_quantity.update_layout(
        xaxis_title="Food Category",
        yaxis_title="Quantity (KG)",
        xaxis_tickangle=-45
    )

    st.plotly_chart(
        fig_category_quantity,
        width="stretch"
    )


# ============================================================
# LOCATION ANALYSIS
# ============================================================

st.header("📍 Donation Location Analysis")


fig_location = px.bar(
    location.sort_values(
        "Total_Quantity_KG",
        ascending=False
    ),
    x="Pickup_Location",
    y="Total_Quantity_KG",
    title="Food Donations by Location",
    text_auto=".2s"
)

fig_location.update_layout(
    xaxis_title="Pickup Location",
    yaxis_title="Total Food (KG)",
    xaxis_tickangle=-45
)

st.plotly_chart(
    fig_location,
    width="stretch"
)


# ============================================================
# MONTHLY TREND
# ============================================================

st.header("📈 Monthly Donation Trend")


# Your CSV uses Month.
# DO NOT use Donation_Date here.

monthly_chart = monthly.copy()


# Sort months chronologically

if "Month" in monthly_chart.columns:

    monthly_chart["_sort_date"] = pd.to_datetime(
        monthly_chart["Month"],
        format="%Y-%m",
        errors="coerce"
    )

    monthly_chart = monthly_chart.sort_values(
        "_sort_date"
    )

    monthly_chart = monthly_chart.drop(
        columns=["_sort_date"]
    )


fig_monthly = px.line(
    monthly_chart,
    x="Month",
    y="Total_Quantity_KG",
    markers=True,
    title="Monthly Food Donation Trend"
)

fig_monthly.update_layout(
    xaxis_title="Month",
    yaxis_title="Food Donated (KG)"
)

st.plotly_chart(
    fig_monthly,
    width="stretch"
)


# ============================================================
# MONTHLY DONATION COUNT
# ============================================================

fig_monthly_count = px.bar(
    monthly_chart,
    x="Month",
    y="Donation_Count",
    title="Monthly Donation Count",
    text_auto=True
)

fig_monthly_count.update_layout(
    xaxis_title="Month",
    yaxis_title="Number of Donations"
)

st.plotly_chart(
    fig_monthly_count,
    width="stretch"
)


# ============================================================
# TOP DONORS
# ============================================================

st.header("🏆 Top Donors")


col1, col2 = st.columns(2)


# -------------------------
# Top Donors by Quantity
# -------------------------

with col1:

    donor_quantity = donor.sort_values(
        "Total_Quantity_KG",
        ascending=False
    ).head(10)

    fig_donor = px.bar(
        donor_quantity,
        x="Total_Quantity_KG",
        y="Donor_ID",
        orientation="h",
        title="Top 10 Donors by Food Quantity",
        text_auto=".2s"
    )

    fig_donor.update_layout(
        xaxis_title="Total Food Donated (KG)",
        yaxis_title="Donor ID"
    )

    st.plotly_chart(
        fig_donor,
        width="stretch"
    )


# -------------------------
# Donor Table
# -------------------------

with col2:

    st.subheader("Top Donor Details")

    st.dataframe(
        donor_quantity,
        width="stretch",
        hide_index=True
    )


# ============================================================
# TOP NGOS
# ============================================================

st.header("🏆 Top NGOs")


col1, col2 = st.columns(2)


# -------------------------
# NGO Chart
# -------------------------

with col1:

    ngo_quantity = ngo.sort_values(
        "Total_Claimed_KG",
        ascending=False
    ).head(10)

    fig_ngo = px.bar(
        ngo_quantity,
        x="Total_Claimed_KG",
        y="NGO_ID",
        orientation="h",
        title="Top 10 NGOs by Claimed Food",
        text_auto=".2s"
    )

    fig_ngo.update_layout(
        xaxis_title="Claimed Food (KG)",
        yaxis_title="NGO ID"
    )

    st.plotly_chart(
        fig_ngo,
        width="stretch"
    )


# -------------------------
# NGO Table
# -------------------------

with col2:

    st.subheader("Top NGO Details")

    st.dataframe(
        ngo_quantity,
        width="stretch",
        hide_index=True
    )


# ============================================================
# DELIVERY STATUS
# ============================================================

st.header("🚚 Delivery Status Analysis")


col1, col2 = st.columns(2)


# -------------------------
# Delivery Count
# -------------------------

with col1:

    fig_delivery = px.pie(
        pickup,
        names="Delivery_Status",
        values="Claim_Count",
        title="Delivery Status Distribution",
        hole=0.4
    )

    st.plotly_chart(
        fig_delivery,
        width="stretch"
    )


# -------------------------
# Delivery Table
# -------------------------

with col2:

    st.subheader("Delivery Performance")

    st.dataframe(
        pickup,
        width="stretch",
        hide_index=True
    )


# ============================================================
# PICKUP DELAY
# ============================================================

st.header("⏱️ Pickup Delay Analysis")


col1, col2 = st.columns(2)


# -------------------------
# Average Delay
# -------------------------

with col1:

    st.metric(
        "Average Pickup Delay",
        f"{average_pickup_delay:.2f} minutes"
    )

    st.metric(
        "Median Pickup Delay",
        f"{median_pickup_delay:.2f} minutes"
    )


# -------------------------
# Delay by Delivery Status
# -------------------------

with col2:

    fig_delay = px.bar(
        pickup,
        x="Delivery_Status",
        y="Average_Pickup_Delay_Min",
        title="Average Pickup Delay by Delivery Status",
        text_auto=".2f"
    )

    fig_delay.update_layout(
        xaxis_title="Delivery Status",
        yaxis_title="Average Delay (Minutes)"
    )

    st.plotly_chart(
        fig_delay,
        width="stretch"
    )


# ============================================================
# PICKUP TIME ANALYSIS
# ============================================================

st.header("🕐 Donations by Pickup Time")


fig_pickup_time = px.bar(
    pickup_time,
    x="Pickup_Time",
    y="Donation_Count",
    title="Donations by Pickup Time",
    text_auto=True
)

fig_pickup_time.update_layout(
    xaxis_title="Pickup Time",
    yaxis_title="Number of Donations"
)

st.plotly_chart(
    fig_pickup_time,
    width="stretch"
)


# ============================================================
# PICKUP TIME QUANTITY
# ============================================================

fig_pickup_quantity = px.bar(
    pickup_time,
    x="Pickup_Time",
    y="Total_Quantity_KG",
    title="Food Quantity by Pickup Time",
    text_auto=".2s"
)

fig_pickup_quantity.update_layout(
    xaxis_title="Pickup Time",
    yaxis_title="Food Quantity (KG)"
)

st.plotly_chart(
    fig_pickup_quantity,
    width="stretch"
)


# ============================================================
# RAW DATA SECTION
# ============================================================

st.header("📋 Dashboard Data")


with st.expander("View Category Data"):

    st.dataframe(
        category,
        width="stretch",
        hide_index=True
    )


with st.expander("View Location Data"):

    st.dataframe(
        location,
        width="stretch",
        hide_index=True
    )


with st.expander("View Monthly Data"):

    st.dataframe(
        monthly,
        width="stretch",
        hide_index=True
    )


with st.expander("View Pickup Data"):

    st.dataframe(
        pickup,
        width="stretch",
        hide_index=True
    )


# ============================================================
# DOWNLOAD DATA
# ============================================================

st.header("⬇️ Download Dashboard Data")


download_col1, download_col2, download_col3, download_col4 = st.columns(4)


with download_col1:

    st.download_button(
        label="Download KPI Data",
        data=kpi.to_csv(index=False),
        file_name="kpi_data.csv",
        mime="text/csv"
    )


with download_col2:

    st.download_button(
        label="Download Category Data",
        data=category.to_csv(index=False),
        file_name="category_data.csv",
        mime="text/csv"
    )


with download_col3:

    st.download_button(
        label="Download Monthly Data",
        data=monthly.to_csv(index=False),
        file_name="monthly_data.csv",
        mime="text/csv"
    )


with download_col4:

    st.download_button(
        label="Download Location Data",
        data=location.to_csv(index=False),
        file_name="location_data.csv",
        mime="text/csv"
    )


# ============================================================
# FOOTER
# ============================================================

st.divider()

st.markdown(
    """
    <div style="text-align:center; color:#777; padding:20px;">
        🍽️ Food Waste Management Dashboard
        <br>
        Built with Python • Pandas • Plotly • Streamlit
    </div>
    """,
    unsafe_allow_html=True
)