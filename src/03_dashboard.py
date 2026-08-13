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
    filter_data_path = OUTPUT_DIR / "filter_data.csv"
    filter_data = pd.read_csv(filter_data_path) if filter_data_path.exists() else pd.DataFrame()

    return (
        kpi,
        category,
        location,
        donor,
        ngo,
        monthly,
        pickup,
        pickup_time,
        filter_data
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
        pickup_time,
        filter_data
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

# Current NGO CSV columns:
# NGO_ID, User_ID, Organization_Name, Phone, Address,
# Capacity, Food_Types, Latitude, Longitude

if "Capacity" in ngo.columns:
    ngo["Capacity"] = pd.to_numeric(
        ngo["Capacity"],
        errors="coerce"
    )

if "Latitude" in ngo.columns:
    ngo["Latitude"] = pd.to_numeric(
        ngo["Latitude"],
        errors="coerce"
    )

if "Longitude" in ngo.columns:
    ngo["Longitude"] = pd.to_numeric(
        ngo["Longitude"],
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
# GLOBAL DASHBOARD FILTERS
# ============================================================

# The filter_data.csv file is the detailed dataset used by the
# dashboard controls.  Streamlit reruns the script when a widget
# value changes, so every section below can respond to the same
# selected filters.

def find_column(df, candidates):
    """Return the first matching column from a list of possible names."""
    if df.empty:
        return None
    for candidate in candidates:
        if candidate in df.columns:
            return candidate
    return None


def unique_options(df, candidates):
    """Get clean, sorted filter options from the first matching column."""
    column = find_column(df, candidates)
    if column is None:
        return ["All"]
    values = (
        df[column]
        .dropna()
        .astype(str)
        .str.strip()
    )
    values = sorted([v for v in values.unique() if v != ""])
    return ["All"] + values


def apply_global_filters(df, location_value, category_value,
                         delivery_value, pickup_value, year_value):
    """Apply all selected global filters to the detailed dataframe."""
    if df.empty:
        return df.copy()

    result = df.copy()

    location_col = find_column(
        result,
        ["Pickup_Location", "Location", "Address", "City"]
    )
    category_col = find_column(
        result,
        ["Food_Category", "Food_Type", "Food_Types", "Category"]
    )
    delivery_col = find_column(
        result,
        ["Delivery_Status", "Claim_Status", "Status"]
    )
    pickup_col = find_column(
        result,
        ["Pickup_Time", "PickupTime"]
    )
    date_col = find_column(
        result,
        ["Donation_Date", "DonationDate", "Date", "Created_At"]
    )

    if location_value != "All" and location_col:
        result = result[
            result[location_col].astype(str).str.strip() == location_value
        ]

    if category_value != "All" and category_col:
        result = result[
            result[category_col].astype(str).str.strip() == category_value
        ]

    if delivery_value != "All" and delivery_col:
        result = result[
            result[delivery_col].astype(str).str.strip() == delivery_value
        ]

    if pickup_value != "All" and pickup_col:
        result = result[
            result[pickup_col].astype(str).str.strip() == pickup_value
        ]

    if year_value != "All" and date_col:
        dates = pd.to_datetime(result[date_col], errors="coerce")
        result = result[dates.dt.year.astype("Int64").astype(str) == year_value]

    return result


def calculate_filtered_dashboard_data(filtered):
    """
    Rebuild the main dashboard datasets from the detailed filtered data.

    This function is intentionally defensive because the exact raw-column
    names are not visible in this dashboard file. If a required raw column
    is unavailable, the existing pre-aggregated CSV is kept unchanged.
    """
    data = {}

    quantity_col = find_column(
        filtered,
        ["Quantity_KG", "Total_Quantity_KG", "Food_Quantity_KG",
         "Donated_Quantity_KG", "Claimed_Quantity_KG"]
    )
    category_col = find_column(
        filtered,
        ["Food_Category", "Food_Type", "Food_Types", "Category"]
    )
    location_col = find_column(
        filtered,
        ["Pickup_Location", "Location", "Address", "City"]
    )
    donor_col = find_column(
        filtered,
        ["Donor_ID", "DonorID", "User_ID"]
    )
    delivery_col = find_column(
        filtered,
        ["Delivery_Status", "Claim_Status", "Status"]
    )
    pickup_col = find_column(
        filtered,
        ["Pickup_Time", "PickupTime"]
    )
    delay_col = find_column(
        filtered,
        [
            "Average_Pickup_Delay_Min",
            "Pickup_Delay_Min",
            "Pickup_Delay",
            "Pickup_Delay_Minutes",
            "Delay_Minutes",
            "Pickup_Delay_Time"
        ]
    )

    if quantity_col:
        filtered[quantity_col] = pd.to_numeric(
            filtered[quantity_col], errors="coerce"
        ).fillna(0)

    if category_col and quantity_col:
        category_filtered = (
            filtered.groupby(category_col, dropna=False)
            .agg(
                Donation_Count=(quantity_col, "size"),
                Total_Quantity_KG=(quantity_col, "sum"),
                Average_Quantity_KG=(quantity_col, "mean")
            )
            .reset_index()
            .rename(columns={category_col: "Food_Category"})
        )
        data["category"] = category_filtered

    if location_col and quantity_col:
        location_filtered = (
            filtered.groupby(location_col, dropna=False)
            .agg(
                Donation_Count=(quantity_col, "size"),
                Total_Quantity_KG=(quantity_col, "sum")
            )
            .reset_index()
            .rename(columns={location_col: "Pickup_Location"})
        )
        data["location"] = location_filtered

    if donor_col and quantity_col:
        donor_filtered = (
            filtered.groupby(donor_col, dropna=False)
            .agg(
                Donation_Count=(quantity_col, "size"),
                Total_Quantity_KG=(quantity_col, "sum")
            )
            .reset_index()
            .rename(columns={donor_col: "Donor_ID"})
        )
        data["donor"] = donor_filtered

    if delivery_col:
        # Build the delivery-status dataset with BOTH:
        # 1. Claim_Count
        # 2. Average_Pickup_Delay_Min
        #
        # The previous version created only Claim_Count here and then
        # replaced `pickup` with that smaller dataframe. The later
        # pickup-delay chart expected Average_Pickup_Delay_Min, which
        # caused the Plotly ValueError shown in the dashboard.
        delivery_filtered = (
            filtered.groupby(delivery_col, dropna=False)
            .size()
            .reset_index(name="Claim_Count")
            .rename(columns={delivery_col: "Delivery_Status"})
        )

        if delay_col:
            filtered[delay_col] = pd.to_numeric(
                filtered[delay_col], errors="coerce"
            )

            delay_by_status = (
                filtered.groupby(delivery_col, dropna=False)[delay_col]
                .mean()
                .reset_index(name="Average_Pickup_Delay_Min")
                .rename(columns={delivery_col: "Delivery_Status"})
            )

            delivery_filtered = delivery_filtered.merge(
                delay_by_status,
                on="Delivery_Status",
                how="left"
            )

        data["pickup"] = delivery_filtered

    if pickup_col and quantity_col:
        pickup_filtered = (
            filtered.groupby(pickup_col, dropna=False)
            .agg(
                Donation_Count=(quantity_col, "size"),
                Total_Quantity_KG=(quantity_col, "sum"),
                Average_Quantity_KG=(quantity_col, "mean")
            )
            .reset_index()
            .rename(columns={pickup_col: "Pickup_Time"})
        )
        data["pickup_time"] = pickup_filtered

    return data


# ------------------------------------------------------------
# FOOD RESCUE CONTROL CENTER
# ------------------------------------------------------------

st.divider()
st.header("🎛️ Food Rescue Control Center")
st.caption(
    "Choose filters below. The dashboard will recalculate the visible "
    "analysis for the selected data."
)

if filter_data.empty:
    st.warning(
        "filter_data.csv was not found. Run "
        "`python src/02_prepare_dashboard_data.py` first."
    )
    filtered_data = pd.DataFrame()
else:
    filter_data = filter_data.copy()

    location_options = unique_options(
        filter_data,
        ["Pickup_Location", "Location", "Address", "City"]
    )
    category_options = unique_options(
        filter_data,
        ["Food_Category", "Food_Type", "Food_Types", "Category"]
    )
    delivery_options = unique_options(
        filter_data,
        ["Delivery_Status", "Claim_Status", "Status"]
    )
    pickup_options = unique_options(
        filter_data,
        ["Pickup_Time", "PickupTime"]
    )

    date_column = find_column(
        filter_data,
        ["Donation_Date", "DonationDate", "Date", "Created_At"]
    )

    if date_column:
        years_series = pd.to_datetime(
            filter_data[date_column], errors="coerce"
        ).dt.year.dropna().astype(int)
        year_options = ["All"] + [
            str(year) for year in sorted(years_series.unique())
        ]
    else:
        year_options = ["All"]

    filter_col1, filter_col2, filter_col3 = st.columns(3)
    filter_col4, filter_col5, reset_col = st.columns(3)

    with filter_col1:
        selected_location = st.selectbox(
            "📍 Location",
            location_options,
            key="global_location"
        )

    with filter_col2:
        selected_category = st.selectbox(
            "🍱 Food Category",
            category_options,
            key="global_category"
        )

    with filter_col3:
        selected_delivery = st.selectbox(
            "🚚 Delivery Status",
            delivery_options,
            key="global_delivery"
        )

    with filter_col4:
        selected_pickup = st.selectbox(
            "🕐 Pickup Time",
            pickup_options,
            key="global_pickup"
        )

    with filter_col5:
        selected_year = st.selectbox(
            "📅 Year",
            year_options,
            key="global_year"
        )

    with reset_col:
        st.markdown("<br>", unsafe_allow_html=True)
        if st.button("🔄 Reset Filters", use_container_width=True):
            for key in [
                "global_location",
                "global_category",
                "global_delivery",
                "global_pickup",
                "global_year"
            ]:
                if key in st.session_state:
                    del st.session_state[key]
            st.rerun()

    # Preserve the original pickup aggregate before replacing it with
    # filter-aware delivery data.
    pickup_baseline = pickup.copy()

    filtered_data = apply_global_filters(
        filter_data,
        selected_location,
        selected_category,
        selected_delivery,
        selected_pickup,
        selected_year
    )

    st.success(
        f"Showing **{len(filtered_data):,}** of "
        f"**{len(filter_data):,}** records"
    )

    # Rebuild aggregate datasets when the raw columns are available.
    rebuilt = calculate_filtered_dashboard_data(filtered_data)

    if "category" in rebuilt:
        category = rebuilt["category"]

    if "location" in rebuilt:
        location = rebuilt["location"]

    if "donor" in rebuilt:
        donor = rebuilt["donor"]

    if "pickup" in rebuilt and "Delivery_Status" in rebuilt["pickup"].columns:
        # Keep the delivery-status aggregate. It now contains Claim_Count
        # and, when available in the filtered raw data,
        # Average_Pickup_Delay_Min.
        pickup = rebuilt["pickup"]

        # If the detailed filter dataset does not contain a pickup-delay
        # column, preserve the delay values from the original pre-aggregated
        # pickup_data.csv so the delay chart still works.
        if (
            "Average_Pickup_Delay_Min" not in pickup.columns
            and "Average_Pickup_Delay_Min" in pickup_baseline.columns
        ):
            pickup = pickup.merge(
                pickup_baseline[
                    ["Delivery_Status", "Average_Pickup_Delay_Min"]
                ],
                on="Delivery_Status",
                how="left"
            )

    if "pickup_time" in rebuilt:
        pickup_time = rebuilt["pickup_time"]



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



# =====================================================
# FOOD RESCUE SCORE
# =====================================================

# Higher distribution efficiency = better
efficiency_score = min(distribution_efficiency, 100)

# Higher delivery success = better
delivery_score = min(delivery_success_rate, 100)

# Lower waste rate = better
waste_score = max(0, 100 - waste_rate)

# Lower pickup delay = better
pickup_score = max(0, 100 - average_pickup_delay)

# Overall Food Rescue Score
food_rescue_score = (
    efficiency_score * 0.35
    + delivery_score * 0.30
    + waste_score * 0.20
    + pickup_score * 0.15
)

food_rescue_score = round(food_rescue_score, 1)

# ============================================================
# FOOD RESCUE INTELLIGENCE
# ============================================================

st.divider()

st.header("🧠 Food Rescue Intelligence")
st.caption("Automatic insights generated from the dashboard KPIs")

# ------------------------------------------------------------
# PERFORMANCE SNAPSHOT
# ------------------------------------------------------------

intel_col1, intel_col2, intel_col3, intel_col4 = st.columns(4)

with intel_col1:
    st.metric(
        "🏆 Rescue Score",
        f"{food_rescue_score:.1f} / 100",
        border=True
    )

with intel_col2:
    st.metric(
        "🚚 Delivery Success",
        f"{delivery_success_rate:.2f}%",
        border=True
    )

with intel_col3:
    st.metric(
        "♻️ Waste Rate",
        f"{waste_rate:.2f}%",
        border=True
    )

with intel_col4:
    st.metric(
        "⏱️ Pickup Delay",
        f"{average_pickup_delay:.2f} min",
        border=True
    )


# ------------------------------------------------------------
# AUTOMATIC ALERTS
# ------------------------------------------------------------

st.subheader("🚨 Priority Alerts")

alert_col1, alert_col2 = st.columns(2)

with alert_col1:

    # Delivery alert
    if delivery_success_rate < 60:
        st.error(
            f"🚚 **Delivery Alert**\n\n"
            f"Delivery success is only **{delivery_success_rate:.2f}%**. "
            f"Delivery coordination needs improvement."
        )
    elif delivery_success_rate < 80:
        st.warning(
            f"🚚 **Delivery Watch**\n\n"
            f"Delivery success is **{delivery_success_rate:.2f}%**. "
            f"There is room for improvement."
        )
    else:
        st.success(
            f"🚚 **Delivery Performance**\n\n"
            f"Delivery success is **{delivery_success_rate:.2f}%**."
        )

with alert_col2:

    # Waste alert
    if waste_rate > 10:
        st.error(
            f"♻️ **Critical Waste Alert**\n\n"
            f"Food waste rate is **{waste_rate:.2f}%**."
        )
    elif waste_rate > 5:
        st.warning(
            f"♻️ **Waste Alert**\n\n"
            f"Food waste rate is **{waste_rate:.2f}%**. "
            f"Waste reduction should be prioritized."
        )
    else:
        st.success(
            f"♻️ **Waste Performance**\n\n"
            f"Food waste rate is only **{waste_rate:.2f}%**."
        )


# ------------------------------------------------------------
# OPERATIONAL ALERTS
# ------------------------------------------------------------

st.subheader("⚡ Operational Insights")

op_col1, op_col2 = st.columns(2)

with op_col1:

    if average_pickup_delay > 40:
        st.error(
            f"⏱️ **Pickup Delay Alert**\n\n"
            f"Average pickup delay is **{average_pickup_delay:.2f} minutes**. "
            f"Faster pickup coordination is recommended."
        )
    elif average_pickup_delay > 30:
        st.warning(
            f"⏱️ **Pickup Delay Watch**\n\n"
            f"Average pickup delay is **{average_pickup_delay:.2f} minutes**."
        )
    else:
        st.success(
            f"⏱️ **Pickup Performance**\n\n"
            f"Average pickup delay is **{average_pickup_delay:.2f} minutes**."
        )


with op_col2:

    if distribution_efficiency < 70:
        st.error(
            f"📦 **Distribution Alert**\n\n"
            f"Distribution efficiency is **{distribution_efficiency:.2f}%**. "
            f"Distribution efficiency needs immediate attention."
        )
    elif distribution_efficiency < 85:
        st.warning(
            f"📦 **Distribution Watch**\n\n"
            f"Distribution efficiency is **{distribution_efficiency:.2f}%**."
        )
    else:
        st.success(
            f"📦 **Distribution Performance**\n\n"
            f"Distribution efficiency is **{distribution_efficiency:.2f}%**."
        )


# ------------------------------------------------------------
# RECOMMENDED ACTION
# ------------------------------------------------------------

st.subheader("💡 Recommended Action")

# Find the biggest operational weakness
delivery_gap = 100 - delivery_success_rate
waste_gap = waste_rate
pickup_gap = average_pickup_delay
distribution_gap = 100 - distribution_efficiency

if delivery_gap >= max(waste_gap, pickup_gap, distribution_gap):

    st.info(
        "🚚 **Prioritize Delivery Coordination**\n\n"
        f"Delivery success is currently **{delivery_success_rate:.2f}%**. "
        "Improving delivery coordination should be the first operational priority."
    )

elif waste_gap >= max(delivery_gap, pickup_gap, distribution_gap):

    st.info(
        "♻️ **Prioritize Waste Reduction**\n\n"
        f"Food waste is currently **{waste_rate:.2f}%**. "
        "Focus on reducing spoilage, expired food and unsuccessful donations."
    )

elif pickup_gap >= max(delivery_gap, waste_gap, distribution_gap):

    st.info(
        "⏱️ **Prioritize Pickup Optimization**\n\n"
        f"Average pickup delay is **{average_pickup_delay:.2f} minutes**. "
        "Improve pickup scheduling and donor-NGO coordination."
    )

else:

    st.info(
        "📦 **Prioritize Distribution Efficiency**\n\n"
        f"Distribution efficiency is currently **{distribution_efficiency:.2f}%**. "
        "Improve allocation and delivery of donated food."
    )


# ------------------------------------------------------------
# EXECUTIVE SUMMARY
# ------------------------------------------------------------

st.subheader("📋 Executive Summary")

summary_col1, summary_col2 = st.columns(2)

with summary_col1:

    st.write(
        f"""
        **Food Rescue Score:** {food_rescue_score:.1f}/100

        **Food Donated:** {total_food_donated:,.2f} KG

        **Food Distributed:** {successfully_distributed:,.2f} KG

        **Food Wasted:** {food_wasted:,.2f} KG
        """
    )

with summary_col2:

    st.write(
        f"""
        **Distribution Efficiency:** {distribution_efficiency:.2f}%

        **Delivery Success:** {delivery_success_rate:.2f}%

        **Waste Rate:** {waste_rate:.2f}%

        **Average Pickup Delay:** {average_pickup_delay:.2f} min
        """
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
# FOOD RESCUE SCORE
# ============================================================

st.header("🏆 Food Rescue Score")

score_col1, score_col2, score_col3 = st.columns([1, 2, 1])

with score_col2:
    st.metric(
        label="🌱 FOOD RESCUE SCORE",
        value=f"{food_rescue_score:.1f} / 100",
        border=True,
        help="Combined score based on distribution efficiency, delivery success, waste reduction, and pickup performance."
    )

if food_rescue_score >= 80:
    st.success("🟢 Excellent performance — food rescue operations are highly effective.")
elif food_rescue_score >= 60:
    st.warning("🟡 Good performance — there is still room for improvement.")
else:
    st.error("🔴 Needs improvement — focus on reducing waste and improving delivery.")


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
# NGO NETWORK INTELLIGENCE
# ============================================================

st.header("🌍 NGO Network Intelligence")

# -------------------------
# Prepare NGO data
# -------------------------

ngo_network = ngo.copy()

if "Capacity" in ngo_network.columns:
    ngo_network["Capacity"] = pd.to_numeric(
        ngo_network["Capacity"],
        errors="coerce"
    )
else:
    ngo_network["Capacity"] = 0

if "Latitude" in ngo_network.columns:
    ngo_network["Latitude"] = pd.to_numeric(
        ngo_network["Latitude"],
        errors="coerce"
    )
else:
    ngo_network["Latitude"] = None

if "Longitude" in ngo_network.columns:
    ngo_network["Longitude"] = pd.to_numeric(
        ngo_network["Longitude"],
        errors="coerce"
    )
else:
    ngo_network["Longitude"] = None


# -------------------------
# NGO KPI cards
# -------------------------

total_ngos = len(ngo_network)

total_ngo_capacity = ngo_network["Capacity"].fillna(0).sum()

average_ngo_capacity = ngo_network["Capacity"].mean()

if (
    not ngo_network.empty
    and ngo_network["Capacity"].notna().any()
    and "Organization_Name" in ngo_network.columns
):
    largest_ngo_name = str(
        ngo_network.loc[
            ngo_network["Capacity"].idxmax(),
            "Organization_Name"
        ]
    )
else:
    largest_ngo_name = "N/A"


ngo_kpi1, ngo_kpi2, ngo_kpi3, ngo_kpi4 = st.columns(4)

with ngo_kpi1:
    st.metric(
        "🏢 Total NGOs",
        f"{total_ngos:,}"
    )

with ngo_kpi2:
    st.metric(
        "📦 Total Capacity",
        f"{total_ngo_capacity:,.0f} KG"
    )

with ngo_kpi3:
    st.metric(
        "📊 Avg Capacity / NGO",
        f"{average_ngo_capacity:,.0f} KG"
        if pd.notna(average_ngo_capacity)
        else "0 KG"
    )

with ngo_kpi4:
    st.metric(
        "🏆 Largest NGO",
        largest_ngo_name
    )


st.divider()


# ============================================================
# NGO MAP + CAPACITY CHART
# ============================================================

map_col, capacity_col = st.columns(2)


# -------------------------
# NGO NETWORK MAP
# -------------------------

with map_col:

    st.subheader("📍 NGO Network Map")

    ngo_map = ngo_network.dropna(
        subset=["Latitude", "Longitude"]
    ).copy()

    if not ngo_map.empty:

        # Scale capacity so map markers remain readable.
        max_capacity = ngo_map["Capacity"].max()

        if pd.notna(max_capacity) and max_capacity > 0:
            ngo_map["Map_Size"] = (
                100
                + (
                    ngo_map["Capacity"].fillna(0)
                    / max_capacity
                ) * 900
            )
        else:
            ngo_map["Map_Size"] = 200

        st.map(
            ngo_map,
            latitude="Latitude",
            longitude="Longitude",
            size="Map_Size",
            zoom=4,
            height=450
        )

        st.caption(
            "Marker size represents NGO capacity."
        )

    else:

        st.warning(
            "No valid latitude/longitude data is available for the NGO map."
        )


# -------------------------
# NGO CAPACITY CHART
# -------------------------

with capacity_col:

    st.subheader("📦 Top NGOs by Capacity")

    if "Organization_Name" in ngo_network.columns:

        ngo_capacity = (
            ngo_network
            .sort_values(
                "Capacity",
                ascending=False
            )
            .head(10)
        )

        fig_ngo_capacity = px.bar(
            ngo_capacity,
            x="Capacity",
            y="Organization_Name",
            orientation="h",
            title="Top 10 NGOs by Capacity",
            text_auto=".2s"
        )

        fig_ngo_capacity.update_layout(
            xaxis_title="Capacity (KG)",
            yaxis_title="Organization",
            yaxis=dict(
                categoryorder="total ascending"
            )
        )

        st.plotly_chart(
            fig_ngo_capacity,
            width="stretch"
        )

    else:

        st.warning(
            "Organization_Name column is missing."
        )


# ============================================================
# NGO DIRECTORY
# ============================================================

st.subheader("🏢 NGO Directory")

directory_columns = [
    "NGO_ID",
    "Organization_Name",
    "Phone",
    "Address",
    "Capacity",
    "Food_Types",
    "Latitude",
    "Longitude"
]

available_directory_columns = [
    column
    for column in directory_columns
    if column in ngo_network.columns
]

if available_directory_columns:

    ngo_directory = (
        ngo_network[
            available_directory_columns
        ]
        .sort_values(
            "Capacity",
            ascending=False
        )
    )

    st.dataframe(
        ngo_directory,
        width="stretch",
        hide_index=True
    )

else:

    st.warning(
        "No NGO directory columns were found."
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

    if (
        not pickup.empty
        and "Delivery_Status" in pickup.columns
        and "Average_Pickup_Delay_Min" in pickup.columns
    ):
        delay_chart_data = pickup.copy()
        delay_chart_data["Average_Pickup_Delay_Min"] = pd.to_numeric(
            delay_chart_data["Average_Pickup_Delay_Min"],
            errors="coerce"
        )
        delay_chart_data = delay_chart_data.dropna(
            subset=["Average_Pickup_Delay_Min"]
        )

        if not delay_chart_data.empty:
            fig_delay = px.bar(
                delay_chart_data,
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
        else:
            st.info(
                "No pickup-delay data is available for the selected filters."
            )
    else:
        st.info(
            "Pickup-delay data is not available for the selected filters."
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

if not filter_data.empty:
    with st.expander("View Filtered Detailed Data"):
        st.dataframe(
            filtered_data,
            width="stretch",
            hide_index=True
        )


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

if not filter_data.empty:
    st.download_button(
        label="⬇️ Download Filtered Data",
        data=filtered_data.to_csv(index=False),
        file_name="filtered_food_waste_data.csv",
        mime="text/csv",
        use_container_width=True
    )

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