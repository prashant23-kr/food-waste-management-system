import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
} from "recharts";

const DonationTrendChart = ({ data, type = "area" }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-80 text-secondary-500">
        No trend data available
      </div>
    );
  }

  const ChartComponent = type === "line" ? LineChart : AreaChart;

  return (
    <ResponsiveContainer width="100%" height={320}>
      <ChartComponent data={data}>
        <defs>
          <linearGradient id="colorDonated" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorDistributed" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorWasted" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" className="stroke-secondary-200 dark:stroke-secondary-700" />
        <XAxis
          dataKey="name"
          className="text-xs text-secondary-500"
          tick={{ fontSize: 12 }}
        />
        <YAxis
          className="text-xs text-secondary-500"
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => `${value} kg`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
          formatter={(value) => [`${value} kg`, ""]}
        />
        <Legend />
        {type === "area" ? (
          <>
            <Area
              type="monotone"
              dataKey="donated"
              stroke="#16a34a"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorDonated)"
              name="Donated"
            />
            <Area
              type="monotone"
              dataKey="distributed"
              stroke="#22c55e"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorDistributed)"
              name="Distributed"
            />
            <Area
              type="monotone"
              dataKey="wasted"
              stroke="#ef4444"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorWasted)"
              name="Wasted"
            />
          </>
        ) : (
          <>
            <Line
              type="monotone"
              dataKey="donated"
              stroke="#16a34a"
              strokeWidth={2}
              dot={{ fill: "#16a34a", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
              name="Donated"
            />
            <Line
              type="monotone"
              dataKey="distributed"
              stroke="#22c55e"
              strokeWidth={2}
              dot={{ fill: "#22c55e", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
              name="Distributed"
            />
            <Line
              type="monotone"
              dataKey="wasted"
              stroke="#ef4444"
              strokeWidth={2}
              dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
              name="Wasted"
            />
          </>
        )}
      </ChartComponent>
    </ResponsiveContainer>
  );
};

export default DonationTrendChart;
