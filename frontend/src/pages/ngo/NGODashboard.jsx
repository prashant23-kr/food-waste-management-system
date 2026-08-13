import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Package, Users, Clock, TrendingUp, CheckCircle } from "lucide-react";
import { getNGODonations } from "../../services/api";
import Loading from "../../components/common/Loading";
import ErrorState from "../../components/common/ErrorState";

const NGODashboard = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const response = await getNGODonations();
      setDonations(response.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading text="Loading dashboard..." />;
  if (error) return <ErrorState message={error} onRetry={fetchDonations} />;

  const totalReceived = donations.length;
  const totalFood = donations.reduce((sum, d) => sum + (d.foodQuantity || 0), 0);
  const pending = donations.filter((d) => d.status === "Pending").length;
  const delivered = donations.filter((d) => d.status === "Delivered").length;
  const activeDonors = new Set(donations.map((d) => d.donorId)).size;

  const kpis = [
    { label: "Total Donations Received", value: totalReceived, icon: Package, color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-900/30" },
    { label: "Total Food Received", value: `${totalFood.toFixed(0)} kg`, icon: Users, color: "text-green-600", bg: "bg-green-100 dark:bg-green-900/30" },
    { label: "Pending Requests", value: pending, icon: Clock, color: "text-amber-600", bg: "bg-amber-100 dark:bg-amber-900/30" },
    { label: "Successfully Distributed", value: delivered, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-100 dark:bg-emerald-900/30" },
    { label: "Active Donors", value: activeDonors, icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-100 dark:bg-purple-900/30" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
          NGO Dashboard
        </h2>
        <p className="text-secondary-500 dark:text-secondary-400 mt-1">
          Manage food donations and maximize community impact.
        </p>
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
        <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
          Recent Donations
        </h3>
        {donations.length === 0 ? (
          <div className="text-center py-8">
            <Package className="w-12 h-12 text-secondary-300 mx-auto mb-3" />
            <p className="text-secondary-500">No donations available</p>
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
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NGODashboard;
