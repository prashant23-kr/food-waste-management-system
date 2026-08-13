import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const NGOChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-80 text-secondary-500">
        No NGO data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-secondary-200 dark:stroke-secondary-700" />
        <XAxis
          dataKey="ngoName"
          className="text-xs text-secondary-500"
          tick={{ fontSize: 12 }}
          angle={-15}
          textAnchor="end"
          height={60}
        />
        <YAxis
          className="text-xs text-secondary-500"
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => `${value} kg`}
        />
        <Tooltip
          formatter={(value) => [`${value.toFixed(1)} kg`, "Distributed"]}
          contentStyle={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
          }}
        />
        <Bar dataKey="quantity" fill="#22c55e" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default NGOChart;
