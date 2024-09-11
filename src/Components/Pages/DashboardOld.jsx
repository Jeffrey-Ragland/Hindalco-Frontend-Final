import React from 'react';
import { useRef, useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import xymaLogoWhite from "../Assets/xymaLogoWhite.png";
import hindalcoLogo from "../Assets/hindalcoLogo.png";
import { ImExit } from "react-icons/im";
import {
  MdSystemSecurityUpdateWarning,
  MdOutlineUpdate,
} from "react-icons/md";
import {
  BsThermometerSun,
  BsClipboard2DataFill,
  BsDatabaseFillCheck,
} from "react-icons/bs";
import { FaBell } from "react-icons/fa";
import { LiaRulerVerticalSolid } from "react-icons/lia";
import { IoTrashOutline } from "react-icons/io5";
import { TbTrendingUp } from "react-icons/tb";
import ApexCharts from "react-apexcharts";

const DashboardOld = ({ dataFromApp }) => {

  // console.log("data from app", dataFromApp);
  const legendRef = useRef(null);
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
            colors: "#FFFFFF",
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            fontSize: "6px",
            colors: "#FFFFFF",
          },
        },
      },
      grid: {
        borderColor: "#4d4d4d",
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "30%",
          endingShape: "rounded",
          colors: {
            ranges: [],
          },
          dataLabels: {
            position: "top",
          },
        },
      },
      dataLabels: {
        enabled: true,
        offsetY: -10,
        style: {
          colors: ["#FFFFFF"],
          fontSize: "8px",
        },
        // formatter: (val) => `${val}°C`,
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
            fontSize: "6px",
            colors: "#FFFFFF",
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            fontSize: "6px",
            colors: "#FFFFFF",
          },
        },
      },
      legend: {
        position: "right",
        labels: {
          colors: "#FFFFFF",
          fontSize: "8px", 
        },
      },
      stroke: {
        curve: "straight",
        width: 1.5,
      },
      grid: {
        borderColor: "#4d4d4d",
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

  const chartRef = useRef({ min: null, max: null });

  // chart data assignment
  useEffect(() => {
    if(dataFromApp.length > 0) {
      
      const barCategories = [];
      const barSeries = [];

      Object.keys(dataFromApp[0]).forEach(key => {
        if(key !== 'createdAt' && key!== '_id') {
          barCategories.push(key);
          barSeries.push(parseFloat(dataFromApp[0][key]));
        };
      });

      // highlight max value bar
      const colorRange = barSeries.map((value) => ({
        from: value,
        to: value,
        color: value === Math.max(...barSeries) ? "#FF0000" : "#00E396",
      }));

      const lineCategories = dataFromApp.map(item => new Date(item.createdAt).toLocaleString("en-GB"));
      const lineSeries = [
        {
          name: "S1",
          data: dataFromApp.map((item) => item.S1),
        },
        {
          name: "S2",
          data: dataFromApp.map((item) => item.S2),
        },
        {
          name: "S3",
          data: dataFromApp.map((item) => item.S3),
        },
        {
          name: "S4",
          data: dataFromApp.map((item) => item.S4),
        },
        {
          name: "S5",
          data: dataFromApp.map((item) => item.S5),
        },
        {
          name: "S6",
          data: dataFromApp.map((item) => item.S6),
        },
        {
          name: "S7",
          data: dataFromApp.map((item) => item.S7),
        },
        {
          name: "S8",
          data: dataFromApp.map((item) => item.S8),
        },
        {
          name: "S9",
          data: dataFromApp.map((item) => item.S9),
        },
        {
          name: "S10",
          data: dataFromApp.map((item) => item.S10),
        },
        {
          name: "S11",
          data: dataFromApp.map((item) => item.S11),
        },
        {
          name: "S12",
          data: dataFromApp.map((item) => item.S12),
        },
        {
          name: "S13",
          data: dataFromApp.map((item) => item.S13),
        },
        {
          name: "S14",
          data: dataFromApp.map((item) => item.S14),
        },
        {
          name: "S15",
          data: dataFromApp.map((item) => item.S15),
        },
      ];

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
          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: "30%",
              endingShape: "rounded",
              colors: {
                ranges: colorRange,
              },
            },
          },
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
            min: chartRef.current.min !== null ? chartRef.current.min : undefined,
            max: chartRef.current.max !== null ? chartRef.current.max : undefined,
          },
        },
      });

    };
  }, [dataFromApp]);

  return (
    <div className="xl:h-screen px-4 py-2 text-white 2xl:text-2xl flex flex-col">
      {/* top bar - h-[10%] */}
      <div className="flex justify-between items-center mb-4 xl:mb-2 2xl:mb-4 xl:h-[10%]">
        {/* xyma logo */}
        <div>
          <img
            src={xymaLogoWhite}
            alt="xymaLogo"
            className="max-h-8 md:max-h-12 2xl:max-h-14"
          />
        </div>
        {/* title */}
        <div className="text-xs md:text-2xl font-medium text-center">
          Temperature Measurement
        </div>
        {/* hindalco logo , logout */}
        <div className="flex gap-4 items-center">
          <div>
            <img
              src={hindalcoLogo}
              alt="hindalcoLogo"
              className="h-10 md:h-14 2xl:h-16"
            />
          </div>
          <Link to="/login">
            <button
              className="logout-button"
              onClick={() => localStorage.clear()}
            >
              <div className="logout-logo ">
                <ImExit className="text-xl 2xl:text-[22px]" />
              </div>
              <div className="logout-text text-lg">Logout</div>
            </button>
          </Link>
        </div>
      </div>

      {/* main content 1 - h-[45%] */}
      <div className="xl:h-[45%] flex flex-col-reverse xl:flex-row gap-2 2xl:gap-4">
        {/* 12 cards */}
        <div className="w-full xl:w-[60%] grid grid-cols-2 md:grid-cols-4 gap-6 md:mt-4 xl:mt-0">
          <div className="square-btn  py-1 px-2 text-sm 2xl:text-lg flex items-center justify-center gap-1">
            <BsThermometerSun className="text-4xl 2xl:text-5xl" />
            <div>
              <div className="text-center">Sensor 1</div>
              <div className="text-2xl 2xl:text-4xl">
                {dataFromApp.length > 0 && dataFromApp[0].S1}°C
              </div>
            </div>
            <div className="absolute right-1 bottom-1 2xl:right-2 2xl:bottom-2 bg-gradient-to-tr from-blue-900 via-blue-700 to-blue-400 rounded-sm hover:scale-110 duration-200 cursor-pointer">
              <TbTrendingUp className="text-xl 2xl:text-3xl" />
            </div>
          </div>

          <div className="square-btn  py-1 px-2 text-sm 2xl:text-lg flex items-center justify-center gap-1">
            <BsThermometerSun className="text-4xl 2xl:text-5xl" />
            <div>
              <div className="text-center">Sensor 2</div>
              <div className="text-2xl 2xl:text-4xl">
                {dataFromApp.length > 0 && dataFromApp[0].S2}°C
              </div>
            </div>
            <div className="absolute right-1 bottom-1 2xl:right-2 2xl:bottom-2 bg-gradient-to-tr from-blue-900 via-blue-700 to-blue-400 rounded-sm hover:scale-110 duration-200 cursor-pointer">
              <TbTrendingUp className="text-xl 2xl:text-3xl" />
            </div>
          </div>

          <div className="square-btn  py-1 px-2 text-sm 2xl:text-lg flex items-center justify-center gap-1">
            <BsThermometerSun className="text-4xl 2xl:text-5xl" />
            <div>
              <div className="text-center">Sensor 3</div>
              <div className="text-2xl 2xl:text-4xl">
                {dataFromApp.length > 0 && dataFromApp[0].S3}°C
              </div>
            </div>
            <div className="absolute right-1 bottom-1 2xl:right-2 2xl:bottom-2 bg-gradient-to-tr from-blue-900 via-blue-700 to-blue-400 rounded-sm hover:scale-110 duration-200 cursor-pointer">
              <TbTrendingUp className="text-xl 2xl:text-3xl" />
            </div>
          </div>

          <div className="square-btn  py-1 px-2 text-sm 2xl:text-lg flex items-center justify-center gap-1">
            <BsThermometerSun className="text-4xl 2xl:text-5xl" />
            <div>
              <div className="text-center">Sensor 4</div>
              <div className="text-2xl 2xl:text-4xl">
                {dataFromApp.length > 0 && dataFromApp[0].S4}°C
              </div>
            </div>
            <div className="absolute right-1 bottom-1 2xl:right-2 2xl:bottom-2 bg-gradient-to-tr from-blue-900 via-blue-700 to-blue-400 rounded-sm hover:scale-110 duration-200 cursor-pointer">
              <TbTrendingUp className="text-xl 2xl:text-3xl" />
            </div>
          </div>

          <div className="square-btn  py-1 px-2 text-sm 2xl:text-lg flex items-center justify-center gap-1">
            <BsThermometerSun className="text-4xl 2xl:text-5xl" />
            <div>
              <div className="text-center">Sensor 5</div>
              <div className="text-2xl 2xl:text-4xl">
                {dataFromApp.length > 0 && dataFromApp[0].S5}°C
              </div>
            </div>
            <div className="absolute right-1 bottom-1 2xl:right-2 2xl:bottom-2 bg-gradient-to-tr from-blue-900 via-blue-700 to-blue-400 rounded-sm hover:scale-110 duration-200 cursor-pointer">
              <TbTrendingUp className="text-xl 2xl:text-3xl" />
            </div>
          </div>

          <div className="square-btn  py-1 px-2 text-sm 2xl:text-lg flex items-center justify-center gap-1">
            <BsThermometerSun className="text-4xl 2xl:text-5xl" />
            <div>
              <div className="text-center">Sensor 6</div>
              <div className="text-2xl 2xl:text-4xl">
                {dataFromApp.length > 0 && dataFromApp[0].S6}°C
              </div>
            </div>
            <div className="absolute right-1 bottom-1 2xl:right-2 2xl:bottom-2 bg-gradient-to-tr from-blue-900 via-blue-700 to-blue-400 rounded-sm hover:scale-110 duration-200 cursor-pointer">
              <TbTrendingUp className="text-xl 2xl:text-3xl" />
            </div>
          </div>

          <div className="square-btn  py-1 px-2 text-sm 2xl:text-lg flex items-center justify-center gap-1">
            <BsThermometerSun className="text-4xl 2xl:text-5xl" />
            <div>
              <div className="text-center">Sensor 7</div>
              <div className="text-2xl 2xl:text-4xl">
                {dataFromApp.length > 0 && dataFromApp[0].S7}°C
              </div>
            </div>
            <div className="absolute right-1 bottom-1 2xl:right-2 2xl:bottom-2 bg-gradient-to-tr from-blue-900 via-blue-700 to-blue-400 rounded-sm hover:scale-110 duration-200 cursor-pointer">
              <TbTrendingUp className="text-xl 2xl:text-3xl" />
            </div>
          </div>

          <div className="square-btn  py-1 px-2 text-sm 2xl:text-lg flex items-center justify-center gap-1">
            <BsThermometerSun className="text-4xl 2xl:text-5xl" />
            <div>
              <div className="text-center">Sensor 8</div>
              <div className="text-2xl 2xl:text-4xl">
                {dataFromApp.length > 0 && dataFromApp[0].S8}°C
              </div>
            </div>
            <div className="absolute right-1 bottom-1 2xl:right-2 2xl:bottom-2 bg-gradient-to-tr from-blue-900 via-blue-700 to-blue-400 rounded-sm hover:scale-110 duration-200 cursor-pointer">
              <TbTrendingUp className="text-xl 2xl:text-3xl" />
            </div>
          </div>

          <div className="square-btn  py-1 px-2 text-sm 2xl:text-lg flex items-center justify-center gap-1">
            <BsThermometerSun className="text-4xl 2xl:text-5xl" />
            <div>
              <div className="text-center">Sensor 9</div>
              <div className="text-2xl 2xl:text-4xl">
                {dataFromApp.length > 0 && dataFromApp[0].S9}°C
              </div>
            </div>
            <div className="absolute right-1 bottom-1 2xl:right-2 2xl:bottom-2 bg-gradient-to-tr from-blue-900 via-blue-700 to-blue-400 rounded-sm hover:scale-110 duration-200 cursor-pointer">
              <TbTrendingUp className="text-xl 2xl:text-3xl" />
            </div>
          </div>

          <div className="square-btn  py-1 px-2 text-sm 2xl:text-lg flex items-center justify-center gap-1">
            <BsThermometerSun className="text-4xl 2xl:text-5xl" />
            <div>
              <div className="text-center">Sensor 10</div>
              <div className="text-2xl 2xl:text-4xl">
                {dataFromApp.length > 0 && dataFromApp[0].S10}°C
              </div>
            </div>
            <div className="absolute right-1 bottom-1 2xl:right-2 2xl:bottom-2 bg-gradient-to-tr from-blue-900 via-blue-700 to-blue-400 rounded-sm hover:scale-110 duration-200 cursor-pointer">
              <TbTrendingUp className="text-xl 2xl:text-3xl" />
            </div>
          </div>

          <div className="square-btn  py-1 px-2 text-sm 2xl:text-lg flex items-center justify-center gap-1">
            <BsThermometerSun className="text-4xl 2xl:text-5xl" />
            <div>
              <div className="text-center">Sensor 11</div>
              <div className="text-2xl 2xl:text-4xl">
                {dataFromApp.length > 0 && dataFromApp[0].S11}°C
              </div>
            </div>
            <div className="absolute right-1 bottom-1 2xl:right-2 2xl:bottom-2 bg-gradient-to-tr from-blue-900 via-blue-700 to-blue-400 rounded-sm hover:scale-110 duration-200 cursor-pointer">
              <TbTrendingUp className="text-xl 2xl:text-3xl" />
            </div>
          </div>

          <div className="square-btn  py-1 px-2 text-sm 2xl:text-lg flex items-center justify-center gap-1">
            <BsThermometerSun className="text-4xl 2xl:text-5xl" />
            <div>
              <div className="text-center">Sensor 12</div>
              <div className="text-2xl 2xl:text-4xl">
                {dataFromApp.length > 0 && dataFromApp[0].S12}°C
              </div>
            </div>
            <div className="absolute right-1 bottom-1 2xl:right-2 2xl:bottom-2 bg-gradient-to-tr from-blue-900 via-blue-700 to-blue-400 rounded-sm hover:scale-110 duration-200 cursor-pointer">
              <TbTrendingUp className="text-xl 2xl:text-3xl" />
            </div>
          </div>
        </div>

        <div className="w-full xl:w-[40%] flex flex-col md:flex-row gap-4 xl:gap-2">
          {/* alert box */}
          <div className="w-full md:w-[60%] h-[300px] xl:h-auto flex flex-col rounded-md ml-0 xl:ml-2">
            <div className="flex justify-between rounded-t-md items-center bg-gradient-to-r from-[#000000] via-[#34343b] to-[#4b4a54] py-1 px-2">
              <div>Alerts</div>
              <FaBell className="text-xl" />
            </div>
            <div
              className=" bg-gradient-to-r from-gray-300 via-gray-100 to-white flex flex-col flex-1 text-gray-800 px-2 overflow-auto rounded-b-md"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#D1D5DB transparent",
              }}
            >
              <div className="flex w-full justify-between items-center sticky bg-gradient-to-r from-gray-300 via-gray-100 to-white top-0 mb-2 xl:mb-4 py-1">
                <div className="text-sm 2xl:text-base font-bold px-2 rounded-sm border-[1.5px] border-red-500 text-red-500">
                  25&nbsp;Alerts
                </div>
                <div>
                  <IoTrashOutline className="text-red-500 text-2xl 2xl:text-3xl hover:scale-110 duration-200 cursor-pointer" />
                </div>
              </div>

              <div className="rounded-md bg-gradient-to-tr from-red-700 via-red-600 to-red-400 p-1 flex justify-around items-center text-white mb-2">
                <div>Sensor 1</div>
                <div>-</div>
                <div className="font-medium">98 °C</div>
                <div>-</div>
                <div className="text-sm">02:55 pm</div>
              </div>

              <div className="rounded-md bg-gradient-to-tr from-red-700 via-red-600 to-red-400 p-1 flex justify-around items-center text-white mb-2">
                <div>Sensor 5</div>
                <div>-</div>
                <div className="font-medium">108 °C</div>
                <div>-</div>
                <div className="text-sm">02:43 pm</div>
              </div>

              <div className="rounded-md bg-gradient-to-tr from-red-700 via-red-600 to-red-400 p-1 flex justify-around items-center text-white mb-2">
                <div>Sensor 15</div>
                <div>-</div>
                <div className="font-medium">110 °C</div>
                <div>-</div>
                <div className="text-sm">01:32 pm</div>
              </div>

              <div className="rounded-md bg-gradient-to-tr from-red-700 via-red-600 to-red-400 p-1 flex justify-around items-center text-white mb-2">
                <div>Sensor 15</div>
                <div>-</div>
                <div className="font-medium">110 °C</div>
                <div>-</div>
                <div className="text-sm">01:32 pm</div>
              </div>

              <div className="rounded-md bg-gradient-to-tr from-red-700 via-red-600 to-red-400 p-1 flex justify-around items-center text-white mb-2">
                <div>Sensor 15</div>
                <div>-</div>
                <div className="font-medium">110 °C</div>
                <div>-</div>
                <div className="text-sm">01:32 pm</div>
              </div>

              <div className="rounded-md bg-gradient-to-tr from-red-700 via-red-600 to-red-400 p-1 flex justify-around items-center text-white mb-2">
                <div>Sensor 15</div>
                <div>-</div>
                <div className="font-medium">110 °C</div>
                <div>-</div>
                <div className="text-sm">01:32 pm</div>
              </div>

              <div className="rounded-md bg-gradient-to-tr from-red-700 via-red-600 to-red-400 p-1 flex justify-around items-center text-white mb-2">
                <div>Sensor 15</div>
                <div>-</div>
                <div className="font-medium">110 °C</div>
                <div>-</div>
                <div className="text-sm">01:32 pm</div>
              </div>

              <div className="rounded-md bg-gradient-to-tr from-red-700 via-red-600 to-red-400 p-1 flex justify-around items-center text-white mb-2">
                <div>Sensor 15</div>
                <div>-</div>
                <div className="font-medium">110 °C</div>
                <div>-</div>
                <div className="text-sm">01:32 pm</div>
              </div>

              <div className="rounded-md bg-gradient-to-tr from-red-700 via-red-600 to-red-400 p-1 flex justify-around items-center text-white mb-2">
                <div>Sensor 15</div>
                <div>-</div>
                <div className="font-medium">110 °C</div>
                <div>-</div>
                <div className="text-sm">01:32 pm</div>
              </div>

              <div className="rounded-md bg-gradient-to-tr from-red-700 via-red-600 to-red-400 p-1 flex justify-around items-center text-white mb-2">
                <div>Sensor 15</div>
                <div>-</div>
                <div className="font-medium">110 °C</div>
                <div>-</div>
                <div className="text-sm">01:32 pm</div>
              </div>
            </div>
          </div>
          <div className="w-full md:w-[40%] flex flex-col gap-2">
            <div className="md:h-[15%] flex gap-2">
              {/* reports */}
              <div className="w-[80%] flex gap-1 justify-center md:justify-around items-center px-2 bg-gradient-to-tr from-green-600 via-green-500 to-green-400 rounded-md hover:scale-105 cursor-pointer duration-200 font-medium">
                <BsClipboard2DataFill className="text-xl 2xl:text-3xl" />
                <div>Report&nbsp;Analysis</div>
              </div>

              {/* activity status */}
              <div className="w-[20%] flex justify-center items-center">
                <div className="h-9 w-9 2xl:h-12 2xl:w-12 flex justify-center items-center rounded-full bg-red-500">
                  <MdSystemSecurityUpdateWarning className="text-2xl 2xl:text-3xl" />
                </div>
              </div>
            </div>

            {/* last update */}
            <div className="md:h-[25%] bg-gradient-to-tr from-gray-200 via-gray-100 to-white flex flex-row items-center md:flex-col justify-evenly rounded-md text-gray-600 p-1 mb-4 md:mb-0">
              <div className="flex items-center gap-2 font-medium">
                <MdOutlineUpdate className="text-2xl 2xl:text-3xl" />
                <div>Last Updated Data: </div>
              </div>
              <div className="text-center text-sm 2xl:text-xl">
                {dataFromApp.length > 0 && new Date(dataFromApp[0].createdAt).toLocaleString("en-GB")}
              </div>
            </div>

            {/* settings */}
            <form
              className="bg-gradient-to-tr from-gray-200 via-gray-100 to-white h-[200px] md:h-[60%] rounded-md text-gray-600 py-1 px-4 md:px-2 flex flex-col justify-evenly mb-4 md:mb-0"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="flex items-center justify-center text-red-500">
                <LiaRulerVerticalSolid className="text-2xl 2xl:text-3xl" />
                <div className="font-medium">Alert&nbsp;limit</div>
              </div>
              <div className="flex items-center gap-2 text-sm 2xl:text-xl">
                <div>Current&nbsp;Limit</div>
                <div className="border border-black py-0.5 px-1 w-full text-sm 2xl:text-base font-medium rounded-sm text-center bg-white">
                  75 °C
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm 2xl:text-xl">
                <div>Change&nbsp;Limit</div>
                <input
                  type="text"
                  required
                  className="border border-black py-0.5 px-1 w-full text-sm 2xl:text-base font-medium rounded-sm focus:outline-none bg-white"
                />
              </div>
              <button
                type="submit"
                className="bg-gradient-to-tr from-green-600 via-green-500 to-green-400 hover:scale-[1.03] duration-200 text-white p-1 px-2 rounded-md"
              >
                Set
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* main content 2 - h-[45%] */}
      <div className="xl:h-[45%] flex flex-col xl:flex-row gap-2 md:gap-0">
        {/* left side */}
        <div className="w-full xl:w-[45%] flex flex-col gap-4 xl:gap-2 2xl:gap-4 mt-6">
          {/* 3 cards */}
          <div className="xl:h-1/3 grid grid-cols-2 md:grid-cols-4 xl:grid-cols-3 gap-6 mr-0 md:mr-2 ">
            <div className="square-btn  py-1 px-2 text-sm 2xl:text-lg flex items-center justify-center gap-1">
              <BsThermometerSun className="text-4xl 2xl:text-5xl" />
              <div>
                <div className="text-center">Sensor 13</div>
                <div className="text-2xl 2xl:text-4xl">
                  {dataFromApp.length > 0 && dataFromApp[0].S13}°C
                </div>
              </div>
              <div className="absolute right-1 bottom-1 2xl:right-2 2xl:bottom-2 bg-gradient-to-tr from-blue-900 via-blue-700 to-blue-400 rounded-sm hover:scale-110 duration-200 cursor-pointer">
                <TbTrendingUp className="text-xl 2xl:text-3xl" />
              </div>
            </div>

            <div className="square-btn  py-1 px-2 text-sm 2xl:text-lg flex items-center justify-center gap-1">
              <BsThermometerSun className="text-4xl 2xl:text-5xl" />
              <div>
                <div className="text-center">Sensor 14</div>
                <div className="text-2xl 2xl:text-4xl">
                  {dataFromApp.length > 0 && dataFromApp[0].S14}°C
                </div>
              </div>
              <div className="absolute right-1 bottom-1 2xl:right-2 2xl:bottom-2 bg-gradient-to-tr from-blue-900 via-blue-700 to-blue-400 rounded-sm hover:scale-110 duration-200 cursor-pointer">
                <TbTrendingUp className="text-xl 2xl:text-3xl" />
              </div>
            </div>

            <div className="square-btn  py-1 px-2 text-sm 2xl:text-lg flex items-center justify-center gap-1">
              <BsThermometerSun className="text-4xl 2xl:text-5xl" />
              <div>
                <div className="text-center">Sensor 15</div>
                <div className="text-2xl 2xl:text-4xl">
                  {dataFromApp.length > 0 && dataFromApp[0].S15}°C
                </div>
              </div>
              <div className="absolute right-1 bottom-1 2xl:right-2 2xl:bottom-2 bg-gradient-to-tr from-blue-900 via-blue-700 to-blue-400 rounded-sm hover:scale-110 duration-200 cursor-pointer">
                <TbTrendingUp className="text-xl 2xl:text-3xl" />
              </div>
            </div>
          </div>

          <div className="xl:h-2/3 flex flex-col-reverse md:flex-row gap-4 xl:gap-2 2xl:gap-4 ">
            {/* table */}
            <div
              className="w-full md:w-1/2 h-[300px] xl:h-auto overflow-auto text-center border border-white mt-2"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#858585 transparent",
              }}
            >
              <table className="w-full">
                <thead className="sticky top-0 text-white text-sm bg-gradient-to-t from-[#000000] via-[#34343b] to-[#4b4a54] border border-b-white border-l-transparent border-r-transparent border-t-transparent">
                  <tr>
                    <th className="px-4">S.No</th>
                    <th className="px-4">S1</th>
                    <th className="px-4">S2</th>
                    <th className="px-4">S3</th>
                    <th className="px-4">S4</th>
                    <th className="px-4">S5</th>
                    <th className="px-4">S6</th>
                    <th className="px-4">S7</th>
                    <th className="px-4">S8</th>
                    <th className="px-4">S9</th>
                    <th className="px-4">S10</th>
                    <th className="px-4">S11</th>
                    <th className="px-4">S12</th>
                    <th className="px-4">S13</th>
                    <th className="px-4">S14</th>
                    <th className="px-4">S15</th>
                    <th className="px-4">Last&nbsp;Updated</th>
                  </tr>
                </thead>

                <tbody className="text-[10px] 2xl:text-base ">
                  {dataFromApp.length > 0 &&
                    dataFromApp.map((data, index) => (
                      <tr
                        key={index}
                        // className={`${
                        //   index % 2 === 0
                        //     ? ""
                        //     : "bg-gradient-to-r from-[#96b5e3] via-[#afc7f0] to-[#bcd5f7]"
                        // }`}
                      >
                        <td>{index + 1}</td>
                        <td>{data.S1}°C</td>
                        <td>{data.S2}°C</td>
                        <td>{data.S3}°C</td>
                        <td>{data.S4}°C</td>
                        <td>{data.S5}°C</td>
                        <td>{data.S6}°C</td>
                        <td>{data.S7}°C</td>
                        <td>{data.S8}°C</td>
                        <td>{data.S9}°C</td>
                        <td>{data.S10}°C</td>
                        <td>{data.S11}°C</td>
                        <td>{data.S12}°C</td>
                        <td>{data.S13}°C</td>
                        <td>{data.S14}°C</td>
                        <td>{data.S15}°C</td>
                        <td>
                          {new Date(data.createdAt).toLocaleString("en-GB")}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            {/* bar */}
            <div className="border border-white w-full md:w-1/2 overflow-hidden p-1 mt-2 mr-2 h-[300px] xl:h-auto">
              <ApexCharts
                options={barData.options}
                series={barData.series}
                type="bar"
                height="100%"
              />
            </div>
          </div>
        </div>
        {/* right side */}
        <div className="border border-white w-full xl:w-[55%] mt-4 ml-0 xl:ml-2 2xl:mt-4 2xl:ml-4 overflow-hidden p-1 h-[300px] xl:h-auto flex flex-col">
          <div className="flex justify-between">
            <button className="border border-white ">Expand</button>
            <div
              className={`flex items-center px-2 py-1 font-medium 
              }`}
            >
              <div className="mr-2 font-normal">Set Data Limit:</div>
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
                100 Data
              </label>
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
                300 Data
              </label>
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
                500 Data
              </label>
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
                1000 Data
              </label>
            </div>
          </div>
          <div className="flex-1">
            <ApexCharts
              options={lineData.options}
              series={lineData.series}
              type="line"
              height="100%"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOld;
