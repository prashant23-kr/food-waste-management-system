import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const DonationStatusChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-80 text-secondary-500">
        No status data available
      </div>
    );
  }

  const COLORS = {
    Delivered: "#16a34a",
    "Picked Up": "#f59e0b",
    Pending: "#94a3b8",
    Cancelled: "#ef4444",
    Wasted: "#dc2626",
  };

  const total = data.reduce((sum, item) => sum + (item.count || 0), 0);

  return (
    <ResponsiveContainer width="100%" height={320}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ status, percent }) =>
            `${status} (${(percent * 100).toFixed(0)}%)`
          }
          outerRadius={100}
          fill="#8884d8"
          dataKey="count"
          nameKey="status"
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[entry.status] || "#94a3b8"}
            />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name) => [`${value} donations`, name]}
          contentStyle={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
          }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default DonationStatusChart;
