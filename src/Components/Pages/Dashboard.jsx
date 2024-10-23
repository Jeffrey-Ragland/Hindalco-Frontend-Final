import React from "react";
import axios from "axios";
import { useMemo, useState, useEffect } from "react";
import potline from "../Assets/potline.png";
import loadingGif from "../Assets/loading.gif";
import { FaBell, FaBatteryFull } from "react-icons/fa";
import { FaMobileScreenButton } from "react-icons/fa6";
import { LuRadioTower } from "react-icons/lu";
import { TiArrowRightThick, TiArrowLeftThick } from "react-icons/ti";
import { MdOutlineUpdate, MdSystemSecurityUpdateWarning, MdSignalCellular1Bar, MdSignalCellular2Bar, MdSignalCellular3Bar, MdSignalCellular4Bar } from "react-icons/md";
import { BsThermometerSun, BsDatabaseFillCheck } from "react-icons/bs";
import { LiaRulerVerticalSolid } from "react-icons/lia";
import { IoWarningSharp } from "react-icons/io5";
import { IoMdSettings } from "react-icons/io";
import { RiCloseCircleLine } from "react-icons/ri";
import { GiBattery25, GiBattery50, GiBattery75, GiBattery100 } from "react-icons/gi";
import ApexCharts from "react-apexcharts";
import Navbar from "./Navbar";
import "react-tooltip/dist/react-tooltip.css";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { LineChart } from "@mui/x-charts";
import { ChartsReferenceLine } from "@mui/x-charts/ChartsReferenceLine";
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

