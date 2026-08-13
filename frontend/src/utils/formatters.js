export const formatNumber = (num) => {
  if (num === null || num === undefined || isNaN(num)) return "0";
  return new Intl.NumberFormat("en-US").format(Math.round(num));
};

export const formatDecimal = (num, decimals = 2) => {
  if (num === null || num === undefined || isNaN(num)) return "0";
  return num.toFixed(decimals);
};

export const formatPercentage = (num, decimals = 1) => {
  if (num === null || num === undefined || isNaN(num)) return "0%";
  return `${num.toFixed(decimals)}%`;
};

export const formatQuantity = (num, unit = "kg") => {
  if (num === null || num === undefined || isNaN(num)) return `0 ${unit}`;
  return `${formatNumber(num)} ${unit}`;
};

export const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "N/A";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatDateTime = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "N/A";
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatHours = (hours) => {
  if (hours === null || hours === undefined || isNaN(hours)) return "0h";
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (m > 0) return `${h}h ${m}m`;
  return `${h}h`;
};

export const calculateTrend = (current, previous) => {
  if (!previous || previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};

export const getTrendColor = (trend) => {
  if (trend > 0) return "text-green-600";
  if (trend < 0) return "text-red-600";
  return "text-secondary-500";
};

export const getTrendIcon = (trend) => {
  if (trend > 0) return "trending-up";
  if (trend < 0) return "trending-down";
  return "minus";
};
