import React from 'react';
import potline from '../Assets/potline.png';
import { FaBell, FaBatteryFull } from "react-icons/fa";
import { FaMobileScreenButton } from "react-icons/fa6";
import { LuRadioTower } from "react-icons/lu";
import { useRef, useState, useEffect } from "react";
import { MdOutlineUpdate } from "react-icons/md";
import { BsThermometerSun } from "react-icons/bs";
import { LiaRulerVerticalSolid } from "react-icons/lia";
import ApexCharts from "react-apexcharts";
import Navbar from './Navbar';
import "react-tooltip/dist/react-tooltip.css";
import { Tooltip as ReactTooltip } from "react-tooltip";

const Dashboard = ({dataFromApp}) => {
  console.log("data", dataFromApp);

  const parameters =
    dataFromApp.length > 0 &&
    Object.keys(dataFromApp[0]).filter((key) => key.startsWith("S"));

  const [selectedSensors, setSelectedSensors] = useState(["S1"]);

  const handleLineSelection = (key) => {
    setSelectedSensors((prevState) =>
      prevState.includes(key)
        ? prevState.filter((sensor) => sensor !== key)
        : [...prevState, key]
    );
  };

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
          columnWidth: "15%",
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
        formatter: (val) => `${val}°C`,
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
          formatter: (val) => `${val}°C`,
        },
      },
      legend: {
        show: false, 
      },
    },
  });

  // line chart options
  const [lineData, setLineData] = useState({
    series: [],
    options: {
      chart: {
        type: "line",
        zoom: {
          enabled: true,
          type: "x",
          scrollable: true,
        },
      },
      xaxis: {
        categories: [],
        labels: {
          style: {
            fontSize: "5px",
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            fontSize: "6px",
          },
        },
      },
      grid: {
        show: false,
      },
      legend: {
        show: false,
      },
      stroke: {
        curve: "straight",
        width: 1.5,
      },
      markers: {
        size: 0,
      },
      tooltip: {
        enabled: true,
        theme: "dark",
        marker: {
          show: true,
        },
      },
    },
  });

  const chartRef = useRef({ min: null, max: null });

  // chart data assignment
  useEffect(() => {
    if (dataFromApp.length > 0) {
      const barCategories = [];
      const barSeries = [];
      const barColors = [];

      Object.keys(dataFromApp[0]).forEach((key) => {
        if (viewAllCards === true) {
          if (
            // key !== "Time" &&
            key !== "createdAt" &&
            key !== "_id" &&
            key !== "DeviceName" &&
            key !== "DeviceTemperature" &&
            key !== "DeviceBattery" &&
            key !== "DeviceSignal"
          ) {
            barCategories.push(key);
            barSeries.push(parseFloat(dataFromApp[0][key]));
            if (alertKeys.includes(key)) {
              barColors.push("#FF0000");
            } else {
              barColors.push("#00FF00");
            }
          }
        } else if (viewAllCards === false) {
          if (
            // key !== "Time" &&
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
            barSeries.push(parseFloat(dataFromApp[0][key]));
            if (alertKeys.includes(key)) {
              barColors.push("#FF0000");
            } else {
              barColors.push("#00FF00");
            }
          }
        }
      });

      const lineCategories = dataFromApp
        .map((item) => new Date(item.createdAt).toLocaleString("en-GB"))
        .reverse();
      const allSeries = [
        {
          name: "S1",
          data: [...dataFromApp.map((item) => item.S1).reverse()],
        },
        {
          name: "S2",
          data: [...dataFromApp.map((item) => item.S2).reverse()],
        },
        {
          name: "S3",
          data: [...dataFromApp.map((item) => item.S3).reverse()],
        },
        {
          name: "S4",
          data: [...dataFromApp.map((item) => item.S4).reverse()],
        },
        {
          name: "S5",
          data: [...dataFromApp.map((item) => item.S5).reverse()],
        },
        {
          name: "S6",
          data: [...dataFromApp.map((item) => item.S6).reverse()],
        },
        {
          name: "S7",
          data: [...dataFromApp.map((item) => item.S7).reverse()],
        },
        {
          name: "S8",
          data: [...dataFromApp.map((item) => item.S8).reverse()],
        },
        {
          name: "S9",
          data: [...dataFromApp.map((item) => item.S9).reverse()],
        },
        {
          name: "S10",
          data: [...dataFromApp.map((item) => item.S10).reverse()],
        },
        {
          name: "S11",
          data: [...dataFromApp.map((item) => item.S11).reverse()],
        },
        {
          name: "S12",
          data: [...dataFromApp.map((item) => item.S12).reverse()],
        },
        {
          name: "S13",
          data: [...dataFromApp.map((item) => item.S13).reverse()],
        },
        {
          name: "S14",
          data: [...dataFromApp.map((item) => item.S14).reverse()],
        },
        {
          name: "S15",
          data: [...dataFromApp.map((item) => item.S15).reverse()],
        },
      ];

      const lineSeries = allSeries.filter((series) =>
        selectedSensors.includes(series.name)
      );

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

      setLineData({
        series: lineSeries,
        options: {
          ...lineData.options,
          chart: {
            type: "line",
            events: {
              zoomed: (chartContext, { xaxis }) => {
                chartRef.current.min = xaxis.min;
                chartRef.current.max = xaxis.max;
              },
              scrolled: (chartContext, { xaxis }) => {
                chartRef.current.min = xaxis.min;
                chartRef.current.max = xaxis.max;
              },
              beforeResetZoom: () => {
                chartRef.current.min = null;
                chartRef.current.max = null;
              },
            },
          },
          xaxis: {
            categories: lineCategories,
            min:
              chartRef.current.min !== null ? chartRef.current.min : undefined,
            max:
              chartRef.current.max !== null ? chartRef.current.max : undefined,
          },
        },
      });
    }
  }, [dataFromApp, selectedSensors, viewAllCards]);

  // console.log("selectedSensors", selectedSensors);
  // console.log("parameters", parameters);

  return (
    <div className="xl:h-screen text-gray-600 p-4 flex flex-col gap-2 ">
      {/* top bar - h-[10%] */}
      <div className="xl:h-[10%]">
        <Navbar />
      </div>

      {/* main content 1 h-[50%] */}
      <div className="xl:h-[50%] flex flex-col xl:flex-row gap-2 ">
        {/* 2d image */}
        <div
          className="w-full xl:w-[70%] flex flex-col gap-4 md:gap-2  rounded-xl p-2"
          style={{
            backgroundImage:
              "radial-gradient(circle, #dbf2ff, #d6ebf9, #d1e4f3, #ccdced, #c8d5e7, #c2cfe3, #bdcadf, #afbfdb, #a9bbd9, #a1b4d6, #98b0d4, #90aad1)",
          }}
        >
          <div className=" flex flex-col md:flex-row gap-4 md:gap-2 xl:h-[55%] text-sm 2xl:text-base">
            <div className="relative w-full md:w-[55%] flex justify-center items-center p-4">
              <div className="absolute top-1 left-1 flex gap-2 justify-center text-sm 2xl:text-base">
                {/* device temperature */}
                <div
                  className={`flex items-center gap-0.5 ${
                    (dataFromApp.length > 0 &&
                      dataFromApp[0].DeviceTemperature) >= 75
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                  data-tooltip-id="tooltip-style"
                  data-tooltip-content="Device Temperature"
                >
                  <FaMobileScreenButton className="text-lg 2xl:text-xl" />
                  <div className="font-medium">
                    {dataFromApp.length > 0 && dataFromApp[0].DeviceTemperature}
                    °C
                  </div>
                </div>

                {/* signal strength */}
                <div
                  className={`flex items-center gap-0.5 ${
                    (dataFromApp.length > 0 && dataFromApp[0].DeviceSignal) >=
                    25
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                  data-tooltip-id="tooltip-style"
                  data-tooltip-content="Signal Strength"
                >
                  <LuRadioTower className="text-lg 2xl:text-xl" />
                  <div className="font-medium">
                    {dataFromApp.length > 0 && dataFromApp[0].DeviceSignal}%
                  </div>
                </div>

                {/* battery */}
                <div
                  className={`flex items-center gap-0.5 ${
                    (dataFromApp.length > 0 && dataFromApp[0].DeviceBattery) >=
                    25
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                  data-tooltip-id="tooltip-style"
                  data-tooltip-content="Battery Percentage"
                >
                  <FaBatteryFull className="text-lg 2xl:text-xl" />
                  <div className="font-medium">
                    {dataFromApp.length > 0 && dataFromApp[0].DeviceBattery}%
                  </div>
                </div>
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
                className="absolute bottom-1 left-1 hover:scale-110 duration-200"
                onClick={handleViewCards}
              >
                <button className="bg-gradient-to-tr from-green-600 via-green-500 to-green-400 text-xs 2xl:text-base text-white font-medium rounded-md px-1 py-0.5">
                  {viewAllCards === true ? "View Less -" : "View All +"}
                </button>
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
            className={`xl:h-[45%] grid grid-cols-2 md:grid-cols-5 text-blue-700 ${
              viewAllCards && "md:grid-cols-8"
            } gap-1 overflow-auto`}
            style={{ scrollbarWidth: "none" }}
          >
            <div
              className={`py-1 px-2 text-sm 2xl:text-lg flex items-center justify-center gap-1 rounded-md  ${
                (dataFromApp.length > 0 && dataFromApp[0].S1) === "N/A"
                  ? "border border-gray-500 text-gray-500"
                  : dataFromApp.length > 0 &&
                    dataFromApp[0].S1 >= alertLimitFromLS
                  ? "card-indicator"
                  : "text-blue-700 border border-blue-800"
              }`}
            >
              <BsThermometerSun className="text-2xl 2xl:text-5xl" />
              <div>
                <div
                  className={`text-center ${
                    viewAllCards && "text-xs 2xl:text-sm"
                  }`}
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
                  ? "border border-gray-500 text-gray-500"
                  : dataFromApp.length > 0 &&
                    dataFromApp[0].S2 >= alertLimitFromLS
                  ? "card-indicator"
                  : "text-blue-700 border border-blue-800"
              }`}
            >
              <BsThermometerSun className="text-2xl 2xl:text-5xl" />
              <div>
                <div
                  className={`text-center ${
                    viewAllCards && "text-xs 2xl:text-sm"
                  }`}
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
                  ? "border border-gray-500 text-gray-500"
                  : dataFromApp.length > 0 &&
                    dataFromApp[0].S3 >= alertLimitFromLS
                  ? "card-indicator"
                  : "text-blue-700 border border-blue-800"
              }`}
            >
              <BsThermometerSun className="text-2xl 2xl:text-5xl" />
              <div>
                <div
                  className={`text-center ${
                    viewAllCards && "text-xs 2xl:text-sm"
                  }`}
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
                  ? "border border-gray-500 text-gray-500"
                  : dataFromApp.length > 0 &&
                    dataFromApp[0].S4 >= alertLimitFromLS
                  ? "card-indicator"
                  : "text-blue-700 border border-blue-800"
              }`}
            >
              <BsThermometerSun className="text-2xl 2xl:text-5xl" />
              <div>
                <div
                  className={`text-center ${
                    viewAllCards && "text-xs 2xl:text-sm"
                  }`}
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
                  ? "border border-gray-500 text-gray-500"
                  : dataFromApp.length > 0 &&
                    dataFromApp[0].S5 >= alertLimitFromLS
                  ? "card-indicator"
                  : "text-blue-700 border border-blue-800"
              }`}
            >
              <BsThermometerSun className="text-2xl 2xl:text-5xl" />
              <div>
                <div
                  className={`text-center ${
                    viewAllCards && "text-xs 2xl:text-sm"
                  }`}
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
                  ? "border border-gray-500 text-gray-500"
                  : dataFromApp.length > 0 &&
                    dataFromApp[0].S6 >= alertLimitFromLS
                  ? "card-indicator"
                  : "text-blue-700 border border-blue-800"
              }`}
            >
              <BsThermometerSun className="text-2xl 2xl:text-5xl" />
              <div>
                <div
                  className={`text-center ${
                    viewAllCards && "text-xs 2xl:text-sm"
                  }`}
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
                  ? "border border-gray-500 text-gray-500"
                  : dataFromApp.length > 0 &&
                    dataFromApp[0].S7 >= alertLimitFromLS
                  ? "card-indicator"
                  : "text-blue-700 border border-blue-800"
              }`}
            >
              <BsThermometerSun className="text-2xl 2xl:text-5xl" />
              <div>
                <div
                  className={`text-center ${
                    viewAllCards && "text-xs 2xl:text-sm"
                  }`}
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
                  ? "border border-gray-500 text-gray-500"
                  : dataFromApp.length > 0 &&
                    dataFromApp[0].S8 >= alertLimitFromLS
                  ? "card-indicator"
                  : "text-blue-700 border border-blue-800"
              }`}
            >
              <BsThermometerSun className="text-2xl 2xl:text-5xl" />
              <div>
                <div
                  className={`text-center ${
                    viewAllCards && "text-xs 2xl:text-sm"
                  }`}
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
                  ? "border border-gray-500 text-gray-500"
                  : dataFromApp.length > 0 &&
                    dataFromApp[0].S9 >= alertLimitFromLS
                  ? "card-indicator"
                  : "text-blue-700 border border-blue-800"
              }`}
            >
              <BsThermometerSun className="text-2xl 2xl:text-5xl" />
              <div>
                <div
                  className={`text-center ${
                    viewAllCards && "text-xs 2xl:text-sm"
                  }`}
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
                  ? "border border-gray-500 text-gray-500"
                  : dataFromApp.length > 0 &&
                    dataFromApp[0].S10 >= alertLimitFromLS
                  ? "card-indicator"
                  : "text-blue-700 border border-blue-800"
              }`}
            >
              <BsThermometerSun className="text-2xl 2xl:text-5xl" />
              <div>
                <div
                  className={`text-center ${
                    viewAllCards && "text-xs 2xl:text-sm"
                  }`}
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
                      ? "border border-gray-500 text-gray-500"
                      : dataFromApp.length > 0 &&
                        dataFromApp[0].S11 >= alertLimitFromLS
                      ? "card-indicator"
                      : "text-blue-700 border border-blue-800"
                  }`}
                >
                  <BsThermometerSun className="text-2xl 2xl:text-5xl" />
                  <div>
                    <div
                      className={`text-center ${
                        viewAllCards && "text-xs 2xl:text-sm"
                      }`}
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
                      ? "border border-gray-500 text-gray-500"
                      : dataFromApp.length > 0 &&
                        dataFromApp[0].S12 >= alertLimitFromLS
                      ? "card-indicator"
                      : "text-blue-700 border border-blue-800"
                  }`}
                >
                  <BsThermometerSun className="text-2xl 2xl:text-5xl" />
                  <div>
                    <div
                      className={`text-center ${
                        viewAllCards && "text-xs 2xl:text-sm"
                      }`}
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
                      ? "border border-gray-500 text-gray-500"
                      : dataFromApp.length > 0 &&
                        dataFromApp[0].S13 >= alertLimitFromLS
                      ? "card-indicator"
                      : "text-blue-700 border border-blue-800"
                  }`}
                >
                  <BsThermometerSun className="text-2xl 2xl:text-5xl" />
                  <div>
                    <div
                      className={`text-center ${
                        viewAllCards && "text-xs 2xl:text-sm"
                      }`}
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
                      ? "border border-gray-500 text-gray-500"
                      : dataFromApp.length > 0 &&
                        dataFromApp[0].S14 >= alertLimitFromLS
                      ? "card-indicator"
                      : "text-blue-700 border border-blue-800"
                  }`}
                >
                  <BsThermometerSun className="text-2xl 2xl:text-5xl" />
                  <div>
                    <div
                      className={`text-center ${
                        viewAllCards && "text-xs 2xl:text-sm"
                      }`}
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
                      ? "border border-gray-500 text-gray-500"
                      : dataFromApp.length > 0 &&
                        dataFromApp[0].S15 >= alertLimitFromLS
                      ? "card-indicator"
                      : "text-blue-700 border border-blue-800"
                  }`}
                >
                  <BsThermometerSun className="text-2xl 2xl:text-5xl" />
                  <div>
                    <div
                      className={`text-center ${
                        viewAllCards && "text-xs 2xl:text-sm"
                      }`}
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
          className="h-[300px] xl:h-auto rounded-xl w-full xl:w-[30%] flex flex-col"
          style={{
            backgroundImage:
              "radial-gradient(circle, #dbf2ff, #d6ebf9, #d1e4f3, #ccdced, #c8d5e7, #c2cfe3, #bdcadf, #afbfdb, #a9bbd9, #a1b4d6, #98b0d4, #90aad1)",
          }}
        >
          <div className="flex justify-center gap-2 rounded-t-md items-center py-1 px-2 font-bold">
            <div className="text-red-500 2xl:text-xl">Alerts</div>
          </div>
          <div
            className="relative flex flex-col flex-1 text-gray-800 px-2 overflow-auto rounded-b-md"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#D1D5DB transparent",
            }}
          >
            <div className="flex w-full justify-between items-center sticky  top-0 mb-2 xl:mb-4 py-1">
              <div
                className={`text-sm 2xl:text-base font-bold px-2 rounded-md border-2  bg-white flex items-center gap-1 shadow-md ${
                  alertsArray.length > 0
                    ? "text-red-500 border-red-500"
                    : "text-green-500 border-green-500"
                }`}
              >
                {alertsArray.length}&nbsp;Alerts
                <FaBell className="2xl:text-lg" />
              </div>
            </div>

            {alertsArray.length > 0 ? (
              alertsArray.map(({ key, value }) => (
                <div className="rounded-md text-white bg-gradient-to-tr from-red-700 via-red-500 to-red-400 p-1 flex justify-around items-center mb-2">
                  <div>{key}</div>
                  <div>-</div>
                  <div className="font-medium">{value} °C</div>
                  <div>-</div>
                  <div>
                    {dataFromApp.length > 0 &&
                      new Date(dataFromApp[0].createdAt).toLocaleString(
                        "en-GB"
                      )}
                  </div>
                </div>
              ))
            ) : (
              <div className="absolute inset-0 flex justify-center items-center text-gray-700 text-sm ">
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
            className="flex flex-row items-center md:flex-col justify-evenly rounded-md h-[25%] p-1"
            style={{
              backgroundImage:
                "radial-gradient(circle, #dbf2ff, #d6ebf9, #d1e4f3, #ccdced, #c8d5e7, #c2cfe3, #bdcadf, #afbfdb, #a9bbd9, #a1b4d6, #98b0d4, #90aad1)",
            }}
          >
            <div className="flex items-center gap-2 font-medium text-green-600 2xl:text-xl">
              <MdOutlineUpdate className="text-2xl 2xl:text-3xl" />
              <div>Last Updated Data: </div>
            </div>
            <div className="text-center text-sm 2xl:text-xl">
              {dataFromApp.length > 0 &&
                new Date(dataFromApp[0].createdAt).toLocaleString("en-GB")}
            </div>
          </div>

          {/* settings */}
          <form
            className=" rounded-md flex flex-col justify-evenly gap-4 md:gap-0 h-[75%] p-1"
            style={{
              backgroundImage:
                "radial-gradient(circle, #dbf2ff, #d6ebf9, #d1e4f3, #ccdced, #c8d5e7, #c2cfe3, #bdcadf, #afbfdb, #a9bbd9, #a1b4d6, #98b0d4, #90aad1)",
            }}
            onSubmit={handleAlertLimit}
          >
            <div className="flex items-center justify-center text-red-500">
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
              className="bg-gradient-to-tr from-green-700 via-green-500 to-green-400 hover:scale-[1.03] duration-200 text-white p-1 px-2 rounded-md"
            >
              Set
            </button>
          </form>
        </div>

        {/* line chart card */}
        <div
          className=" overflow-hidden p-2 w-full md:w-[80%] md:h-[300px] xl:h-auto rounded-md flex flex-col-reverse gap-2 md:gap-0 md:flex-row"
          style={{
            backgroundImage:
              "radial-gradient(circle, #dbf2ff, #d6ebf9, #d1e4f3, #ccdced, #c8d5e7, #c2cfe3, #bdcadf, #afbfdb, #a9bbd9, #a1b4d6, #98b0d4, #90aad1)",
          }}
        >
          <div className="grid grid-cols-8 md:grid-cols-2 gap-2 text-xs px-2">
            {parameters.length > 0 &&
              parameters.map((key) => (
                <div
                  key={key}
                  className="flex items-center gap-1 w-10 cursor-pointer"
                  onClick={() => handleLineSelection(key)}
                >
                  <div
                    className={`h-2 w-2 rounded-full border border-white ${
                      selectedSensors.includes(key)
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  />
                  {key}
                </div>
              ))}
          </div>

          <div className="w-full">
            <ApexCharts
              options={lineData.options}
              series={lineData.series}
              type="line"
              height="100%"
            />
          </div>
          <div className="flex flex-row flex-wrap md:flex-col justify-center gap-0 md:gap-2 text-sm 2xl:text-base">
            <div className="mr-2 text-center font-medium">Data&nbsp;Limit</div>
            <div className="flex items-center gap-1">
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

            <div className="flex items-center gap-1">
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

            <div className="flex items-center gap-1">
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

            <div className="flex items-center gap-1">
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
