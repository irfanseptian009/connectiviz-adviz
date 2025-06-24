"use client";
import { PieChart as RePieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import React from "react";

export interface PieChartProps {
  data: Record<string, unknown>[];
  dataKey: string;
  nameKey: string;
  colors?: string[];
  height?: number;
}

export function PieChart({ data, dataKey, nameKey, colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"], height = 400 }: PieChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RePieChart>
        <Pie data={data} dataKey={dataKey} nameKey={nameKey} cx="50%" cy="50%" outerRadius={120} label>
          {data.map((entry, idx) => (
            <Cell key={`cell-${idx}`} fill={colors[idx % colors.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </RePieChart>
    </ResponsiveContainer>
  );
}
