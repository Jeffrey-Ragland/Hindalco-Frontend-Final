import React from 'react';
import { useMemo, useState, useEffect } from "react";
import potline from '../Assets/potline.png';
import { FaBell, FaBatteryFull } from "react-icons/fa";
import { FaMobileScreenButton } from "react-icons/fa6";
import { LuRadioTower } from "react-icons/lu";
import { MdOutlineUpdate, MdSystemSecurityUpdateWarning } from "react-icons/md";
import { BsThermometerSun, BsDatabaseFillCheck } from "react-icons/bs";
import { LiaRulerVerticalSolid } from "react-icons/lia";
import { IoWarningSharp } from "react-icons/io5";
import ApexCharts from "react-apexcharts";
import Navbar from './Navbar';
import "react-tooltip/dist/react-tooltip.css";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  scales,
  Zoom,
} from "chart.js";

import zoomPlugin from "chartjs-plugin-zoom";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  zoomPlugin
);

const Dashboard = ({dataFromApp}) => {
  console.log("data", dataFromApp);

  const alertLimitFromLS = parseFloat(
    localStorage.getItem("HindalcoAlertLimit")
  );

  // line chart limit
  const getInitialLimit = () => {
    const storedLimit = localStorage.getItem("HindalcoLimit");
    return storedLimit ? parseInt(storedLimit) : 100;
  };

  const [hindalcoLimit, setHindalcoLimit] = useState(getInitialLimit);

  const handleLineLimit = (e) => {
    const limit = parseInt(e.target.value);
    setHindalcoLimit(limit);
    localStorage.setItem("HindalcoLimit", limit.toString());
  };

  // card alert limit
  const [hindalcoAlertLimit, setHindalcoAlertLimit] = useState("");

  const handleAlertLimit = (e) => {
    e.preventDefault();
    localStorage.setItem("HindalcoAlertLimit", hindalcoAlertLimit.toString());
    setHindalcoAlertLimit("");
  };

  // cards view more condition
  const getInitialViewMoreCondition = () => {
    const cardsViewCondition = localStorage.getItem("HindalcoCardsViewMore");
    if (cardsViewCondition === "false") {
      return false;
    } else return true;
  };

  const [viewAllCards, setViewAllCards] = useState(getInitialViewMoreCondition);

  const handleViewCards = () => {
    setViewAllCards((prevState) => {
      const newState = !prevState;
      localStorage.setItem("HindalcoCardsViewMore", String(newState));
      return newState;
    });
  };

  // alerts array
  const alertsArray =
    dataFromApp.length > 0
      ? Object.entries(dataFromApp[0])
          .filter(
            ([key, value]) =>
              key !== "_id" &&
              key !== "DeviceName" &&
              key !== "DeviceTemperature" &&
              key !== "DeviceBattery" &&
              key !== "DeviceSignal" &&
              key !== "Time" &&
              value !== "N/A"
          )
          .filter(([key, value]) => value >= alertLimitFromLS)
          .map(([key, value]) => {
            return { key, value };
          })
      : [];

  const alertKeys = alertsArray.map(({ key }) => key); 

  // console.log('alerts array', alertsArray);
  // console.log('alert keys', alertKeys);

  // bar chart options
  const [barData, setBarData] = useState({
    series: [],
    options: {
      chart: {
        type: "bar",
        toolbar: {
          show: false,
        },
      },

      xaxis: {
        categories: [],
        labels: {
          style: {
            fontSize: "6px",
            colors: "#4a5568",
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            fontSize: "6px",
            colors: "#4a5568",
          },
        },
      },
      grid: {
        show: false,
        // borderColor: "#4d4d4d",
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "25%",
          endingShape: "rounded",
          distributed: true,
          dataLabels: {
            position: "top",
          },
        },
      },
      dataLabels: {
        enabled: true,
        offsetY: -10,
        style: {
          colors: ["#4a5568"],
          fontSize: "8px",
        },
        formatter: (val) => {
          return val === null ? "N/A" : `${val}°C`;
        },
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        theme: "dark",
        y: {
          formatter: (val) => {
            return val === null ? "N/A" : `${val}°C`;
          },
        },
      },
      legend: {
        show: false,
      },
    },
  });

  const [lineData, setLineData] = useState({
    labels: [],
    datasets: [],
  });

  const [activeStatus, setActiveStatus] = useState("");
  // console.log('active status', activeStatus);

  // chart data assignment
  useEffect(() => {
    if (Array.isArray(dataFromApp) && dataFromApp.length > 0) {
      const barCategories = [];
      const barSeries = [];
      const barColors = [];

      // for activity status 
      const currentDate = new Date();
      const lastDataEntry = dataFromApp[0];

      if (lastDataEntry && lastDataEntry.Time) {
        const lastDataTime = new Date(lastDataEntry.Time.replace(',', 'T'));
         const timeDifference = currentDate.getTime() - lastDataTime.getTime();
         const differenceInMinutes = timeDifference / (1000 * 60);

         if (differenceInMinutes < 5) {
           setActiveStatus("Active");
         } else {
           setActiveStatus("Inactive");
         }
      };

      Object.keys(dataFromApp[0]).forEach((key) => {
        if (viewAllCards === true) {
          if (
            key !== "Time" &&
            key !== "createdAt" &&
            key !== "_id" &&
            key !== "DeviceName" &&
            key !== "DeviceTemperature" &&
            key !== "DeviceBattery" &&
            key !== "DeviceSignal"
          ) {
            barCategories.push(key);
            // barSeries.push(parseFloat(dataFromApp[0][key]));
            if (dataFromApp[0][key] === "N/A" || isNaN(parseFloat(dataFromApp[0][key]))) {
              barSeries.push(null); 
            } else {
              barSeries.push(parseFloat(dataFromApp[0][key]));
            }
            if (alertKeys.includes(key)) {
              barColors.push("#FF0000");
            } else {
              barColors.push("#23439B");
            }
          }
        } else if (viewAllCards === false) {
          if (
            key !== "Time" &&
            key !== "createdAt" &&
            key !== "_id" &&
            key !== "DeviceName" &&
            key !== "DeviceTemperature" &&
            key !== "DeviceBattery" &&
            key !== "DeviceSignal" &&
            key !== "S11" &&
            key !== "S12" &&
            key !== "S13" &&
            key !== "S14" &&
            key !== "S15"
          ) {
            barCategories.push(key);
            // barSeries.push(parseFloat(dataFromApp[0][key]));
            if (dataFromApp[0][key] === "N/A" || isNaN(parseFloat(dataFromApp[0][key]))) {
              barSeries.push(null);
            } else {
              barSeries.push(parseFloat(dataFromApp[0][key]));
            }
            if (alertKeys.includes(key)) {
              barColors.push("#FF0000");
            } else {
              barColors.push("#23439B");
            }
          }
        }
      });

      setBarData({
        series: [
          {
            name: "Sensor Temp",
            data: barSeries,
          },
        ],
        options: {
          ...barData.options,
          xaxis: {
            categories: barCategories,
          },
          colors: barColors,
        },
      });

      const reversedData = [...dataFromApp].reverse();

      const lineLabels = reversedData.map((item) => {
        return item.Time;
      });
      const sensor1Data = reversedData.map((item) => item.S1);
      const sensor2Data = reversedData.map((item) => item.S2);
      const sensor3Data = reversedData.map((item) => item.S3);
      const sensor4Data = reversedData.map((item) => item.S4);
      const sensor5Data = reversedData.map((item) => item.S5);
      const sensor6Data = reversedData.map((item) => item.S6);
      const sensor7Data = reversedData.map((item) => item.S7);
      const sensor8Data = reversedData.map((item) => item.S8);
      const sensor9Data = reversedData.map((item) => item.S9);
      const sensor10Data = reversedData.map((item) => item.S10);
      const sensor11Data = reversedData.map((item) => item.S11);
      const sensor12Data = reversedData.map((item) => item.S12);
      const sensor13Data = reversedData.map((item) => item.S13);
      const sensor14Data = reversedData.map((item) => item.S14);
      const sensor15Data = reversedData.map((item) => item.S15);

      

      setLineData({
        labels: lineLabels,
        datasets: [
          {
            label: "S1",
            data: sensor1Data,
            borderColor: "rgb(240, 5, 5)", // Vibrant Red
            backgroundColor: "rgba(240, 5, 5, 0.2)",
            pointRadius: 0,
            pointHoverRadius: 0,
            borderWidth: 1.25,
            // segment: {
            //   borderColor: (ctx) => {
            //     // Check if the value exceeds the limit
            //     return ctx.p0.parsed.y < 60 || ctx.p1.parsed.y < 60
            //       ? "rgb(255, 165, 0)" // Color for values exceeding the limit
            //       : "rgb(240, 5, 5)"; // Default color
            //   },
            //   // backgroundColor: (ctx) => {
            //   //   return ctx.p0.parsed.y < 60 || ctx.p1.parsed.y < 60
            //   //     ? "rgba(255, 165, 0, 0.2)" // Background for exceeded limit
            //   //     : "rgba(240, 5, 5, 0.2)"; // Default background
            //   // },
            // },
          },
          {
            label: "S2",
            data: sensor2Data,
            borderColor: "rgb(0, 123, 255)", // Bright Blue
            backgroundColor: "rgba(0, 123, 255, 0.2)",
            pointRadius: 0,
            pointHoverRadius: 0,
            borderWidth: 1.25,
            hidden: true,
          },
          {
            label: "S3",
            data: sensor3Data,
            borderColor: "rgb(40, 167, 69)", // Bright Green
            backgroundColor: "rgba(40, 167, 69, 0.2)",
            pointRadius: 0,
            pointHoverRadius: 0,
            borderWidth: 1.25,
            hidden: true,
          },
          {
            label: "S4",
            data: sensor4Data,
            borderColor: "rgb(255, 193, 7)", // Bright Yellow
            backgroundColor: "rgba(255, 193, 7, 0.2)",
            pointRadius: 0,
            pointHoverRadius: 0,
            borderWidth: 1.25,
            hidden: true,
          },
          {
            label: "S5",
            data: sensor5Data,
            borderColor: "rgb(153, 50, 204)", // Vibrant Purple
            backgroundColor: "rgba(153, 50, 204, 0.2)",
            pointRadius: 0,
            pointHoverRadius: 0,
            borderWidth: 1.25,
            hidden: true,
          },
          {
            label: "S6",
            data: sensor6Data,
            borderColor: "rgb(163, 106, 2)", // Bright Orange
            backgroundColor: "rgba(163, 106, 2, 0.2)",
            pointRadius: 0,
            pointHoverRadius: 0,
            borderWidth: 1.25,
            hidden: true,
          },
          {
            label: "S7",
            data: sensor7Data,
            borderColor: "rgb(241, 110, 250)", // Vibrant Tomato Red
            backgroundColor: "rgba(241, 110, 250, 0.2)",
            pointRadius: 0,
            pointHoverRadius: 0,
            borderWidth: 1.25,
            hidden: true,
          },
          {
            label: "S8",
            data: sensor8Data,
            borderColor: "rgb(0, 255, 127)", // Medium Sea Green
            backgroundColor: "rgba(0, 255, 127, 0.2)",
            pointRadius: 0,
            pointHoverRadius: 0,
            borderWidth: 1.25,
            hidden: true,
          },
          {
            label: "S9",
            data: sensor9Data,
            borderColor: "rgb(148, 72, 148)", // Violet
            backgroundColor: "rgba(148, 72, 148, 0.2)",
            pointRadius: 0,
            pointHoverRadius: 0,
            borderWidth: 1.25,
            hidden: true,
          },
          {
            label: "S10",
            data: sensor10Data,
            borderColor: "rgb(240, 128, 128)", // Light Coral
            backgroundColor: "rgba(240, 128, 128, 0.2)",
            pointRadius: 0,
            pointHoverRadius: 0,
            borderWidth: 1.25,
            hidden: true,
          },
          {
            label: "S11",
            data: sensor11Data,
            borderColor: "rgb(255, 20, 147)", // Deep Pink
            backgroundColor: "rgba(255, 20, 147, 0.2)",
            pointRadius: 0,
            pointHoverRadius: 0,
            borderWidth: 1.25,
            hidden: true,
          },
          {
            label: "S12",
            data: sensor12Data,
            borderColor: "rgb(0, 191, 255)", // Deep Sky Blue
            backgroundColor: "rgba(0, 191, 255, 0.2)",
            pointRadius: 0,
            pointHoverRadius: 0,
            borderWidth: 1.25,
            hidden: true,
          },
          {
            label: "S13",
            data: sensor13Data,
            borderColor: "rgb(75, 0, 130)", // Indigo
            backgroundColor: "rgba(75, 0, 130, 0.2)",
            pointRadius: 0,
            pointHoverRadius: 0,
            borderWidth: 1.25,
            hidden: true,
          },
          {
            label: "S14",
            data: sensor14Data,
            borderColor: "rgb(255, 99, 71)", // Bright Coral
            backgroundColor: "rgba(255, 99, 71, 0.2)",
            pointRadius: 0,
            pointHoverRadius: 0,
            borderWidth: 1.25,
            hidden: true,
          },
          {
            label: "S15",
            data: sensor15Data,
            borderColor: "rgb(255, 222, 173)", // Light Peach
            backgroundColor: "rgba(255, 222, 173, 0.2)",
            pointRadius: 0,
            pointHoverRadius: 0,
            borderWidth: 1.25,
            hidden: true,
          },
        ],
      });
    }
  }, [dataFromApp, viewAllCards]);

  const limit = 60; // Define the limit

  const customPlugin = {
    id: "customLineSegment",
    beforeDatasetDraw(chart, args, options) {
      const {
        ctx,
        chartArea: { top, bottom },
        scales: { x, y },
      } = chart;
      const dataset = chart.data.datasets[args.index];
      const meta = chart.getDatasetMeta(args.index);
      const data = dataset.data;

      ctx.save();

      for (let i = 0; i < data.length - 1; i++) {
        const currPoint = meta.data[i];
        const nextPoint = meta.data[i + 1];

        const currValue = data[i];
        const nextValue = data[i + 1];

        // Coordinates for current and next points
        const xCurr = currPoint.x;
        const yCurr = y.getPixelForValue(currValue);
        const xNext = nextPoint.x;
        const yNext = y.getPixelForValue(nextValue);

        // Define colors for each segment
        const color =
          currValue > limit || nextValue > limit
            ? "rgb(255, 165, 0)"
            : "rgb(240, 5, 5)";

        ctx.beginPath();
        ctx.moveTo(xCurr, yCurr);
        ctx.lineTo(xNext, yNext);
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.25;
        ctx.stroke();
      }

      ctx.restore();
    },
  };

  const lineOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
          labels: {
            color: "#4B5563",
            font: {
              size: 8,
            },
            boxWidth: 20,
            padding: 5,
          },
        },
        zoom: {
          pan: {
            enabled: true,
            mode: "x",
          },
          zoom: {
            enabled: true,
            mode: "x",
            wheel: {
              enabled: true,
            },
            pinch: {
              enabled: true,
            },
          },
        },
        customLineSegment: {},
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: "#4B5563",
            font: {
              size: 6,
            },
          },
        },
        y: {
          grid: {
            display: true,
          },
          ticks: {
            color: "#4B5563",
            font: {
              size: 6,
            },
          },
        },
      },
    }),
    []
  );

  console.log('hindalco alert limit', hindalcoAlertLimit);

  return (
    <div className="xl:h-screen p-4 flex flex-col gap-2 ">
      {/* top bar - h-[10%] */}
      <div className="xl:h-[10%]">
        <Navbar />
      </div>

      {/* main content 1 h-[50%] */}
      <div className="xl:h-[50%] flex flex-col xl:flex-row gap-2 ">
        {/* 2d image */}
        <div
          className="w-full xl:w-[70%] flex flex-col gap-4 md:gap-2 rounded-xl p-2 bg-[#dde3f1]"
          // style={{
          //   backgroundImage:
          //     "radial-gradient(circle, #dbf2ff, #d6ebf9, #d1e4f3, #ccdced, #c8d5e7, #c2cfe3, #bdcadf, #afbfdb, #a9bbd9, #a1b4d6, #98b0d4, #90aad1)",
          // }}
        >
          <div className=" flex flex-col md:flex-row gap-4 md:gap-2 xl:h-[55%] text-sm 2xl:text-base">
            <div className="relative w-full md:w-[55%] flex justify-center items-center p-4">
              <div className="absolute top-1 left-1 flex gap-2 justify-center text-sm 2xl:text-base">
                {/* device temperature */}
                <div
                  className="flex items-center gap-0.5 text-[#23439b]"
                  data-tooltip-id="tooltip-style"
                  data-tooltip-content="Device Temperature"
                >
                  <FaMobileScreenButton className="text-lg 2xl:text-xl" />
                  <div className="font-medium text-black">
                    {dataFromApp.length > 0 && dataFromApp[0].DeviceTemperature}
                    °C
                  </div>
                </div>

                {/* signal strength */}
                <div
                  className="flex items-center gap-0.5 text-[#23439b]"
                  data-tooltip-id="tooltip-style"
                  data-tooltip-content="Signal Strength"
                >
                  <LuRadioTower className="text-lg 2xl:text-xl" />
                  <div className="font-medium text-black">
                    {dataFromApp.length > 0 && dataFromApp[0].DeviceSignal}%
                  </div>
                </div>

                {/* battery */}
                <div
                  className="flex items-center gap-0.5 text-[#23439b]"
                  data-tooltip-id="tooltip-style"
                  data-tooltip-content="Battery Percentage"
                >
                  <FaBatteryFull className="text-lg 2xl:text-xl" />
                  <div className="font-medium text-black">
                    {dataFromApp.length > 0 && dataFromApp[0].DeviceBattery}%
                  </div>
                </div>

                {/* activity status */}
                {activeStatus === "Active" ? (
                  <div
                    className="text-[#23439b]"
                    data-tooltip-id="tooltip-style"
                    data-tooltip-content="Data is being recieved!"
                  >
                    <BsDatabaseFillCheck className="text-xl 2xl:text-2xl" />
                  </div>
                ) : (
                  <div
                    className="status-indicator"
                    data-tooltip-id="tooltip-style"
                    data-tooltip-content="No data is being recieved for more than 5 minutes"
                  >
                    <IoWarningSharp className="text-xl 2xl:text-2xl" />
                  </div>
                )}
              </div>
              <div className="h-[150px] md:h-auto flex items-center">
                <img
                  src={potline}
                  alt="potline"
                  className="max-w-[250px] md:max-w-[300px] 2xl:max-w-[450px]"
                />
              </div>
              {/* view all cards */}
              <div
                className="absolute bottom-1 left-1 hover:scale-110 duration-200 text-black"
                onClick={handleViewCards}
              >
                {viewAllCards === true ? (
                  <button
                    className="bg-[#e4ba4c] text-xs 2xl:text-base font-medium rounded-md px-1 py-0.5"
                    data-tooltip-id="tooltip-style"
                    data-tooltip-content="View 10 sensor cards"
                  >
                    View Less -
                  </button>
                ) : (
                  <button
                    className="bg-[#e4ba4c] text-xs 2xl:text-base font-medium rounded-md px-1 py-0.5"
                    data-tooltip-id="tooltip-style"
                    data-tooltip-content="View 15 sensor cards"
                  >
                    View All +
                  </button>
                )}
              </div>
            </div>
            <div className="w-full md:w-[45%] flex flex-col gap-2 p-1">
              <ApexCharts
                options={barData.options}
                series={barData.series}
                type="bar"
                height="100%"
              />
            </div>
          </div>
          {/* cards */}
          <div
            className={`xl:h-[45%] grid grid-cols-2 md:grid-cols-5 ${
              viewAllCards && "md:grid-cols-8"
            } gap-1 overflow-auto`}
            style={{ scrollbarWidth: "none" }}
          >
            <div
              className={`py-1 px-2 text-sm 2xl:text-lg flex items-center justify-center gap-1 rounded-md shadow-xl ${
                (dataFromApp.length > 0 && dataFromApp[0].S1) === "N/A"
                  ? "border border-gray-400 text-gray-500 bg-[#f5ffff]"
                  : dataFromApp.length > 0 &&
                    dataFromApp[0].S1 >= alertLimitFromLS
                  ? "card-indicator"
                  : "text-[#23439b] bg-[#f5ffff] border border-gray-400"
              }`}
            >
              <BsThermometerSun className="text-2xl 2xl:text-5xl" />
              <div>
                <div
                  className={`${
                    dataFromApp.length > 0 &&
                    dataFromApp[0].S1 >= alertLimitFromLS
                      ? "text-white"
                      : "text-black"
                  } text-center ${viewAllCards && "text-xs 2xl:text-sm"}`}
                >
                  Sensor&nbsp;1
                </div>
                <div className="text-lg 2xl:text-4xl font-bold">
                  {isNaN(
                    parseFloat(dataFromApp.length > 0 && dataFromApp[0].S1)
                  )
                    ? "N/A"
                    : `${parseFloat(
                        dataFromApp.length > 0 && dataFromApp[0].S1
                      ).toFixed(1)}°C`}
                </div>
              </div>
            </div>

            <div
              className={`py-1 px-2 text-sm 2xl:text-lg flex items-center justify-center gap-1 rounded-md  ${
                (dataFromApp.length > 0 && dataFromApp[0].S2) === "N/A"
                  ? "border border-gray-400 text-gray-500 bg-[#f5ffff]"
                  : dataFromApp.length > 0 &&
                    dataFromApp[0].S2 >= alertLimitFromLS
                  ? "card-indicator"
                  : "text-[#23439b] bg-[#f5ffff] border border-gray-400"
              }`}
            >
              <BsThermometerSun className="text-2xl 2xl:text-5xl" />
              <div>
                <div
                  className={`${
                    dataFromApp.length > 0 &&
                    dataFromApp[0].S2 >= alertLimitFromLS
                      ? "text-white"
                      : "text-black"
                  } text-center ${viewAllCards && "text-xs 2xl:text-sm"}`}
                >
                  Sensor&nbsp;2
                </div>
                <div className="text-lg 2xl:text-4xl font-bold">
                  {isNaN(
                    parseFloat(dataFromApp.length > 0 && dataFromApp[0].S2)
                  )
                    ? "N/A"
                    : `${parseFloat(
                        dataFromApp.length > 0 && dataFromApp[0].S2
                      ).toFixed(1)}°C`}
                </div>
              </div>
            </div>

            <div
              className={`py-1 px-2 text-sm 2xl:text-lg flex items-center justify-center gap-1 rounded-md  ${
                (dataFromApp.length > 0 && dataFromApp[0].S3) === "N/A"
                  ? "border border-gray-400 text-gray-500 bg-[#f5ffff]"
                  : dataFromApp.length > 0 &&
                    dataFromApp[0].S3 >= alertLimitFromLS
                  ? "card-indicator"
                  : "text-[#23439b] bg-[#f5ffff] border border-gray-400"
              }`}
            >
              <BsThermometerSun className="text-2xl 2xl:text-5xl" />
              <div>
                <div
                  className={`${
                    dataFromApp.length > 0 &&
                    dataFromApp[0].S3 >= alertLimitFromLS
                      ? "text-white"
                      : "text-black"
                  } text-center ${viewAllCards && "text-xs 2xl:text-sm"}`}
                >
                  Sensor&nbsp;3
                </div>
                <div className="text-lg 2xl:text-4xl font-bold">
                  {isNaN(
                    parseFloat(dataFromApp.length > 0 && dataFromApp[0].S3)
                  )
                    ? "N/A"
                    : `${parseFloat(
                        dataFromApp.length > 0 && dataFromApp[0].S3
                      ).toFixed(1)}°C`}
                </div>
              </div>
            </div>

            <div
              className={`py-1 px-2 text-sm 2xl:text-lg flex items-center justify-center gap-1 rounded-md  ${
                (dataFromApp.length > 0 && dataFromApp[0].S4) === "N/A"
                  ? "border border-gray-400 text-gray-500 bg-[#f5ffff]"
                  : dataFromApp.length > 0 &&
                    dataFromApp[0].S4 >= alertLimitFromLS
                  ? "card-indicator"
                  : "text-[#23439b] bg-[#f5ffff] border border-gray-400"
              }`}
            >
              <BsThermometerSun className="text-2xl 2xl:text-5xl" />
              <div>
                <div
                  className={`${
                    dataFromApp.length > 0 &&
                    dataFromApp[0].S4 >= alertLimitFromLS
                      ? "text-white"
                      : "text-black"
                  } text-center ${viewAllCards && "text-xs 2xl:text-sm"}`}
                >
                  Sensor&nbsp;4
                </div>
                <div className="text-lg 2xl:text-4xl font-bold">
                  {isNaN(
                    parseFloat(dataFromApp.length > 0 && dataFromApp[0].S4)
                  )
                    ? "N/A"
                    : `${parseFloat(
                        dataFromApp.length > 0 && dataFromApp[0].S4
                      ).toFixed(1)}°C`}
                </div>
              </div>
            </div>

            <div
              className={`py-1 px-2 text-sm 2xl:text-lg flex items-center justify-center gap-1 rounded-md  ${
                (dataFromApp.length > 0 && dataFromApp[0].S5) === "N/A"
                  ? "border border-gray-400 text-gray-500 bg-[#f5ffff]"
                  : dataFromApp.length > 0 &&
                    dataFromApp[0].S5 >= alertLimitFromLS
                  ? "card-indicator"
                  : "text-[#23439b] bg-[#f5ffff] border border-gray-400"
              }`}
            >
              <BsThermometerSun className="text-2xl 2xl:text-5xl" />
              <div>
                <div
                  className={`${
                    dataFromApp.length > 0 &&
                    dataFromApp[0].S5 >= alertLimitFromLS
                      ? "text-white"
                      : "text-black"
                  } text-center ${viewAllCards && "text-xs 2xl:text-sm"}`}
                >
                  Sensor&nbsp;5
                </div>
                <div className="text-lg 2xl:text-4xl font-bold">
                  {isNaN(
                    parseFloat(dataFromApp.length > 0 && dataFromApp[0].S5)
                  )
                    ? "N/A"
                    : `${parseFloat(
                        dataFromApp.length > 0 && dataFromApp[0].S5
                      ).toFixed(1)}°C`}
                </div>
              </div>
            </div>

            <div
              className={`py-1 px-2 text-sm 2xl:text-lg flex items-center justify-center gap-1 rounded-md  ${
                (dataFromApp.length > 0 && dataFromApp[0].S6) === "N/A"
                  ? "border border-gray-400 text-gray-500 bg-[#f5ffff]"
                  : dataFromApp.length > 0 &&
                    dataFromApp[0].S6 >= alertLimitFromLS
                  ? "card-indicator"
                  : "text-[#23439b] bg-[#f5ffff] border border-gray-400"
              }`}
            >
              <BsThermometerSun className="text-2xl 2xl:text-5xl" />
              <div>
                <div
                  className={`${
                    dataFromApp.length > 0 &&
                    dataFromApp[0].S6 >= alertLimitFromLS
                      ? "text-white"
                      : "text-black"
                  } text-center ${viewAllCards && "text-xs 2xl:text-sm"}`}
                >
                  Sensor&nbsp;6
                </div>
                <div className="text-lg 2xl:text-4xl font-bold">
                  {isNaN(
                    parseFloat(dataFromApp.length > 0 && dataFromApp[0].S6)
                  )
                    ? "N/A"
                    : `${parseFloat(
                        dataFromApp.length > 0 && dataFromApp[0].S6
                      ).toFixed(1)}°C`}
                </div>
              </div>
            </div>

            <div
              className={`py-1 px-2 text-sm 2xl:text-lg flex items-center justify-center gap-1 rounded-md  ${
                (dataFromApp.length > 0 && dataFromApp[0].S7) === "N/A"
                  ? "border border-gray-400 text-gray-500 bg-[#f5ffff]"
                  : dataFromApp.length > 0 &&
                    dataFromApp[0].S7 >= alertLimitFromLS
                  ? "card-indicator"
                  : "text-[#23439b] bg-[#f5ffff] border border-gray-400"
              }`}
            >
              <BsThermometerSun className="text-2xl 2xl:text-5xl" />
              <div>
                <div
                  className={`${
                    dataFromApp.length > 0 &&
                    dataFromApp[0].S7 >= alertLimitFromLS
                      ? "text-white"
                      : "text-black"
                  } text-center ${viewAllCards && "text-xs 2xl:text-sm"}`}
                >
                  Sensor&nbsp;7
                </div>
                <div className="text-lg 2xl:text-4xl font-bold">
                  {isNaN(
                    parseFloat(dataFromApp.length > 0 && dataFromApp[0].S7)
                  )
                    ? "N/A"
                    : `${parseFloat(
                        dataFromApp.length > 0 && dataFromApp[0].S7
                      ).toFixed(1)}°C`}
                </div>
              </div>
            </div>

            <div
              className={`py-1 px-2 text-sm 2xl:text-lg flex items-center justify-center gap-1 rounded-md  ${
                (dataFromApp.length > 0 && dataFromApp[0].S8) === "N/A"
                  ? "border border-gray-400 text-gray-500 bg-[#f5ffff]"
                  : dataFromApp.length > 0 &&
                    dataFromApp[0].S8 >= alertLimitFromLS
                  ? "card-indicator"
                  : "text-[#23439b] bg-[#f5ffff] border border-gray-400"
              }`}
            >
              <BsThermometerSun className="text-2xl 2xl:text-5xl" />
              <div>
                <div
                  className={`${
                    dataFromApp.length > 0 &&
                    dataFromApp[0].S8 >= alertLimitFromLS
                      ? "text-white"
                      : "text-black"
                  } text-center ${viewAllCards && "text-xs 2xl:text-sm"}`}
                >
                  Sensor&nbsp;8
                </div>
                <div className="text-lg 2xl:text-4xl font-bold">
                  {isNaN(
                    parseFloat(dataFromApp.length > 0 && dataFromApp[0].S8)
                  )
                    ? "N/A"
                    : `${parseFloat(
                        dataFromApp.length > 0 && dataFromApp[0].S8
                      ).toFixed(1)}°C`}
                </div>
              </div>
            </div>

            <div
              className={`py-1 px-2 text-sm 2xl:text-lg flex items-center justify-center gap-1 rounded-md  ${
                (dataFromApp.length > 0 && dataFromApp[0].S9) === "N/A"
                  ? "border border-gray-400 text-gray-500 bg-[#f5ffff]"
                  : dataFromApp.length > 0 &&
                    dataFromApp[0].S9 >= alertLimitFromLS
                  ? "card-indicator"
                  : "text-[#23439b] bg-[#f5ffff] border border-gray-400"
              }`}
            >
              <BsThermometerSun className="text-2xl 2xl:text-5xl" />
              <div>
                <div
                  className={`${
                    dataFromApp.length > 0 &&
                    dataFromApp[0].S9 >= alertLimitFromLS
                      ? "text-white"
                      : "text-black"
                  } text-center ${viewAllCards && "text-xs 2xl:text-sm"}`}
                >
                  Sensor&nbsp;9
                </div>
                <div className="text-lg 2xl:text-4xl font-bold">
                  {isNaN(
                    parseFloat(dataFromApp.length > 0 && dataFromApp[0].S9)
                  )
                    ? "N/A"
                    : `${parseFloat(
                        dataFromApp.length > 0 && dataFromApp[0].S9
                      ).toFixed(1)}°C`}
                </div>
              </div>
            </div>

            <div
              className={`py-1 px-2 text-sm 2xl:text-lg flex items-center justify-center gap-1 rounded-md  ${
                (dataFromApp.length > 0 && dataFromApp[0].S10) === "N/A"
                  ? "border border-gray-400 text-gray-500 bg-[#f5ffff]"
                  : dataFromApp.length > 0 &&
                    dataFromApp[0].S10 >= alertLimitFromLS
                  ? "card-indicator"
                  : "text-[#23439b] bg-[#f5ffff] border border-gray-400"
              }`}
            >
              <BsThermometerSun className="text-2xl 2xl:text-5xl" />
              <div>
                <div
                  className={`${
                    dataFromApp.length > 0 &&
                    dataFromApp[0].S10 >= alertLimitFromLS
                      ? "text-white"
                      : "text-black"
                  } text-center ${viewAllCards && "text-xs 2xl:text-sm"}`}
                >
                  Sensor&nbsp;10
                </div>
                <div className="text-lg 2xl:text-4xl font-bold">
                  {isNaN(
                    parseFloat(dataFromApp.length > 0 && dataFromApp[0].S10)
                  )
                    ? "N/A"
                    : `${parseFloat(
                        dataFromApp.length > 0 && dataFromApp[0].S10
                      ).toFixed(1)}°C`}
                </div>
              </div>
            </div>

            {/* extra 5 cards */}
            {viewAllCards && (
              <>
                <div
                  className={`py-1 px-2 text-sm 2xl:text-lg flex items-center justify-center gap-1 rounded-md  ${
                    (dataFromApp.length > 0 && dataFromApp[0].S11) === "N/A"
                      ? "border border-gray-400 text-gray-500 bg-[#f5ffff]"
                      : dataFromApp.length > 0 &&
                        dataFromApp[0].S11 >= alertLimitFromLS
                      ? "card-indicator"
                      : "text-[#23439b] bg-[#f5ffff] border border-gray-400"
                  }`}
                >
                  <BsThermometerSun className="text-2xl 2xl:text-5xl" />
                  <div>
                    <div
                      className={`${
                        dataFromApp.length > 0 &&
                        dataFromApp[0].S11 >= alertLimitFromLS
                          ? "text-white"
                          : "text-black"
                      } text-center ${viewAllCards && "text-xs 2xl:text-sm"}`}
                    >
                      Sensor&nbsp;11
                    </div>
                    <div className="text-lg 2xl:text-4xl font-bold">
                      {isNaN(
                        parseFloat(dataFromApp.length > 0 && dataFromApp[0].S11)
                      )
                        ? "N/A"
                        : `${parseFloat(
                            dataFromApp.length > 0 && dataFromApp[0].S11
                          ).toFixed(1)}°C`}
                    </div>
                  </div>
                </div>

                <div
                  className={`py-1 px-2 text-sm 2xl:text-lg flex items-center justify-center gap-1 rounded-md  ${
                    (dataFromApp.length > 0 && dataFromApp[0].S12) === "N/A"
                      ? "border border-gray-400 text-gray-500 bg-[#f5ffff]"
                      : dataFromApp.length > 0 &&
                        dataFromApp[0].S12 >= alertLimitFromLS
                      ? "card-indicator"
                      : "text-[#23439b] bg-[#f5ffff] border border-gray-400"
                  }`}
                >
                  <BsThermometerSun className="text-2xl 2xl:text-5xl" />
                  <div>
                    <div
                      className={`${
                        dataFromApp.length > 0 &&
                        dataFromApp[0].S12 >= alertLimitFromLS
                          ? "text-white"
                          : "text-black"
                      } text-center ${viewAllCards && "text-xs 2xl:text-sm"}`}
                    >
                      Sensor&nbsp;12
                    </div>
                    <div className="text-lg 2xl:text-4xl font-bold">
                      {isNaN(
                        parseFloat(dataFromApp.length > 0 && dataFromApp[0].S12)
                      )
                        ? "N/A"
                        : `${parseFloat(
                            dataFromApp.length > 0 && dataFromApp[0].S12
                          ).toFixed(1)}°C`}
                    </div>
                  </div>
                </div>

                <div
                  className={`py-1 px-2 text-sm 2xl:text-lg flex items-center justify-center gap-1 rounded-md  ${
                    (dataFromApp.length > 0 && dataFromApp[0].S13) === "N/A"
                      ? "border border-gray-400 text-gray-500 bg-[#f5ffff]"
                      : dataFromApp.length > 0 &&
                        dataFromApp[0].S13 >= alertLimitFromLS
                      ? "card-indicator"
                      : "text-[#23439b] bg-[#f5ffff] border border-gray-400"
                  }`}
                >
                  <BsThermometerSun className="text-2xl 2xl:text-5xl" />
                  <div>
                    <div
                      className={`${
                        dataFromApp.length > 0 &&
                        dataFromApp[0].S13 >= alertLimitFromLS
                          ? "text-white"
                          : "text-black"
                      } text-center ${viewAllCards && "text-xs 2xl:text-sm"}`}
                    >
                      Sensor&nbsp;13
                    </div>
                    <div className="text-lg 2xl:text-4xl font-bold">
                      {isNaN(
                        parseFloat(dataFromApp.length > 0 && dataFromApp[0].S13)
                      )
                        ? "N/A"
                        : `${parseFloat(
                            dataFromApp.length > 0 && dataFromApp[0].S13
                          ).toFixed(1)}°C`}
                    </div>
                  </div>
                </div>

                <div
                  className={`py-1 px-2 text-sm 2xl:text-lg flex items-center justify-center gap-1 rounded-md  ${
                    (dataFromApp.length > 0 && dataFromApp[0].S14) === "N/A"
                      ? "border border-gray-400 text-gray-500 bg-[#f5ffff]"
                      : dataFromApp.length > 0 &&
                        dataFromApp[0].S14 >= alertLimitFromLS
                      ? "card-indicator"
                      : "text-[#23439b] bg-[#f5ffff] border border-gray-400"
                  }`}
                >
                  <BsThermometerSun className="text-2xl 2xl:text-5xl" />
                  <div>
                    <div
                      className={`${
                        dataFromApp.length > 0 &&
                        dataFromApp[0].S14 >= alertLimitFromLS
                          ? "text-white"
                          : "text-black"
                      } text-center ${viewAllCards && "text-xs 2xl:text-sm"}`}
                    >
                      Sensor&nbsp;14
                    </div>
                    <div className="text-lg 2xl:text-4xl font-bold">
                      {isNaN(
                        parseFloat(dataFromApp.length > 0 && dataFromApp[0].S14)
                      )
                        ? "N/A"
                        : `${parseFloat(
                            dataFromApp.length > 0 && dataFromApp[0].S14
                          ).toFixed(1)}°C`}
                    </div>
                  </div>
                </div>

                <div
                  className={`py-1 px-2 text-sm 2xl:text-lg flex items-center justify-center gap-1 rounded-md  ${
                    (dataFromApp.length > 0 && dataFromApp[0].S15) === "N/A"
                      ? "border border-gray-400 text-gray-500 bg-[#f5ffff]"
                      : dataFromApp.length > 0 &&
                        dataFromApp[0].S15 >= alertLimitFromLS
                      ? "card-indicator"
                      : "text-[#23439b] bg-[#f5ffff] border border-gray-400"
                  }`}
                >
                  <BsThermometerSun className="text-2xl 2xl:text-5xl" />
                  <div>
                    <div
                      className={`${
                        dataFromApp.length > 0 &&
                        dataFromApp[0].S15 >= alertLimitFromLS
                          ? "text-white"
                          : "text-black"
                      } text-center ${viewAllCards && "text-xs 2xl:text-sm"}`}
                    >
                      Sensor&nbsp;15
                    </div>
                    <div className="text-lg 2xl:text-4xl font-bold">
                      {isNaN(
                        parseFloat(dataFromApp.length > 0 && dataFromApp[0].S15)
                      )
                        ? "N/A"
                        : `${parseFloat(
                            dataFromApp.length > 0 && dataFromApp[0].S15
                          ).toFixed(1)}°C`}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* alert box */}
        <div
          className="h-[300px] xl:h-auto rounded-xl w-full xl:w-[30%] flex flex-col bg-[#dde3f1]"
          // style={{
          //   backgroundImage:
          //     "radial-gradient(circle, #dbf2ff, #d6ebf9, #d1e4f3, #ccdced, #c8d5e7, #c2cfe3, #bdcadf, #afbfdb, #a9bbd9, #a1b4d6, #98b0d4, #90aad1)",
          // }}
        >
          <div className="flex justify-center gap-2 rounded-t-md items-center py-1 px-2 font-bold">
            <div className="text-[#23439b] 2xl:text-xl">Alerts</div>
          </div>
          <div
            className="relative flex flex-col flex-1 text-gray-800 px-2 overflow-auto rounded-b-md"
            style={{
              scrollbarWidth: "none",
              scrollbarColor: "#D1D5DB transparent",
            }}
          >
            <div className="flex w-full justify-between items-center sticky  top-0 mb-2 xl:mb-4 py-1">
              <div className="text-sm 2xl:text-base font-bold px-2 rounded-md bg-[#f5ffff] border border-gray-400 flex items-center gap-1 shadow-md text-[#23439b]">
                {alertsArray.length}&nbsp;Alerts
                <FaBell
                  className={`2xl:text-lg ${
                    alertsArray.length > 0 ? "text-red-500" : "text-[#23439b]"
                  }`}
                />
              </div>
            </div>

            {alertsArray.length > 0 ? (
              alertsArray.map(({ key, value }) => (
                <div className="rounded-md text-white bg-gradient-to-tr from-red-700 via-red-500 to-red-400 p-1 flex justify-around items-center mb-2">
                  <div>{key}</div>
                  <div>-</div>
                  <div className="font-medium">{value} °C</div>
                  <div>-</div>
                  <div>{dataFromApp.length > 0 && dataFromApp[0].Time}</div>
                </div>
              ))
            ) : (
              <div className="absolute inset-0 flex justify-center items-center text-sm ">
                No new Alerts
              </div>
            )}
          </div>
        </div>
      </div>

      {/* main content 2 h-[40%] */}
      <div className="h-[40%] rounded-xl flex flex-col-reverse md:flex-row gap-2 ">
        <div className="w-full md:w-[20%] flex flex-col gap-2 ">
          {/* last update */}
          <div
            className="flex flex-row items-center md:flex-col justify-evenly rounded-md h-[25%] p-1 bg-[#dde3f1]"
            // style={{
            //   backgroundImage:
            //     "radial-gradient(circle, #dbf2ff, #d6ebf9, #d1e4f3, #ccdced, #c8d5e7, #c2cfe3, #bdcadf, #afbfdb, #a9bbd9, #a1b4d6, #98b0d4, #90aad1)",
            // }}
          >
            <div className="flex items-center gap-2 font-medium text-[#23439b] 2xl:text-xl">
              <MdOutlineUpdate className="text-2xl 2xl:text-3xl" />
              <div>Last Updated Data: </div>
            </div>
            <div className="text-center text-sm 2xl:text-xl">
              {dataFromApp.length > 0 && dataFromApp[0].Time}
            </div>
          </div>

          {/* settings */}
          <form
            className=" rounded-md flex flex-col justify-evenly gap-4 md:gap-0 h-[75%] p-1 bg-[#dde3f1]"
            // style={{
            //   backgroundImage:
            //     "radial-gradient(circle, #dbf2ff, #d6ebf9, #d1e4f3, #ccdced, #c8d5e7, #c2cfe3, #bdcadf, #afbfdb, #a9bbd9, #a1b4d6, #98b0d4, #90aad1)",
            // }}
            onSubmit={handleAlertLimit}
          >
            <div className="flex items-center justify-center text-[#23439b]">
              <LiaRulerVerticalSolid className="text-2xl 2xl:text-3xl" />
              <div className="font-medium">Alert&nbsp;limit</div>
            </div>
            <div className="flex items-center gap-2 text-sm 2xl:text-xl">
              <div>Current&nbsp;Limit</div>
              <div className="py-0.5 px-1 w-full text-sm 2xl:text-base font-medium rounded-xl text-center border border-b-gray-700 border-t-transparent border-l-transparent border-r-transparent">
                {localStorage.getItem("HindalcoAlertLimit")}°C
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm 2xl:text-xl">
              <div>Change&nbsp;Limit</div>
              <input
                type="text"
                required
                className="py-0.5 px-1 w-full text-sm 2xl:text-base font-medium rounded-sm focus:outline-none bg-white"
                value={hindalcoAlertLimit}
                onChange={(e) => setHindalcoAlertLimit(e.target.value)}
                // onClick={handleAlertLimit}
              />
            </div>
            <button
              type="submit"
              className="bg-[#e4ba4c] hover:scale-[1.03] duration-200 font-medium p-1 px-2 rounded-md"
              data-tooltip-id="tooltip-style"
              data-tooltip-content="Set new alert limit"
            >
              Set
            </button>
          </form>
        </div>

        {/* line chart card */}
        <div
          className=" overflow-hidden p-2 w-full md:w-[80%] h-[300px] xl:h-auto rounded-md flex flex-col-reverse gap-2 md:flex-row bg-[#dde3f1]"
          // style={{
          //   backgroundImage:
          //     "radial-gradient(circle, #dbf2ff, #d6ebf9, #d1e4f3, #ccdced, #c8d5e7, #c2cfe3, #bdcadf, #afbfdb, #a9bbd9, #a1b4d6, #98b0d4, #90aad1)",
          // }}
        >
          <div className="w-full h-full">
            <Line data={lineData} options={lineOptions} width={"100%"} />
          </div>
          <div className="flex flex-row flex-wrap md:flex-col justify-center gap-0 md:gap-2 text-sm 2xl:text-base">
            <div className="mr-2 text-center font-medium text-[#23439b]">
              Data&nbsp;Limit
            </div>
            <div
              className="flex items-center gap-1"
              data-tooltip-id="tooltip-style"
              data-tooltip-content="Plot last 100 data"
            >
              <input
                type="radio"
                id="option1"
                name="options"
                value={100}
                checked={hindalcoLimit === 100}
                className="cursor-pointer"
                onChange={handleLineLimit}
              />
              <label htmlFor="option1" className="mr-2 cursor-pointer">
                100&nbsp;Data
              </label>
            </div>

            <div
              className="flex items-center gap-1"
              data-tooltip-id="tooltip-style"
              data-tooltip-content="Plot last 300 data"
            >
              <input
                type="radio"
                id="option2"
                name="options"
                value={300}
                checked={hindalcoLimit === 300}
                className="cursor-pointer"
                onChange={handleLineLimit}
              />
              <label htmlFor="option2" className="mr-2 cursor-pointer">
                300&nbsp;Data
              </label>
            </div>

            <div
              className="flex items-center gap-1"
              data-tooltip-id="tooltip-style"
              data-tooltip-content="Plot last 500 data"
            >
              <input
                type="radio"
                id="option3"
                name="options"
                value={500}
                checked={hindalcoLimit === 500}
                className="cursor-pointer"
                onChange={handleLineLimit}
              />
              <label htmlFor="option3" className="mr-2 cursor-pointer">
                500&nbsp;Data
              </label>
            </div>

            <div
              className="flex items-center gap-1"
              data-tooltip-id="tooltip-style"
              data-tooltip-content="Plot last 1000 data"
            >
              <input
                type="radio"
                id="option4"
                name="options"
                value={1000}
                checked={hindalcoLimit === 1000}
                className="cursor-pointer"
                onChange={handleLineLimit}
              />
              <label htmlFor="option4" className="mr-2 cursor-pointer">
                1000&nbsp;Data
              </label>
            </div>
          </div>
        </div>
      </div>
      <ReactTooltip
        id="tooltip-style"
        style={{
          backgroundColor: "white",
          color: "#4B5563",
          fontSize: "0.75rem",
        }}
      />
    </div>
  );
}

export default Dashboard;
