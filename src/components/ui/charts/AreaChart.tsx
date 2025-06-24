"use client";
import { AreaChart as ReAreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import React from "react";

export interface AreaChartProps {
  data: Record<string, unknown>[];
  dataKey: string;
  areas: { dataKey: string; stroke?: string; fill?: string; name?: string }[];
  height?: number;
}

export function AreaChart({ data, dataKey, areas, height = 400 }: AreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ReAreaChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={dataKey} />
        <YAxis />
        <Tooltip />
        <Legend />
        {areas.map((area) => (
          <Area key={area.dataKey} type="monotone" dataKey={area.dataKey} stroke={area.stroke || "#3b82f6"} fill={area.fill || "#3b82f6"} name={area.name} strokeWidth={2} />
        ))}
      </ReAreaChart>
    </ResponsiveContainer>
  );
}
