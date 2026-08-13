import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Package,
  Heart,
  Trash2,
  TrendingUp,
  Clock,
  Users,
} from "lucide-react";
import StatCard from "../components/dashboard/StatCard";
import DonationTrendChart from "../components/dashboard/DonationTrendChart";
import CategoryChart from "../components/dashboard/CategoryChart";
import LocationChart from "../components/dashboard/LocationChart";
import DonorChart from "../components/dashboard/DonorChart";
import NGOChart from "../components/dashboard/NGOChart";
import DonationStatusChart from "../components/dashboard/DonationStatusChart";
import Loading from "../components/common/Loading";
import ErrorState from "../components/common/ErrorState";
import { useDashboardData } from "../hooks/useDashboardData";

const Dashboard = () => {
  const {
    data,
    trends,
    statusSummary,
    loading,
    error,
    refetch,
  } = useDashboardData();
  const [trendType, setTrendType] = useState("area");

  if (loading) {
    return <Loading text="Loading dashboard data..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={refetch} />;
  }

  if (!data) {
    return (
      <div className="text-center py-12 text-secondary-500">
        No data available yet.
      </div>
    );
  }

  const trendData =
    trends?.map((item) => ({
      name: item.month,
      donated: item.donated,
      distributed: item.distributed,
      wasted: item.wasted,
    })) || [];

  const statusData =
    statusSummary?.map((item) => ({
      status: item.status,
      count: item.count,
    })) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
            Food Donation Overview
          </h2>
          <p className="text-secondary-500 dark:text-secondary-400 mt-1">
            Monitor donations, distribution, waste reduction and community impact.
          </p>
        </div>
        <div className="flex gap-2">
          {["Today", "Week", "Month", "Year"].map((period) => (
            <button
              key={period}
              className="px-3 py-1.5 text-sm rounded-lg border border-secondary-300 dark:border-secondary-600 hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors"
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Total Food Donated"
          value={data.totalFoodDonated}
          unit="kg"
          icon={Package}
          format="quantity"
          delay={0}
        />
        <StatCard
          title="Successfully Distributed"
          value={data.totalFoodDistributed}
          unit="kg"
          icon={Heart}
          iconBgColor="bg-green-100 dark:bg-green-900/30"
          iconTextColor="text-green-600"
          format="quantity"
          delay={0.1}
        />
        <StatCard
          title="Food Wasted"
          value={data.totalFoodWasted}
          unit="kg"
          icon={Trash2}
          iconBgColor="bg-red-100 dark:bg-red-900/30"
          iconTextColor="text-red-600"
          format="quantity"
          delay={0.2}
        />
        <StatCard
          title="Delivery Success Rate"
          value={data.deliveryRate}
          format="percentage"
          icon={TrendingUp}
          iconBgColor="bg-blue-100 dark:bg-blue-900/30"
          iconTextColor="text-blue-600"
          delay={0.3}
        />
        <StatCard
          title="Average Pickup Time"
          value={data.averagePickupTime}
          unit="hours"
          icon={Clock}
          iconBgColor="bg-amber-100 dark:bg-amber-900/30"
          iconTextColor="text-amber-600"
          format="decimal"
          delay={0.4}
        />
        <StatCard
          title="Active NGOs"
          value={data.topNGOs?.length || 0}
          icon={Users}
          iconBgColor="bg-purple-100 dark:bg-purple-900/30"
          iconTextColor="text-purple-600"
          delay={0.5}
        />
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
            Donation Trends
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => setTrendType("area")}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                trendType === "area"
                  ? "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400"
                  : "hover:bg-secondary-100 dark:hover:bg-secondary-700"
              }`}
            >
              Area
            </button>
            <button
              onClick={() => setTrendType("line")}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                trendType === "line"
                  ? "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400"
                  : "hover:bg-secondary-100 dark:hover:bg-secondary-700"
              }`}
            >
              Line
            </button>
          </div>
        </div>
        <DonationTrendChart data={trendData} type={trendType} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
            Donations by Category
          </h3>
          <CategoryChart data={data.donationsByCategory || []} />
        </div>
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
            Donations by Location
          </h3>
          <LocationChart data={data.donationsByLocation || []} />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
            Top Donors
          </h3>
          <DonorChart data={data.topDonors || []} />
        </div>
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
            Top NGOs
          </h3>
          <NGOChart data={data.topNGOs || []} />
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
          Donation Status
        </h3>
        <DonationStatusChart data={statusData} />
      </div>
    </div>
  );
};

export default Dashboard;
