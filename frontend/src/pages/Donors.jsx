import React from "react";
import { motion } from "framer-motion";
import { Trophy, TrendingUp, Award, Users, Package } from "lucide-react";
import { formatQuantity } from "../utils/formatters";

const Donors = () => {
  const donors = [
    { id: 1, name: "Taj Hotels", type: "Hotel", totalDonations: 45, quantity: 1250, successRate: 98 },
    { id: 2, name: "Marriott International", type: "Hotel", totalDonations: 38, quantity: 980, successRate: 95 },
    { id: 3, name: "Local Restaurant", type: "Restaurant", totalDonations: 32, quantity: 720, successRate: 92 },
    { id: 4, name: "Community Kitchen", type: "Individual", totalDonations: 28, quantity: 650, successRate: 100 },
    { id: 5, name: "Catering Service", type: "Caterer", totalDonations: 25, quantity: 580, successRate: 88 },
  ];

  const kpis = [
    { label: "Total Donors", value: "156", icon: Users, change: "+12%" },
    { label: "Active Donors", value: "89", icon: TrendingUp, change: "+8%" },
    { label: "Total Food Donated", value: "12,540 kg", icon: Package, change: "+18%" },
    { label: "Avg Donation", value: "80 kg", icon: Award, change: "+5%" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
          Donor Analytics
        </h2>
        <p className="text-secondary-500 dark:text-secondary-400 mt-1">
          Track donor activity and impact.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">
                  {kpi.label}
                </p>
                <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-1">
                  {kpi.value}
                </p>
                <p className="text-sm text-green-600 mt-1">{kpi.change}</p>
              </div>
              <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
                <kpi.icon className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
          Top Donors Leaderboard
        </h3>
        <div className="space-y-4">
          {donors.map((donor, index) => (
            <motion.div
              key={donor.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center gap-4 p-4 rounded-xl hover:bg-secondary-50 dark:hover:bg-secondary-700/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg">
                {index === 0 && (
                  <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-yellow-600" />
                  </div>
                )}
                {index === 1 && (
                  <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-gray-500" />
                  </div>
                )}
                {index === 2 && (
                  <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-orange-600" />
                  </div>
                )}
                {index > 2 && (
                  <div className="w-10 h-10 bg-secondary-100 dark:bg-secondary-700 rounded-full flex items-center justify-center text-secondary-600 dark:text-secondary-300">
                    {index + 1}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-secondary-900 dark:text-secondary-100">
                  {donor.name}
                </p>
                <p className="text-sm text-secondary-500">{donor.type}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-secondary-900 dark:text-secondary-100">
                  {formatQuantity(donor.quantity)}
                </p>
                <p className="text-sm text-secondary-500">{donor.totalDonations} donations</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-green-600">{donor.successRate}%</p>
                <p className="text-xs text-secondary-500">success rate</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Donors;
