import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const CategoryChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-80 text-secondary-500">
        No category data available
      </div>
    );
  }

  const COLORS = [
    "#16a34a",
    "#22c55e",
    "#86efac",
    "#4ade80",
    "#bbf7d0",
    "#15803d",
    "#f59e0b",
    "#ef4444",
  ];

  const total = data.reduce((sum, item) => sum + (item.quantity || 0), 0);

  return (
    <ResponsiveContainer width="100%" height={320}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ category, percent }) =>
            `${category} (${(percent * 100).toFixed(0)}%)`
          }
          outerRadius={100}
          fill="#8884d8"
          dataKey="quantity"
          nameKey="category"
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => [`${value.toFixed(1)} kg`, "Quantity"]}
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

export default CategoryChart;
