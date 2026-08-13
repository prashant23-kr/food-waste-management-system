import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Package, Heart, Clock, AlertCircle, TrendingUp, PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { getMyDonations, getAnalytics } from "../../services/api";
import Loading from "../../components/common/Loading";
import ErrorState from "../../components/common/ErrorState";

const DonorDashboard = () => {
  const [donations, setDonations] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [donationsRes, analyticsRes] = await Promise.all([
        getMyDonations(),
        getAnalytics(),
      ]);
      setDonations(donationsRes.data || []);
      setStats(analyticsRes.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading text="Loading dashboard..." />;
  if (error) return <ErrorState message={error} onRetry={fetchData} />;

  const totalDonations = donations.length;
  const totalQuantity = donations.reduce((sum, d) => sum + (d.foodQuantity || 0), 0);
  const delivered = donations.filter((d) => d.status === "Delivered").length;
  const pending = donations.filter((d) => d.status === "Pending").length;
  const wasted = donations.reduce((sum, d) => sum + (d.wastedQuantity || 0), 0);

  const kpis = [
    { label: "Total Donations", value: totalDonations, icon: Package, color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-900/30" },
    { label: "Total Food Donated", value: `${totalQuantity.toFixed(0)} kg`, icon: Heart, color: "text-green-600", bg: "bg-green-100 dark:bg-green-900/30" },
    { label: "Successfully Delivered", value: delivered, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-100 dark:bg-emerald-900/30" },
    { label: "Pending Donations", value: pending, icon: Clock, color: "text-amber-600", bg: "bg-amber-100 dark:bg-amber-900/30" },
    { label: "Food Waste Prevented", value: `${wasted.toFixed(0)} kg`, icon: AlertCircle, color: "text-red-600", bg: "bg-red-100 dark:bg-red-900/30" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
            Donor Dashboard
          </h2>
          <p className="text-secondary-500 dark:text-secondary-400 mt-1">
            Track your food donations and community impact.
          </p>
        </div>
        <Link to="/donor/donations/new">
          <button className="btn-primary flex items-center gap-2">
            <PlusCircle className="w-4 h-4" />
            Donate Food
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {kpis.map((kpi, index) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="card p-5"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${kpi.bg} ${kpi.color}`}>
                <kpi.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-secondary-500 dark:text-secondary-400">{kpi.label}</p>
                <p className="text-xl font-bold text-secondary-900 dark:text-secondary-100">{kpi.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
            Recent Donations
          </h3>
          <Link to="/donor/donations" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            View All
          </Link>
        </div>
        {donations.length === 0 ? (
          <div className="text-center py-8">
            <Package className="w-12 h-12 text-secondary-300 mx-auto mb-3" />
            <p className="text-secondary-500 mb-4">No donations yet</p>
            <Link to="/donor/donations/new">
              <button className="btn-primary">Donate Food</button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {donations.slice(0, 5).map((donation) => (
              <div
                key={donation._id}
                className="flex items-center justify-between p-4 rounded-xl bg-secondary-50 dark:bg-secondary-700/50 hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-secondary-900 dark:text-secondary-100">
                      {donation.foodCategory}
                    </p>
                    <p className="text-sm text-secondary-500">
                      {donation.foodQuantity} {donation.unit || "kg"} • {donation.location}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    donation.status === "Delivered" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" :
                    donation.status === "Pending" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" :
                    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                  }`}>
                    {donation.status}
                  </span>
                  <p className="text-xs text-secondary-400 mt-1">
                    {new Date(donation.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DonorDashboard;