const Dashboard = ({ dataFromApp, thresholdGraphData, thresholdGraphDateRange, processIsRunning }) => {

  // console.log("threshold graph data", thresholdGraphData);
  // console.log("threshold graph date range", thresholdGraphDateRange);
  // console.log('process is running', processIsRunning);
  
  // console.log("data", dataFromApp);
  // console.log("processStatus", processStatus);
  // console.log("processTime", processTime);
  

  const [settingsPopup, setSettingsPopup] = useState(false);
  // const [actualXAxisData, setActualXAxisData] = useState([]);
  // const [actualSeriesData1, setActualSeriesData1] = useState([]);
  const [settingsPassword, setSettingsPassword] = useState("");
  const [previousProcessDataOpen, setPreviousProcessDataOpen] = useState(false); 
  const [previousProcessDataLoading, setPreviousProcessDataLoading] = useState(false);
  const [previousProcessData, setPreviousProcessData] = useState([]);
 
  // const [selectedDateRange, setSelectedDateRange] = useState('');
  // const [thresholdGraphData, setThresholdGraphData] = useState([]);

  // console.log('selected date range', selectedDateRange);

  // setThresholdGraphData([...thresholdGraphData, dataFromApp[0]]);

  // useEffect(() => {
  //   if(Array.isArray(dataFromApp) && dataFromApp.length > 0) {
  //     setThresholdGraphData((prevData) => [...prevData, dataFromApp[0]]);
  //   }
  // }, [dataFromApp])

  // console.log('threshold graph data', thresholdGraphData);

  // const minThreshold = 40;
  // const maxThreshold = 75;
  // const thresholds = [minThreshold, maxThreshold];
  // const colors = ["red", "green", "red"];

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
    if (settingsPassword === "xyma.in") {
      localStorage.setItem("HindalcoAlertLimit", hindalcoAlertLimit.toString());
      setHindalcoAlertLimit("");
      setSettingsPassword("");
    } else {
      alert("Incorrect Password");
    }
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
  const [barData, setBarData] = useState(() => {
    const screenWidth = window.innerWidth;
    const axisFontSize = screenWidth < 1536 ? "6px" : "8px";

    return {
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
              fontSize: axisFontSize,
              colors: "#4a5568",
            },
          },
        },
        yaxis: {
          labels: {
            style: {
              fontSize: axisFontSize,
              colors: "#4a5568",
            },
          },
        },
        grid: {
          show: true,
          borderColor: "#9CA3AF",
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
    };
  });

  const [lineData, setLineData] = useState({
    labels: [],
    datasets: [],
  });

  const firstLineData = Array.from({ length: 52 }, (_, i) => (i * 1800) / 51);
  const secondLineData = Array.from({ length: 52 }, (_, i) => (i * 450) / 51);
  // console.log("First Line Data", firstLineData);

  const [activeStatus, setActiveStatus] = useState("");
  // console.log('active status', activeStatus);

  // const lineData2 = {
  //   labels: Array.from({ length: 52 }, (_, i) => i), // x-axis from 0 to 51
  //   datasets: [
  //     {
  //       label: "Line 1",
  //       data: firstLineData, // Straight line 1
  //       borderColor: "red",
  //       borderWidth: 2,
  //       pointRadius: 0,
  //       pointHoverRadius: 0,
  //       fill: false,
  //       tooltip: {
  //         enabled: false,
  //       },
  //     },
  //     {
  //       label: "Line 2",
  //       data: secondLineData, // Straight line 2
  //       borderColor: "red",
  //       borderWidth: 2,
  //       pointRadius: 0,
  //       pointHoverRadius: 0,
  //       fill: false,
  //       tooltip: {
  //         enabled: false,
  //       },
  //     },
  //   ],
  // };

  const initialData = {
    labels: Array.from({ length: 52 }, (_, i) => i), // x-axis from 0 to 51
    datasets: [
      {
        label: "Line 1",
        data: Array.from({ length: 52 }, (_, i) => (i * 1800) / 51), // Line 1
        borderColor: "red",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        fill: false,
        tooltip: { enabled: false }, // Disable tooltip
      },
      {
        label: "Line 2",
        data: Array.from({ length: 52 }, (_, i) => (i * 400) / 51), // Line 2
        borderColor: "red",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        fill: false,
        tooltip: { enabled: false }, // Disable tooltip
      },
    ],
  };

  const [lineData2, setLineData2] = useState(initialData);

  useEffect(() => {
    if (thresholdGraphData && thresholdGraphData.length > 0) {

      const reversedData = [...thresholdGraphData].reverse();

      const graphData = reversedData.map((item) => item.S1)
      
      setLineData2((prevData) => ({
        ...prevData,
        datasets: [
          prevData.datasets[0],
          prevData.datasets[1],
          {
            label: "Line 3 (Random Data)",
            data: graphData,
            borderColor: "green",
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 0,
            fill: false,
          },
        ],
      }));
    }
  }, [thresholdGraphData]);

  // Configuration options
  const lineOptions2 = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    plugins: {
      legend: {
        display: false, // This disables the legend
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        min: 0,
        max: 51, // x-axis range
        ticks: {
          stepSize: 5,
          font: {
            size: 8,
          },
        },
      },
      y: {
        min: 0,
        max: 900, // y-axis range
        ticks: {
          stepSize: 100,
          font: {
            size: 8,
          },
        },
      },
    },
  };

  const [lineData3, setLineData3] = useState(initialData);

  useEffect(() => {
    if (previousProcessData && previousProcessData.length > 0) {
      const reversedData = [...previousProcessData].reverse();

      const graphData = reversedData.map((item) => item.S1);

      setLineData3((prevData) => ({
        ...prevData,
        datasets: [
          prevData.datasets[0],
          prevData.datasets[1],
          {
            label: "Line 3",
            data: graphData,
            borderColor: "green",
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 0,
            fill: false,
          },
        ],
      }));
    }
  }, [previousProcessData]);

  // chart data assignment
  useEffect(() => {
    if (Array.isArray(dataFromApp) && dataFromApp.length > 0) {
      const barCategories = [];
      const barSeries = [];
      const barColors = [];

      // min max line chart
      // const dataPoints = Object.values(dataFromApp);
      // const first10DataPoints = dataPoints.slice(0, 10).reverse();
      // const xAxisData = first10DataPoints.map((point) => {
      //   const timePart = point.Time.split(",");
      //   return timePart[1];
      // });
      // const seriesData1 = first10DataPoints.map((point) =>
      //   point.S1 !== "N/A" ? Number(point.S1) : null
      // );
      // setActualXAxisData(xAxisData);
      // setActualSeriesData1(seriesData1);

      // for activity status
      const currentDate = new Date();
      const lastDataEntry = dataFromApp[0];

      if (lastDataEntry && lastDataEntry.Time) {
        const lastDataTime = new Date(lastDataEntry.Time.replace(",", "T"));
        const timeDifference = currentDate.getTime() - lastDataTime.getTime();
        const differenceInMinutes = timeDifference / (1000 * 60);

        if (differenceInMinutes < 5) {
          setActiveStatus("Active");
        } else {
          setActiveStatus("Inactive");
        }
      }

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
            if (
              dataFromApp[0][key] === "N/A" ||
              isNaN(parseFloat(dataFromApp[0][key]))
            ) {
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
            if (
              dataFromApp[0][key] === "N/A" ||
              isNaN(parseFloat(dataFromApp[0][key]))
            ) {
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
            borderColor: "rgb(35, 67, 155)", // Vibrant Red
            backgroundColor: "rgba(35, 67, 155, 0.2)",
            pointRadius: 0,
            pointHoverRadius: 0,
            borderWidth: 1.25,
          },
          {
            label: "S2",
            data: sensor2Data,
            borderColor: "rgb(240,5,5)", // Bright Blue
            backgroundColor: "rgba(240,5,5, 0.2)",
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

  const lineOptions = useMemo(() => {
    const screenWidth = window.innerWidth;
    const axisFontSize = screenWidth < 1536 ? 6 : 8;

    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
          labels: {
            color: "#4B5563",
            font: {
              size: 10,
            },
            boxWidth: 25,
            padding: 5,
          },
        },
        zoom: {
          pan: {
            enabled: true,
            mode: "x",
          },
          zoom: {
            mode: "x",
            wheel: {
              enabled: true,
            },
            pinch: {
              enabled: true,
            },
          },
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: "#4B5563",
            font: {
              size: axisFontSize,
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
              size: axisFontSize,
            },
          },
        },
      },
    };
  }, []);

  const updateHindalcoProcess = async (processStatus) => {
    try {
      // console.log("process status", processStatus);
      await axios.post("http://localhost:4000/backend/updateHindalcoProcess", {
        processStatus,
      });
    } catch (error) {
      console.error("Error updating hindalco process", error);
    }
  };

  const getProcessDateRangeData = async(selectedDateRange) => {
    try {
      setPreviousProcessDataLoading(true);
      if(selectedDateRange !== "") {
        const split = selectedDateRange.split('to');
        const startDate = split[0];
        const stopDate = split[1];

        const response = await axios.get("http://localhost:4000/backend/getHindalcoReport", {
          params: {
            projectName: 'XY001',
            startDate: startDate,
            stopDate: stopDate
          },
        });
        setPreviousProcessDataLoading(false);
        if(response.data.success) {
          setPreviousProcessData(response.data.data);
        } else {
          console.log('Error fetching previous process data');
        }
      }
    } catch(error) {
      console.error('Error getting date range data', error)
    };
  };

  console.log('previous process data', previousProcessData);

  return (
    <div className="xl:h-screen p-4 flex flex-col gap-2 2x">
      {/* top bar - h-[10%] */}
      <div className="xl:h-[10%]">
        <Navbar />
      </div>

      {/* main content 1 h-[50%] */}
      <div className="xl:h-[50%] flex flex-col xl:flex-row gap-2 ">
        {/* 2d image */}
        <div className="w-full xl:w-[70%] flex flex-col gap-4 md:gap-2 rounded-xl p-2 bg-[#dde3f1]">
          <div className=" flex flex-col md:flex-row gap-4 md:gap-2 xl:h-[55%] text-sm 2xl:text-base">
            <div className="relative w-full md:w-[55%] flex justify-center items-center p-4  ">
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
                  {dataFromApp.length > 0 && (
                    <>
                      {dataFromApp[0].DeviceSignal >= 22.5 && (
                        <MdSignalCellular4Bar className="text-lg 2xl:text-xl" />
                      )}
                      {dataFromApp[0].DeviceSignal >= 15 &&
                        dataFromApp[0].DeviceSignal < 22.5 && (
                          <MdSignalCellular3Bar className="text-lg 2xl:text-xl" />
                        )}
                      {dataFromApp[0].DeviceSignal >= 7.5 &&
                        dataFromApp[0].DeviceSignal < 15 && (
                          <MdSignalCellular2Bar className="text-lg 2xl:text-xl" />
                        )}
                      {dataFromApp[0].DeviceSignal < 7.5 && (
                        <MdSignalCellular1Bar className="text-lg 2xl:text-xl" />
                      )}
                    </>
                  )}
                  {/* <LuRadioTower className="text-lg 2xl:text-xl" /> */}
                  {/* <div className="font-medium text-black">
                    {dataFromApp.length > 0 && dataFromApp[0].DeviceSignal}%
                  </div> */}
                </div>

                {/* battery */}
                <div
                  className="flex items-center gap-0.5 text-[#23439b]"
                  data-tooltip-id="tooltip-style"
                  data-tooltip-content="Battery Percentage"
                >
                  {dataFromApp.length > 0 && (
                    <>
                      {dataFromApp[0].DeviceBattery >= 75 && (
                        <GiBattery100 className="text-lg 2xl:text-xl" />
                      )}
                      {dataFromApp[0].DeviceBattery >= 50 &&
                        dataFromApp[0].DeviceBattery < 75 && (
                          <GiBattery75 className="text-lg 2xl:text-xl" />
                        )}
                      {dataFromApp[0].DeviceBattery >= 25 &&
                        dataFromApp[0].DeviceBattery < 50 && (
                          <GiBattery50 className="text-lg 2xl:text-xl" />
                        )}
                      {dataFromApp[0].DeviceBattery < 25 && (
                        <GiBattery25 className="text-lg 2xl:text-xl" />
                      )}
                    </>
                  )}
                  {/* <div className="font-medium text-black">
                    {dataFromApp.length > 0 && dataFromApp[0].DeviceBattery}%
                  </div> */}
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
              <div className="h-[150px] md:h-auto flex items-center  ">
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
            <div className="relative w-full md:w-[45%] flex flex-col gap-2 p-1  ">
              <ApexCharts
                options={barData.options}
                series={barData.series}
                type="bar"
                height="100%"
              />
              <div className="absolute top-0 right-0 text-xs flex items-center gap-1 font-medium text-[#23439b] 2xl:text-base">
                <div className="flex items-center ">
                  <MdOutlineUpdate className="text-base" />
                  <div>Last Data: </div>
                </div>
                <div className="text-black">
                  {dataFromApp.length > 0 && dataFromApp[0].Time}
                </div>
              </div>
            </div>
          </div>
          {/* cards */}
          <div
            className={`xl:h-[45%] grid grid-cols-2 md:grid-cols-5 ${
              viewAllCards && "md:grid-cols-8"
            } gap-1 `}
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

        {/* min max chart */}
        <div className="relative h-[300px] xl:h-auto rounded-xl w-full xl:w-[30%] bg-[#dde3f1] p-2">
          {!previousProcessDataOpen ? ( //live process data
            <div className="flex flex-col w-full h-full">
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  {processIsRunning && processIsRunning === true ? (
                    <>
                      <button className="bg-gray-300 text-gray-500 text-xs 2xl:text-base font-medium rounded-md px-1 py-0.5 cursor-not-allowed">
                        Start
                      </button>

                      <button
                        className="bg-[#e4ba4c] text-xs 2xl:text-base font-medium rounded-md px-1 py-0.5 hover:scale-110 duration-200"
                        onClick={() => {
                          updateHindalcoProcess("Stop");
                        }}
                      >
                        Stop
                      </button>
                    </>
                  ) : processIsRunning === false ? (
                    <>
                      <button
                        className="bg-[#e4ba4c] text-xs 2xl:text-base font-medium rounded-md px-1 py-0.5 hover:scale-110 duration-200"
                        onClick={() => {
                          updateHindalcoProcess("Start");
                        }}
                      >
                        Start
                      </button>

                      <button className="bg-gray-300 text-gray-500 text-xs 2xl:text-base font-medium rounded-md px-1 py-0.5 cursor-not-allowed">
                        Stop
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="bg-gray-300 text-gray-500 text-xs 2xl:text-base font-medium rounded-md px-1 py-0.5 cursor-not-allowed">
                        Start
                      </button>

                      <button className="bg-gray-300 text-gray-500 text-xs 2xl:text-base font-medium rounded-md px-1 py-0.5 cursor-not-allowed">
                        Stop
                      </button>
                    </>
                  )}

                  {processIsRunning && processIsRunning === true ? (
                    <div className="text-xs 2xl:text-base font-semibold rounded-md px-1 py-0.5 bg-white text-[#23439b] border-[1.5px] border-green-400">
                      Process&nbsp;Running
                    </div>
                  ) : processIsRunning === false ? (
                    <div className="text-xs 2xl:text-base font-semibold rounded-md px-1 py-0.5 bg-white text-[#23439b] border-indicator">
                      Process&nbsp;Expired
                    </div>
                  ) : (
                    <div>
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setPreviousProcessDataOpen(true)}
                  className="flex gap-1 items-center bg-[#23439b] text-white text-xs 2xl:text-base font-medium rounded-md px-1 py-0.5 hover:scale-110 duration-200"
                >
                  Previous&nbsp;Process&nbsp;Data
                  <TiArrowRightThick className="text-lg 2xl:text-xl" />
                </button>
              </div>
              <div className="h-full w-full">
                <Line data={lineData2} options={lineOptions2} width={"100%"} />
              </div>
            </div>
          ) : (
            //previous process data
            <div className="flex flex-col h-full w-full">
              <div className="flex justify-between">
                <button
                  onClick={() => {
                    setPreviousProcessDataOpen(false);
                    setPreviousProcessData([]);
                  }}
                  className="flex gap-1 items-center bg-[#23439b] text-white text-xs 2xl:text-base font-medium rounded-md px-1 py-0.5 hover:scale-110 duration-200"
                >
                  <TiArrowLeftThick className="text-lg 2xl:text-xl" />
                  Live&nbsp;Data
                </button>

                <div className="flex gap-1 text-xs 2xl:text-base font-medium items-center">
                  <select
                    onChange={(e) => getProcessDateRangeData(e.target.value)}
                    className="rounded-md px-1 py-0.5 cursor-pointer"
                  >
                    <option value="">Pick Date Range</option>
                    {thresholdGraphDateRange &&
                      thresholdGraphDateRange.length > 0 &&
                      thresholdGraphDateRange.map((data, i) => (
                        <option
                          key={i}
                          value={`${data.startTime}to${data.stopTime}`}
                        >
                          {data.startTime} to {data.stopTime}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              <div className="h-full w-full">
                <Line data={lineData3} options={lineOptions2} width={"100%"} />
              </div>
            </div>
          )}

          {previousProcessDataLoading && (
            <div className="absolute inset-0 bg-black/70 rounded-xl flex flex-col justify-center items-center font-semibold text-sm">
              <div className="text-white">Retrieving Process Data!</div>
              <img src={loadingGif} className="max-w-[40px]" />
            </div>
          )}

          {/* <div className="text-center text-[#23439b] text-sm font-medium 2xl:text-base">
            Trend for last 10 data
          </div>
          <LineChart
            margin={{
              left: 30,
              right: 20,
              top: 10,
              bottom: 25,
            }}
            xAxis={[
              {
                data: actualXAxisData,
                scaleType: "band",
              },
            ]}
            series={[
              {
                // label: "S1",
                data: actualSeriesData1,
                showMark: false,
              },
              // {
              //   label: "S2",
              //   data: actualSeriesData2,
              //   showMark: false,
              // },
              // {
              //   label: "S3",
              //   data: actualSeriesData3,
              //   showMark: false,
              // },
            ]}
            yAxis={[
              {
                min: 0,
                max: 100,
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
              y={75}
              lineStyle={{ stroke: "red", strokeDasharray: "5 5" }}
            />
          </LineChart> */}
        </div>
      </div>

      {/* main content 2 h-[40%] */}
      <div className="h-[40%] rounded-xl flex flex-col-reverse md:flex-row gap-2 ">
        {/* alert box */}
        <div className="relative w-full md:w-[25%] flex flex-col gap-2 h-[300px] xl:h-full rounded-xl p-1 bg-[#dde3f1] overflow-auto">
          <div className=" relative flex justify-center gap-2 items-center py-1 px-2 font-bold text-[#23439b] ">
            <div className="2xl:text-xl">Alerts</div>
            <div
              className="text-xl absolute top-1/2 right-2 transform -translate-y-1/2 cursor-pointer hover:scale-125 duration-200 z-10"
              onClick={() => setSettingsPopup(!settingsPopup)}
            >
              {settingsPopup === true ? (
                <RiCloseCircleLine className="text-2xl" />
              ) : (
                <IoMdSettings
                  data-tooltip-id="tooltip-style"
                  data-tooltip-content="Alert Limit Settings"
                />
              )}
            </div>
          </div>
          <div
            className="relative flex flex-col flex-1 text-gray-800 px-2 overflow-auto"
            style={{
              scrollbarWidth: "none",
              scrollbarColor: "#D1D5DB transparent",
            }}
          >
            <div className="flex w-full justify-between items-center sticky top-0 mb-2 xl:mb-4 py-1">
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
                <div
                  key={key}
                  className="rounded-md text-white bg-gradient-to-tr from-red-700 via-red-500 to-red-400 p-1 flex flex-wrap justify-around items-center mb-2 text-sm 2xl:text-base"
                >
                  <div>{key}</div>
                  <div>-</div>
                  <div className="font-medium">{value}&nbsp;°C</div>
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
          {/* settings popup */}
          {settingsPopup && (
            <form
              className="absolute inset-0 rounded-md flex flex-col justify-evenly gap-4 md:gap-0 p-2 bg-[#dde3f1]"
              onSubmit={handleAlertLimit}
            >
              <div className="flex items-center justify-center text-[#23439b]">
                <LiaRulerVerticalSolid className="text-2xl 2xl:text-3xl" />
                <div className="font-medium">Alert&nbsp;limit</div>
              </div>
              <div className="flex items-center gap-2 text-sm 2xl:text-xl">
                <div>Current&nbsp;Limit</div>
                <div className="py-0.5 px-1 w-full text-sm 2xl:text-base font-medium rounded-xl text-center border border-b-gray-700 border-t-transparent border-l-transparent border-r-transparent">
                  {parseFloat(
                    localStorage.getItem("HindalcoAlertLimit")
                  ).toFixed(1)}
                  °C
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm 2xl:text-xl">
                <div>Change&nbsp;Limit</div>
                <input
                  type="number"
                  step="0.1"
                  required
                  className="py-0.5 px-1 w-full text-sm 2xl:text-base font-medium rounded-sm focus:outline-none bg-white"
                  value={hindalcoAlertLimit}
                  onChange={(e) =>
                    setHindalcoAlertLimit(parseFloat(e.target.value))
                  }
                />
              </div>
              <div className="flex items-center gap-2 text-sm 2xl:text-xl">
                <div>Fill&nbsp;Password</div>
                <input
                  type="password"
                  required
                  className="py-0.5 px-1 w-full text-sm 2xl:text-base font-medium rounded-sm focus:outline-none bg-white"
                  value={settingsPassword}
                  onChange={(e) => setSettingsPassword(e.target.value)}
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
          )}
        </div>

        {/* line chart card */}
        <div className=" overflow-hidden p-2 w-full md:w-[75%] h-[300px] xl:h-auto rounded-xl flex flex-col-reverse gap-2 md:flex-row bg-[#dde3f1]">
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
};

export default Dashboard;
