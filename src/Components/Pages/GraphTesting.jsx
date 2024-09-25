import React from 'react';
import { LineChart } from "@mui/x-charts";
import { ChartsReferenceLine } from "@mui/x-charts/ChartsReferenceLine";


const GraphTesting = () => {

const actualXAxisData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // Example x-axis data
  const actualSeriesData = [
    25, 32, 60, 45, 78, 55, 85, 40, 20, 50 // Example series data with values in and out of thresholds
  ];

  // Define the threshold values
  const minThreshold = 40; // Minimum threshold
  const maxThreshold = 70; // Maximum threshold
  const thresholds = [minThreshold, maxThreshold]; // Array of thresholds
  const colors = ['red', 'green', 'red'];
   

  return (
    <div className="text-white h-screen p-4 flex justify-center items-center">
      <div className="h-[400px] w-[600px]">
        <LineChart
          xAxis={[{ data: actualXAxisData }]} // Using actual x-axis data
          series={[
            {
              data: actualSeriesData,
            },
          ]}
          width={600}
          height={400}
          yAxis={[
            {
              colorMap: {
                type: "piecewise",
                thresholds: thresholds,
                colors: colors,
              },
            },
          ]}
        >
          <ChartsReferenceLine
            y={40}
            lineStyle={{ stroke: "red", strokeDasharray: "5 5" }}
          />
          <ChartsReferenceLine
            y={70}
            lineStyle={{ stroke: "red", strokeDasharray: "5 5" }}
          />
        </LineChart>
      </div>
    </div>
  );
}

export default GraphTesting
