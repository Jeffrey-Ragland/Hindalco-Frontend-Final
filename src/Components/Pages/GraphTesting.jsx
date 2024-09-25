import React from 'react';
import { LineChart } from "@mui/x-charts";


const GraphTesting = () => {

   const thresholds = [0, 10]; // Define your thresholds
   const colors = ["red", "green", "blue"]; // Define corresponding colors

   const data = [
     { x: 1, y: 2 },
     { x: 2, y: 5.5 },
     { x: 3, y: 12 },
     { x: 4, y: 8.5 },
     { x: 5, y: 15 },
     { x: 6, y: 5 },
   ];

   // Function to get color based on thresholds
   const getColor = (value) => {
     if (value < thresholds[0]) return colors[0]; // Color for values below the first threshold
     if (value < thresholds[1]) return colors[1]; // Color for values between the first and second threshold
     return colors[2]; // Color for values above the second threshold
   };

  return (
    <div className="text-white h-screen p-4 flex justify-center items-center">
      <div className="h-[400px] w-[600px]">
        {/* <LineChart
          xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
          series={[
            {
              data: [2, 5.5, 2, 8.5, 1.5, 5],
            },
          ]}
          width={500}
          height={300}
        /> */}
        <LineChart
          xAxis={{ data: data.map((point) => point.x) }} // x-axis values
          yAxis={{ title: "Value" }} // y-axis definition
          series={[
            {
              name: "Value Series",
              data: data.map((point) => ({
                x: point.x,
                y: point.y,
                // Set line color dynamically based on the y value
                lineStyle: { color: getColor(point.y) },
              })),
            },
          ]}
          width={500}
          height={300}
        />
      </div>
    </div>
  );
}

export default GraphTesting
