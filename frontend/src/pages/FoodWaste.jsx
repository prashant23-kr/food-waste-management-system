import React from "react";
import { motion } from "framer-motion";
import { Trash2, TrendingDown, BarChart3, AlertTriangle,Package,TrendingUp  } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const FoodWaste = () => {
  const wasteByCategory = [
    { category: "Cooked Food", wasted: 450, donated: 3200 },
    { category: "Fruits", wasted: 280, donated: 2100 },
    { category: "Vegetables", wasted: 320, donated: 1800 },
    { category: "Dairy", wasted: 150, donated: 900 },
    { category: "Bakery", wasted: 200, donated: 1100 },
    { category: "Grains", wasted: 100, donated: 2400 },
  ];

  const wasteTrend = [
    { month: "Jan", wasted: 180 },
    { month: "Feb", wasted: 220 },
    { month: "Mar", wasted: 190 },
    { month: "Apr", wasted: 280 },
    { month: "May", wasted: 250 },
    { month: "Jun", wasted: 310 },
  ];

  const totalDonated = 12540;
  const totalDistributed = 10200;
  const totalWasted = 2340;
  const wasteRate = ((totalWasted / totalDonated) * 100).toFixed(1);
  const efficiency = ((totalDistributed / (totalDistributed + totalWasted)) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
          Food Waste Analytics
        </h2>
        <p className="text-secondary-500 dark:text-secondary-400 mt-1">
          Monitor waste reduction and distribution efficiency.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6"
        >
          <p className="text-sm text-secondary-500 dark:text-secondary-400">
            Food Donated
          </p>
          <p className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mt-2">
            {totalDonated.toLocaleString()} kg
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-6"
        >
          <p className="text-sm text-secondary-500 dark:text-secondary-400">
            Successfully Distributed
          </p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {totalDistributed.toLocaleString()} kg
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6"
        >
          <p className="text-sm text-secondary-500 dark:text-secondary-400">
            Food Wasted
          </p>
          <p className="text-3xl font-bold text-red-600 mt-2">
            {totalWasted.toLocaleString()} kg
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-6"
        >
          <p className="text-sm text-secondary-500 dark:text-secondary-400">
            Distribution Efficiency
          </p>
          <p className="text-3xl font-bold text-primary-600 mt-2">
            {efficiency}%
          </p>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            Waste by Category
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={wasteByCategory}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-secondary-200 dark:stroke-secondary-700" />
              <XAxis dataKey="category" className="text-xs text-secondary-500" tick={{ fontSize: 12 }} angle={-15} textAnchor="end" height={60} />
              <YAxis className="text-xs text-secondary-500" tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => [`${value} kg`, ""]} contentStyle={{ backgroundColor: "rgba(255,255,255,0.95)", border: "1px solid #e2e8f0", borderRadius: "12px" }} />
              <Legend />
              <Bar dataKey="donated" fill="#16a34a" radius={[4, 4, 0, 0]} name="Donated" />
              <Bar dataKey="wasted" fill="#ef4444" radius={[4, 4, 0, 0]} name="Wasted" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4 flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-red-600" />
            Waste Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={wasteTrend}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-secondary-200 dark:stroke-secondary-700" />
              <XAxis dataKey="month" className="text-xs text-secondary-500" tick={{ fontSize: 12 }} />
              <YAxis className="text-xs text-secondary-500" tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => [`${value} kg`, "Wasted"]} contentStyle={{ backgroundColor: "rgba(255,255,255,0.95)", border: "1px solid #e2e8f0", borderRadius: "12px" }} />
              <Bar dataKey="wasted" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
          Waste Flow
        </h3>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
              <Package className="w-8 h-8 text-primary-600" />
            </div>
            <div>
              <p className="font-semibold text-secondary-900 dark:text-secondary-100">
                {totalDonated.toLocaleString()} kg
              </p>
              <p className="text-sm text-secondary-500">Total Donated</p>
            </div>
          </div>
          <div className="hidden md:block text-2xl text-secondary-400">→</div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-secondary-900 dark:text-secondary-100">
                {totalDistributed.toLocaleString()} kg
              </p>
              <p className="text-sm text-secondary-500">Distributed ({efficiency}%)</p>
            </div>
          </div>
          <div className="hidden md:block text-2xl text-secondary-400">→</div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
              <Trash2 className="w-8 h-8 text-red-600" />
            </div>
            <div>
              <p className="font-semibold text-secondary-900 dark:text-secondary-100">
                {totalWasted.toLocaleString()} kg
              </p>
              <p className="text-sm text-secondary-500">Wasted ({wasteRate}%)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodWaste;
