"use client";
import { RadialBarChart as ReRadialBarChart, RadialBar, Legend, Tooltip, ResponsiveContainer } from "recharts";
import React from "react";

export interface RadialBarChartProps {
  data: Record<string, unknown>[];
  dataKey: string;
  fill?: string;
  height?: number;
}

export function RadialBarChart({ data, dataKey, fill = "#3b82f6", height = 400 }: RadialBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ReRadialBarChart innerRadius="30%" outerRadius="80%" data={data} startAngle={90} endAngle={-270}>
        <RadialBar label background dataKey={dataKey} fill={fill} />
        <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
        <Tooltip />
      </ReRadialBarChart>
    </ResponsiveContainer>
  );
}
