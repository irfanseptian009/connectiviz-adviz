import React from "react";
import { worldMill } from "@react-jvectormap/world";
import dynamic from "next/dynamic";

const VectorMap = dynamic(
  () => import("@react-jvectormap/core").then((mod) => mod.VectorMap),
  { ssr: false }
);

interface CountryMapProps {
  mapColor?: string;
}

type MarkerStyle = {
  initial: {
    fill: string;
    r: number; 
  };
};

type Marker = {
  latLng: [number, number];
  name: string;
  style?: {
    fill: string;
    borderWidth: number;
    borderColor: string;
    stroke?: string;
    strokeOpacity?: number;
  };
};

const CountryMap: React.FC<CountryMapProps> = ({ mapColor }) => {
  return (
    <VectorMap
      map={worldMill}
      backgroundColor="transparent"
      markerStyle={
        {
          initial: {
            fill: "##FB6514",
            r: 4,
          }, 
        } as MarkerStyle
      }
      markersSelectable={true}
      markers={
        [
          {
            latLng: [37.2580397, -104.657039],
            name: "United States",
            style: {
              fill: "##FB6514",
              borderWidth: 1,
              borderColor: "white",
              stroke: "#383f47",
            },
          },
          {
            latLng: [20.7504374, 73.7276105],
            name: "India",
            style: { fill: "##FB6514", borderWidth: 1, borderColor: "white" },
          },
          {
            latLng: [53.613, -11.6368],
            name: "United Kingdom",
            style: { fill: "##FB6514", borderWidth: 1, borderColor: "white" },
          },
          {
            latLng: [-25.0304388, 115.2092761],
            name: "Sweden",
            style: {
              fill: "##FB6514",
              borderWidth: 1,
              borderColor: "white",
              strokeOpacity: 0,
            },
          },
        ] as Marker[]
      }
      zoomOnScroll={false}
      zoomMax={12}
      zoomMin={1}
      zoomAnimate={true}
      zoomStep={1.5}
      regionStyle={{
        initial: {
          fill: mapColor || "#FB6514",
          fillOpacity: 1,
          fontFamily: "Outfit",
          stroke: "none",
          strokeWidth: 0,
          strokeOpacity: 0,
        },
        hover: {
          fillOpacity: 0.7,
          cursor: "pointer",
          fill: "#FB6514",
          stroke: "none",
        },
        selected: {
          fill: "##FB6514",
        },
        selectedHover: {},
      }}
      regionLabelStyle={{
        initial: {
          fill: "#35373e",
          fontWeight: 500,
          fontSize: "13px",
          stroke: "none",
        },
        hover: {},
        selected: {},
        selectedHover: {},
      }}
    />
  );
};

export default CountryMap;
