import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import {
  formatNumber,
  formatQuantity,
  formatPercentage,
  getTrendColor,
  getTrendIcon,
} from "../../utils/formatters";

const TrendIcon = ({ trend }) => {
  if (trend > 0) return <TrendingUp className="w-4 h-4" />;
  if (trend < 0) return <TrendingDown className="w-4 h-4" />;
  return <Minus className="w-4 h-4" />;
};

const StatCard = ({
  title,
  value,
  unit,
  trend,
  previousValue,
  icon: Icon,
  iconBgColor = "bg-primary-100 dark:bg-primary-900/30",
  iconTextColor = "text-primary-600",
  format = "number",
  delay = 0,
}) => {
  const displayValue =
    format === "percentage"
      ? formatPercentage(value)
      : format === "quantity"
      ? formatQuantity(value, unit)
      : format === "decimal"
      ? `${formatNumber(value)} ${unit || ""}`
      : formatNumber(value);

  const trendColor = getTrendColor(trend);
  const TrendIconComponent = getTrendIcon(trend);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="card card-hover p-6"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-secondary-500 dark:text-secondary-400 mb-1">
            {title}
          </p>
          <p className="text-2xl lg:text-3xl font-bold text-secondary-900 dark:text-secondary-100">
            {displayValue}
          </p>
          {trend !== undefined && trend !== null && (
            <div className={`flex items-center gap-1 mt-2 ${trendColor}`}>
              <TrendIconComponent />
              <span className="text-sm font-medium">
                {Math.abs(trend).toFixed(1)}%
              </span>
              <span className="text-xs text-secondary-500 dark:text-secondary-400 ml-1">
                vs last period
              </span>
            </div>
          )}
        </div>
        {Icon && (
          <div
            className={`p-3 rounded-xl ${iconBgColor} ${iconTextColor}`}
          >
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;
