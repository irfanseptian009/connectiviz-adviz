"use client";
import { BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import React from "react";

export interface BarChartProps {
  data: Record<string, unknown>[];
  dataKey: string;
  bars: { dataKey: string; fill?: string; name?: string }[];
  height?: number;
}

export function BarChart({ data, dataKey, bars, height = 400 }: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ReBarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={dataKey} />
        <YAxis />
        <Tooltip />
        <Legend />
        {bars.map((bar) => (
          <Bar key={bar.dataKey} dataKey={bar.dataKey} fill={bar.fill || "#3b82f6"} name={bar.name} />
        ))}
      </ReBarChart>
    </ResponsiveContainer>
  );
}
