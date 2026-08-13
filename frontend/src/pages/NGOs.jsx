import React from "react";
import { motion } from "framer-motion";
import { Trophy, MapPin, Package, TrendingUp } from "lucide-react";
import { formatQuantity } from "../utils/formatters";

const NGOs = () => {
  const ngos = [
    { id: 1, name: "Food Bank India", location: "Delhi", received: 2500, distributed: 2300, successRate: 96 },
    { id: 2, name: "Robin Hood Army", location: "Mumbai", received: 2100, distributed: 2000, successRate: 98 },
    { id: 3, name: "Goonj Foundation", location: "Bengaluru", received: 1800, distributed: 1700, successRate: 94 },
    { id: 4, name: "Akshaya Patra", location: "Chennai", received: 1600, distributed: 1550, successRate: 97 },
    { id: 5, name: "Feeding India", location: "Kolkata", received: 1400, distributed: 1350, successRate: 95 },
  ];

  const kpis = [
    { label: "Total NGOs", value: "45", icon: Trophy, change: "+5" },
    { label: "Active NGOs", value: "38", icon: TrendingUp, change: "+3" },
    { label: "Food Received", value: "12,540 kg", icon: Package, change: "+18%" },
    { label: "Successful Pickups", value: "10,200 kg", icon: MapPin, change: "+15%" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
          NGO Analytics
        </h2>
        <p className="text-secondary-500 dark:text-secondary-400 mt-1">
          Track NGO performance and distribution impact.
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
          NGO Leaderboard
        </h3>
        <div className="space-y-4">
          {ngos.map((ngo, index) => (
            <motion.div
              key={ngo.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center gap-4 p-4 rounded-xl hover:bg-secondary-50 dark:hover:bg-secondary-700/50 transition-colors"
            >
              <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center font-bold text-primary-700">
                {index + 1}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-secondary-900 dark:text-secondary-100">
                  {ngo.name}
                </p>
                <p className="text-sm text-secondary-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {ngo.location}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-secondary-900 dark:text-secondary-100">
                  {formatQuantity(ngo.received)}
                </p>
                <p className="text-sm text-secondary-500">received</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-secondary-900 dark:text-secondary-100">
                  {formatQuantity(ngo.distributed)}
                </p>
                <p className="text-sm text-secondary-500">distributed</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-green-600">{ngo.successRate}%</p>
                <p className="text-xs text-secondary-500">success rate</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NGOs;
