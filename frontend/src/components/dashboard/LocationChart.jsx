import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const LocationChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-80 text-secondary-500">
        No location data available
      </div>
    );
  }

  const topData = data.slice(0, 10);

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={topData} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" className="stroke-secondary-200 dark:stroke-secondary-700" />
        <XAxis
          type="number"
          className="text-xs text-secondary-500"
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => `${value} kg`}
        />
        <YAxis
          type="category"
          dataKey="location"
          className="text-xs text-secondary-500"
          tick={{ fontSize: 12 }}
          width={120}
        />
        <Tooltip
          formatter={(value) => [`${value.toFixed(1)} kg`, "Quantity"]}
          contentStyle={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
          }}
        />
        <Bar dataKey="quantity" fill="#16a34a" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default LocationChart;
