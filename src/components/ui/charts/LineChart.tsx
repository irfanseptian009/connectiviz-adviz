"use client";
import { LineChart as ReLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import React from "react";

export interface LineChartProps {
  data: Record<string, unknown>[];
  dataKey: string;
  lines: { dataKey: string; stroke?: string; name?: string }[];
  height?: number;
}

export function LineChart({ data, dataKey, lines, height = 400 }: LineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ReLineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={dataKey} />
        <YAxis />
        <Tooltip />
        <Legend />
        {lines.map((line) => (
          <Line key={line.dataKey} type="monotone" dataKey={line.dataKey} stroke={line.stroke || "#3b82f6"} name={line.name} strokeWidth={2} />
        ))}
      </ReLineChart>
    </ResponsiveContainer>
  );
}
