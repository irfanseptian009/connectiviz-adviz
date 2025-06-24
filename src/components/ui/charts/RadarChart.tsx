"use client";
import { RadarChart as ReRadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, ResponsiveContainer, Legend } from "recharts";
import React from "react";

export interface RadarChartProps {
  data: Record<string, unknown>[];
  dataKey: string;
  radarKey: string;
  fill?: string;
  stroke?: string;
  height?: number;
}

export function RadarChart({ data, dataKey, radarKey, fill = "#3b82f6", stroke = "#6366f1", height = 400 }: RadarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ReRadarChart data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey={dataKey} />
        <PolarRadiusAxis />
        <Radar name={radarKey} dataKey={radarKey} stroke={stroke} fill={fill} fillOpacity={0.6} />
        <Tooltip />
        <Legend />
      </ReRadarChart>
    </ResponsiveContainer>
  );
}
