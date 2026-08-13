import React from "react";
import { motion } from "framer-motion";
import { Leaf, Users, TrendingDown, Award, Heart } from "lucide-react";

const Impact = () => {
  const impactMetrics = [
    {
      title: "Food Saved",
      value: "8,450",
      unit: "kg",
      icon: Leaf,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/30",
      description: "Total food rescued from waste",
    },
    {
      title: "Meals Potentially Served",
      value: "42,250",
      unit: "meals",
      icon: Heart,
      color: "text-red-600",
      bgColor: "bg-red-100 dark:bg-red-900/30",
      description: "Based on 1 meal = 200g",
    },
    {
      title: "Waste Reduction",
      value: "18.7",
      unit: "%",
      icon: TrendingDown,
      color: "text-amber-600",
      bgColor: "bg-amber-100 dark:bg-amber-900/30",
      description: "vs last year",
    },
    {
      title: "Successful Deliveries",
      value: "94.2",
      unit: "%",
      icon: Award,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      description: "Delivery success rate",
    },
    {
      title: "Communities Reached",
      value: "1,250",
      unit: "+",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
      description: "People and families helped",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
          Social & Environmental Impact
        </h2>
        <p className="text-secondary-500 dark:text-secondary-400 mt-1">
          Measuring the real difference we make together.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {impactMetrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="card p-6 text-center"
          >
            <div
              className={`w-16 h-16 ${metric.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4`}
            >
              <metric.icon className={`w-8 h-8 ${metric.color}`} />
            </div>
            <p className="text-4xl font-bold text-secondary-900 dark:text-secondary-100">
              {metric.value}
            </p>
            <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-1">
              {metric.unit}
            </p>
            <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300 mt-2">
              {metric.title}
            </p>
            <p className="text-xs text-secondary-400 mt-1">{metric.description}</p>
          </motion.div>
        ))}
      </div>

      <div className="card p-8 text-center">
        <h3 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
          Impact Score
        </h3>
        <div className="relative w-48 h-48 mx-auto">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              className="text-secondary-200 dark:text-secondary-700"
            />
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 88 * 0.87} ${2 * Math.PI * 88}`}
              className="text-primary-600"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-secondary-900 dark:text-secondary-100">
              87
            </span>
            <span className="text-sm text-secondary-500">out of 100</span>
          </div>
        </div>
        <p className="text-secondary-600 dark:text-secondary-300 mt-4 max-w-xl mx-auto">
          Our platform has successfully connected donors with NGOs, reducing food waste and creating measurable social impact in communities across the country.
        </p>
      </div>
    </div>
  );
};

export default Impact;
