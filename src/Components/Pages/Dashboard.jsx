import React from "react";
import axios from "axios";
import { useMemo, useState, useEffect } from "react";
import potline from "../Assets/potline.png";
import loadingGif from "../Assets/loading.gif";
import { FaBell, FaBatteryFull } from "react-icons/fa";
import { FaMobileScreenButton } from "react-icons/fa6";
import { TiArrowRightThick, TiArrowLeftThick } from "react-icons/ti";
import {
  MdOutlineUpdate,
  MdSignalCellular1Bar,
  MdSignalCellular2Bar,
  MdSignalCellular3Bar,
  MdSignalCellular4Bar,
} from "react-icons/md";
import { BsThermometerSun, BsDatabaseFillCheck } from "react-icons/bs";
import { IoWarningSharp } from "react-icons/io5";
import {
  GiBattery25,
  GiBattery50,
  GiBattery75,
  GiBattery100,
} from "react-icons/gi";
import ApexCharts from "react-apexcharts";
import Navbar from "./Navbar";
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

const Dashboard = ({
  dataFromApp,
  thresholdGraphData,
  thresholdGraphDateRange,
  processIsRunning,
}) => {
  console.log("threshold graph data", thresholdGraphData);
  // console.log("threshold graph date range", thresholdGraphDateRange);
  // console.log('process is running', processIsRunning);

  // console.log("data", dataFromApp);
  // console.log("processStatus", processStatus);
  // console.log("processTime", processTime);

  // const [settingsPopup, setSettingsPopup] = useState(false);
  const [activeStatus, setActiveStatus] = useState("");
  // const [actualXAxisData, setActualXAxisData] = useState([]);
  // const [actualSeriesData1, setActualSeriesData1] = useState([]);
  // const [settingsPassword, setSettingsPassword] = useState("");
  const [previousProcessDataOpen, setPreviousProcessDataOpen] = useState(false);
  const [previousProcessDataLoading, setPreviousProcessDataLoading] =
    useState(false);
  const [previousProcessData, setPreviousProcessData] = useState([]);
  const [clickedLegends, setClickedLegends] = useState(["T1"]);

  const upperThresholdData = Array.from(
    { length: 732 },
    (_, i) => (i * 900) / 731
  );
  const lowerThresholdData = Array.from(
    { length: 732 },
    (_, i) => (i * 400) / 731
  );

  // console.log('upper threshold data', upperThresholdData);

  // console.log("clicked legends", clickedLegends);
  // console.log("threshold graph date  range", thresholdGraphDateRange);

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
  // const [hindalcoAlertLimit, setHindalcoAlertLimit] = useState("");

  // const handleAlertLimit = (e) => {
  //   e.preventDefault();
  //   if (settingsPassword === "xyma.in") {
  //     localStorage.setItem("HindalcoAlertLimit", hindalcoAlertLimit.toString());
  //     setHindalcoAlertLimit("");
  //     setSettingsPassword("");
  //   } else {
  //     alert("Incorrect Password");
  //   }
  // };

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

  const alertsArray = [];

  if (thresholdGraphData.length > 0) {
    const latestData = thresholdGraphData[0];
    const time = thresholdGraphData[0].Time;
    const index = thresholdGraphData.length - 1;

    Object.entries(latestData)
      .filter(([key]) => key !== "Time" && key !== "_id")
      .forEach(([key, value]) => {
        const sensorValue = parseFloat(value);
        const upperThresholdValue = upperThresholdData[index];
        const lowerThresholdValue = lowerThresholdData[index];

        const alertIndex = alertsArray.findIndex((alert) => alert[key]);

        if (
          sensorValue > upperThresholdValue ||
          sensorValue < lowerThresholdValue
        ) {
          if (alertIndex === -1) {
            alertsArray.push({ [key]: sensorValue, Time: time });
          } else {
            alertsArray[alertIndex].push({ [key]: sensorValue, Time: time });
          }
        } else {
          if (alertIndex !== -1) {
            alertsArray.splice(alertIndex, 1);
          }
        }
      });
  }

  const alertKeys = alertsArray.map((alert) => Object.keys(alert)[0]);

  // console.log("threshold graph data", thresholdGraphData);

  // console.log("alerts array", alertsArray);
  console.log("alert keys", alertKeys);
  // const alertKeys = [];

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

  // console.log("upperThresholdData ", upperThresholdData);
  // console.log("second Line Data", secondLineData);

  const allLabels = Array.from({ length: 732 }, (_, i) => Math.floor(i / 12) + 1);

  // Only display the unique section labels and leave the rest as empty strings
  const displayLabels = allLabels.map((label, index) => (index % 12 === 0 ? label.toString() : ''));

  // console.log('display labels', displayLabels);

  const initialData = {
    labels: displayLabels,
    datasets: [
      {
        label: "Upper Threshold",
        data: upperThresholdData,
        borderColor: "red",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        fill: false,
        tooltip: { enabled: false }, // Disable tooltip
      },
      {
        label: "Lower Threshold",
        data: lowerThresholdData,
        borderColor: "red",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        fill: false,
        tooltip: { enabled: false }, // Disable tooltip
      },
    ],
  };

  const sensorColors = [
    "rgb(35, 67, 155)",
    "rgb(240,5,5)",
    "rgb(40, 167, 69)",
    "rgb(255, 193, 7)",
    "rgb(153, 50, 204)",
    "rgb(163, 106, 2)",
    "rgb(241, 110, 250)",
    "rgb(0, 255, 127)",
    "rgb(148, 72, 148)",
    "rgb(240, 128, 128)",
    "rgb(255, 20, 147)",
    "rgb(0, 191, 255)",
    "rgb(75, 0, 130)",
    "rgb(255, 99, 71)",
    "rgb(255, 222, 173)",
  ];

  const [lineData2, setLineData2] = useState(initialData);

  useEffect(() => {
    if (thresholdGraphData && thresholdGraphData.length > 0) {
      const reversedData = [...thresholdGraphData].reverse();

      const sensorData = Array.from({ length: 15 }, (_, i) =>
        reversedData.map((item) => item[`T${i + 1}`])
      );

      const datasets = clickedLegends.map((legendLabel, index) => {
        const sensorIndex = parseInt(legendLabel.replace("T", "")) - 1;
        return {
          label: legendLabel,
          data: sensorData[sensorIndex],
          borderColor: sensorColors[sensorIndex],
          borderWidth: 1.25,
          pointRadius: 0,
          pointHoverRadius: 0,
          fill: false,
        };
      });

      setLineData2((prevData) => ({
        ...prevData,
        datasets: [prevData.datasets[0], prevData.datasets[1], ...datasets],
      }));
    }
  }, [thresholdGraphData, clickedLegends]);

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
        max: 732, // x-axis range
        ticks: {
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

      const sensorData = Array.from({ length: 15 }, (_, i) =>
        reversedData.map((item) => item[`T${i + 1}`])
      );

      const datasets = clickedLegends.map((legendLabel, index) => {
        const sensorIndex = parseInt(legendLabel.replace("T", "")) - 1;
        return {
          label: legendLabel,
          data: sensorData[sensorIndex],
          borderColor: sensorColors[sensorIndex],
          borderWidth: 1.25,
          pointRadius: 0,
          pointHoverRadius: 0,
          fill: false,
        };
      });

      setLineData3((prevData) => ({
        ...prevData,
        datasets: [prevData.datasets[0], prevData.datasets[1], ...datasets],
      }));
    }
  }, [previousProcessData, clickedLegends]);

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
      const sensorData = Array.from({ length: 15 }, (_, i) =>
        reversedData.map((item) => item[`T${i + 1}`])
      );

      const sensorLabels = Array.from({ length: 15 }, (_, i) => `T${i + 1}`);

      setLineData({
        labels: lineLabels,
        datasets: sensorData.map((data, i) => ({
          label: sensorLabels[i],
          data,
          borderColor: sensorColors[i],
          backgroundColor: `${sensorColors[i]
            .replace("rgb", "rgba")
            .replace(")", ", 0.2)")}`,
          pointRadius: 0,
          pointHoverRadius: 0,
          borderWidth: 1.25,
          hidden: !clickedLegends.includes(sensorLabels[i]),
        })),
      });
    }
  }, [dataFromApp, viewAllCards, clickedLegends]);

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
          onClick: (e, legendItem) => {
            const index = legendItem.datasetIndex;
            const datasetLabel = legendItem.text;

            setClickedLegends((prevClickedLegends) => {
              if (prevClickedLegends.includes(datasetLabel)) {
                return prevClickedLegends.filter(
                  (label) => label !== datasetLabel
                );
              } else {
                return [...prevClickedLegends, datasetLabel];
              }
            });
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
      await axios.post("https://hindalco.xyma.live/backend/updateHindalcoProcess", {
        processStatus,
      });
    } catch (error) {
      console.error("Error updating hindalco process", error);
    }
  };

  const getProcessDateRangeData = async (selectedDateRange) => {
    try {
      setPreviousProcessDataLoading(true);
      if (selectedDateRange !== '') {
        const split = selectedDateRange.split("to");
        const startDate = split[0];
        const stopDate = split[1];

        const response = await axios.get(
          "https://hindalco.xyma.live/backend/getHindalcoReport",
          {
            params: {
              projectName: "XY001",
              startDate: startDate,
              stopDate: stopDate,
            },
          }
        );
        setPreviousProcessDataLoading(false);
        if (response.data.success) {
          setPreviousProcessData(response.data.data);
        } else {
          console.log("Error fetching previous process data");
        }
      }
    } catch (error) {
      console.error("Error getting date range data", error);
    }
  };

  // console.log("previous process data", previousProcessData);

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
                (dataFromApp.length > 0 && dataFromApp[0].T1) === "N/A"
                  ? "border border-gray-400 text-gray-500 bg-[#f5ffff]"
                  : alertKeys.length > 0 &&
                    alertKeys.includes('T1')
                  ? "card-indicator"
                  : "text-[#23439b] bg-[#f5ffff] border border-gray-400"
              }`}
            >
              <BsThermometerSun className={`${viewAllCards ? 'text-xl 2xl:text-3xl' : 'text-3xl 2xl:text-4xl'}`} />
              <div>
                <div
                  className={`${
                    alertKeys.length > 0 &&
                    alertKeys.includes('T1')
                      ? "text-white"
                      : "text-black"
                  } text-center ${viewAllCards && "text-xs 2xl:text-sm"}`}
                >
                  T1
                </div>
                <div className={`font-bold ${viewAllCards ? 'text-base 2xl:text-2xl' : 'text-lg 2xl:text-3xl'}`}>
                  {isNaN(
                    parseFloat(dataFromApp.length > 0 && dataFromApp[0].T1)
                  )
                    ? "N/A"
                    : `${parseFloat(
                        dataFromApp.length > 0 && dataFromApp[0].T1
                      ).toFixed(1)}°C`}
                </div>
              </div>
            </div>

            <div
              className={`py-1 px-2 text-sm 2xl:text-lg flex items-center justify-center gap-1 rounded-md  ${
                (dataFromApp.length > 0 && dataFromApp[0].T2) === "N/A"
                  ? "border border-gray-400 text-gray-500 bg-[#f5ffff]"
                  : alertKeys.length > 0 &&
                  alertKeys.includes('T2')
                  ? "card-indicator"
                  : "text-[#23439b] bg-[#f5ffff] border border-gray-400"
              }`}
            >
              <BsThermometerSun className={`${viewAllCards ? 'text-xl 2xl:text-3xl' : 'text-3xl 2xl:text-4xl'}`} />
              <div>
                <div
                  className={`${
                    alertKeys.length > 0 &&
                    alertKeys.includes('T2')
                      ? "text-white"
                      : "text-black"
                  } text-center ${viewAllCards && "text-xs 2xl:text-sm"}`}
                >
                  T2
                </div>
                <div className={`font-bold ${viewAllCards ? 'text-base 2xl:text-2xl' : 'text-lg 2xl:text-3xl'}`}>
                  {isNaN(
                    parseFloat(dataFromApp.length > 0 && dataFromApp[0].T2)
                  )
                    ? "N/A"
                    : `${parseFloat(
                        dataFromApp.length > 0 && dataFromApp[0].T2
                      ).toFixed(1)}°C`}
                </div>
              </div>
            </div>

            <div
              className={`py-1 px-2 text-sm 2xl:text-lg flex items-center justify-center gap-1 rounded-md  ${
                (dataFromApp.length > 0 && dataFromApp[0].T3) === "N/A"
                  ? "border border-gray-400 text-gray-500 bg-[#f5ffff]"
                  : alertKeys.length > 0 &&
                    alertKeys.includes('T3')
                  ? "card-indicator"
                  : "text-[#23439b] bg-[#f5ffff] border border-gray-400"
              }`}
            >
              <BsThermometerSun className={`${viewAllCards ? 'text-xl 2xl:text-3xl' : 'text-3xl 2xl:text-4xl'}`} />
              <div>
                <div
                  className={`${
                    alertKeys.length > 0 &&
                    alertKeys.includes('T3')
                      ? "text-white"
                      : "text-black"
                  } text-center ${viewAllCards && "text-xs 2xl:text-sm"}`}
                >
                  T3
                </div>
                <div className={`font-bold ${viewAllCards ? 'text-base 2xl:text-2xl' : 'text-lg 2xl:text-3xl'}`}>
                  {isNaN(
                    parseFloat(dataFromApp.length > 0 && dataFromApp[0].T3)
                  )
                    ? "N/A"
                    : `${parseFloat(
                        dataFromApp.length > 0 && dataFromApp[0].T3
                      ).toFixed(1)}°C`}
                </div>
              </div>
            </div>

            <div
              className={`py-1 px-2 text-sm 2xl:text-lg flex items-center justify-center gap-1 rounded-md  ${
                (dataFromApp.length > 0 && dataFromApp[0].T4) === "N/A"
                  ? "border border-gray-400 text-gray-500 bg-[#f5ffff]"
                  : alertKeys.length > 0 &&
                  alertKeys.includes('T4')
                  ? "card-indicator"
                  : "text-[#23439b] bg-[#f5ffff] border border-gray-400"
              }`}
            >
              <BsThermometerSun className={`${viewAllCards ? 'text-xl 2xl:text-3xl' : 'text-3xl 2xl:text-4xl'}`} />
              <div>
                <div
                  className={`${
                    alertKeys.length > 0 &&
                    alertKeys.includes('T4')
                      ? "text-white"
                      : "text-black"
                  } text-center ${viewAllCards && "text-xs 2xl:text-sm"}`}
                >
                  T4
                </div>
                <div className={`font-bold ${viewAllCards ? 'text-base 2xl:text-2xl' : 'text-lg 2xl:text-3xl'}`}>
                  {isNaN(
                    parseFloat(dataFromApp.length > 0 && dataFromApp[0].T4)
                  )
                    ? "N/A"
                    : `${parseFloat(
                        dataFromApp.length > 0 && dataFromApp[0].T4
                      ).toFixed(1)}°C`}
                </div>
              </div>
            </div>

            <div
              className={`py-1 px-2 text-sm 2xl:text-lg flex items-center justify-center gap-1 rounded-md  ${
                (dataFromApp.length > 0 && dataFromApp[0].T5) === "N/A"
                  ? "border border-gray-400 text-gray-500 bg-[#f5ffff]"
                  : alertKeys.length > 0 &&
                  alertKeys.includes('T5')
                  ? "card-indicator"
                  : "text-[#23439b] bg-[#f5ffff] border border-gray-400"
              }`}
            >
              <BsThermometerSun className={`${viewAllCards ? 'text-xl 2xl:text-3xl' : 'text-3xl 2xl:text-4xl'}`} />
              <div>
                <div
                  className={`${
                    alertKeys.length > 0 &&
                    alertKeys.includes('T5')
                      ? "text-white"
                      : "text-black"
                  } text-center ${viewAllCards && "text-xs 2xl:text-sm"}`}
                >
                  T5
                </div>
                <div className={`font-bold ${viewAllCards ? 'text-base 2xl:text-2xl' : 'text-lg 2xl:text-3xl'}`}>
                  {isNaN(
                    parseFloat(dataFromApp.length > 0 && dataFromApp[0].T5)
                  )
                    ? "N/A"
                    : `${parseFloat(
                        dataFromApp.length > 0 && dataFromApp[0].T5
                      ).toFixed(1)}°C`}
                </div>
              </div>
            </div>

            <div
              className={`py-1 px-2 text-sm 2xl:text-lg flex items-center justify-center gap-1 rounded-md  ${
                (dataFromApp.length > 0 && dataFromApp[0].T6) === "N/A"
                  ? "border border-gray-400 text-gray-500 bg-[#f5ffff]"
                  : alertKeys.length > 0 &&
                  alertKeys.includes('T6')
                  ? "card-indicator"
                  : "text-[#23439b] bg-[#f5ffff] border border-gray-400"
              }`}
            >
              <BsThermometerSun className={`${viewAllCards ? 'text-xl 2xl:text-3xl' : 'text-3xl 2xl:text-4xl'}`} />
              <div>
                <div
                  className={`${
                    alertKeys.length > 0 &&
                    alertKeys.includes('T6')
                      ? "text-white"
                      : "text-black"
                  } text-center ${viewAllCards && "text-xs 2xl:text-sm"}`}
                >
                  T6
                </div>
                <div className={`font-bold ${viewAllCards ? 'text-base 2xl:text-2xl' : 'text-lg 2xl:text-3xl'}`}>
                  {isNaN(
                    parseFloat(dataFromApp.length > 0 && dataFromApp[0].T6)
                  )
                    ? "N/A"
                    : `${parseFloat(
                        dataFromApp.length > 0 && dataFromApp[0].T6
                      ).toFixed(1)}°C`}
                </div>
              </div>
            </div>

            <div
              className={`py-1 px-2 text-sm 2xl:text-lg flex items-center justify-center gap-1 rounded-md  ${
                (dataFromApp.length > 0 && dataFromApp[0].T7) === "N/A"
                  ? "border border-gray-400 text-gray-500 bg-[#f5ffff]"
                  : alertKeys.length > 0 &&
                  alertKeys.includes('T7')
                  ? "card-indicator"
                  : "text-[#23439b] bg-[#f5ffff] border border-gray-400"
              }`}
            >
              <BsThermometerSun className={`${viewAllCards ? 'text-xl 2xl:text-3xl' : 'text-3xl 2xl:text-4xl'}`} />
              <div>
                <div
                  className={`${
                    alertKeys.length > 0 &&
                    alertKeys.includes('T7')
                      ? "text-white"
                      : "text-black"
                  } text-center ${viewAllCards && "text-xs 2xl:text-sm"}`}
                >
                  T7
                </div>
                <div className={`font-bold ${viewAllCards ? 'text-base 2xl:text-2xl' : 'text-lg 2xl:text-3xl'}`}>
                  {isNaN(
                    parseFloat(dataFromApp.length > 0 && dataFromApp[0].T7)
                  )
                    ? "N/A"
                    : `${parseFloat(
                        dataFromApp.length > 0 && dataFromApp[0].T7
                      ).toFixed(1)}°C`}
                </div>
              </div>
            </div>

            <div
              className={`py-1 px-2 text-sm 2xl:text-lg flex items-center justify-center gap-1 rounded-md  ${
                (dataFromApp.length > 0 && dataFromApp[0].T8) === "N/A"
                  ? "border border-gray-400 text-gray-500 bg-[#f5ffff]"
                  : alertKeys.length > 0 &&
                  alertKeys.includes('T8')
                  ? "card-indicator"
                  : "text-[#23439b] bg-[#f5ffff] border border-gray-400"
              }`}
            >
              <BsThermometerSun className={`${viewAllCards ? 'text-xl 2xl:text-3xl' : 'text-3xl 2xl:text-4xl'}`} />
              <div>
                <div
                  className={`${
                    alertKeys.length > 0 &&
                    alertKeys.includes('T8')
                      ? "text-white"
                      : "text-black"
                  } text-center ${viewAllCards && "text-xs 2xl:text-sm"}`}
                >
                  T8
                </div>
                <div className={`font-bold ${viewAllCards ? 'text-base 2xl:text-2xl' : 'text-lg 2xl:text-3xl'}`}>
                  {isNaN(
                    parseFloat(dataFromApp.length > 0 && dataFromApp[0].T8)
                  )
                    ? "N/A"
                    : `${parseFloat(
                        dataFromApp.length > 0 && dataFromApp[0].T8
                      ).toFixed(1)}°C`}
                </div>
              </div>
            </div>

            <div
              className={`py-1 px-2 text-sm 2xl:text-lg flex items-center justify-center gap-1 rounded-md  ${
                (dataFromApp.length > 0 && dataFromApp[0].T9) === "N/A"
                  ? "border border-gray-400 text-gray-500 bg-[#f5ffff]"
                  : alertKeys.length > 0 &&
                  alertKeys.includes('T9')
                  ? "card-indicator"
                  : "text-[#23439b] bg-[#f5ffff] border border-gray-400"
              }`}
            >
              <BsThermometerSun className={`${viewAllCards ? 'text-xl 2xl:text-3xl' : 'text-3xl 2xl:text-4xl'}`} />
              <div>
                <div
                  className={`${
                    alertKeys.length > 0 &&
                    alertKeys.includes('T9')
                      ? "text-white"
                      : "text-black"
                  } text-center ${viewAllCards && "text-xs 2xl:text-sm"}`}
                >
                  T9
                </div>
                <div className={`font-bold ${viewAllCards ? 'text-base 2xl:text-2xl' : 'text-lg 2xl:text-3xl'}`}>
                  {isNaN(
                    parseFloat(dataFromApp.length > 0 && dataFromApp[0].T9)
                  )
                    ? "N/A"
                    : `${parseFloat(
                        dataFromApp.length > 0 && dataFromApp[0].T9
                      ).toFixed(1)}°C`}
                </div>
              </div>
            </div>

            <div
              className={`py-1 px-2 text-sm 2xl:text-lg flex items-center justify-center gap-1 rounded-md  ${
                (dataFromApp.length > 0 && dataFromApp[0].T10) === "N/A"
                  ? "border border-gray-400 text-gray-500 bg-[#f5ffff]"
                  : alertKeys.length > 0 &&
                  alertKeys.includes('T10')
                  ? "card-indicator"
                  : "text-[#23439b] bg-[#f5ffff] border border-gray-400"
              }`}
            >
              <BsThermometerSun className={`${viewAllCards ? 'text-xl 2xl:text-3xl' : 'text-3xl 2xl:text-4xl'}`} />
              <div>
                <div
                  className={`${
                    alertKeys.length > 0 &&
                    alertKeys.includes('T10')
                      ? "text-white"
                      : "text-black"
                  } text-center ${viewAllCards && "text-xs 2xl:text-sm"}`}
                >
                  T10
                </div>
                <div className={`font-bold ${viewAllCards ? 'text-base 2xl:text-2xl' : 'text-lg 2xl:text-3xl'}`}>
                  {isNaN(
                    parseFloat(dataFromApp.length > 0 && dataFromApp[0].T10)
                  )
                    ? "N/A"
                    : `${parseFloat(
                        dataFromApp.length > 0 && dataFromApp[0].T10
                      ).toFixed(1)}°C`}
                </div>
              </div>
            </div>

            {/* extra 5 cards */}
            {viewAllCards && (
              <>
                <div
                  className={`py-1 px-2 text-sm 2xl:text-lg flex items-center justify-center gap-1 rounded-md  ${
                    (dataFromApp.length > 0 && dataFromApp[0].T11) === "N/A"
                      ? "border border-gray-400 text-gray-500 bg-[#f5ffff]"
                      : alertKeys.length > 0 &&
                      alertKeys.includes('T11')
                      ? "card-indicator"
                      : "text-[#23439b] bg-[#f5ffff] border border-gray-400"
                  }`}
                >
                  <BsThermometerSun className={`${viewAllCards ? 'text-xl 2xl:text-3xl' : 'text-3xl 2xl:text-4xl'}`} />
                  <div>
                    <div
                      className={`${
                        alertKeys.length > 0 &&
                    alertKeys.includes('T11')
                          ? "text-white"
                          : "text-black"
                      } text-center ${viewAllCards && "text-xs 2xl:text-sm"}`}
                    >
                      T11
                    </div>
                    <div className={`font-bold ${viewAllCards ? 'text-base 2xl:text-2xl' : 'text-lg 2xl:text-3xl'}`}>
                      {isNaN(
                        parseFloat(dataFromApp.length > 0 && dataFromApp[0].T11)
                      )
                        ? "N/A"
                        : `${parseFloat(
                            dataFromApp.length > 0 && dataFromApp[0].T11
                          ).toFixed(1)}°C`}
                    </div>
                  </div>
                </div>

                <div
                  className={`py-1 px-2 text-sm 2xl:text-lg flex items-center justify-center gap-1 rounded-md  ${
                    (dataFromApp.length > 0 && dataFromApp[0].T12) === "N/A"
                      ? "border border-gray-400 text-gray-500 bg-[#f5ffff]"
                      : alertKeys.length > 0 &&
                      alertKeys.includes('T12')
                      ? "card-indicator"
                      : "text-[#23439b] bg-[#f5ffff] border border-gray-400"
                  }`}
                >
                  <BsThermometerSun className={`${viewAllCards ? 'text-xl 2xl:text-3xl' : 'text-3xl 2xl:text-4xl'}`} />
                  <div>
                    <div
                      className={`${
                        alertKeys.length > 0 &&
                    alertKeys.includes('T12')
                          ? "text-white"
                          : "text-black"
                      } text-center ${viewAllCards && "text-xs 2xl:text-sm"}`}
                    >
                      T12
                    </div>
                    <div className={`font-bold ${viewAllCards ? 'text-base 2xl:text-2xl' : 'text-lg 2xl:text-3xl'}`}>
                      {isNaN(
                        parseFloat(dataFromApp.length > 0 && dataFromApp[0].T12)
                      )
                        ? "N/A"
                        : `${parseFloat(
                            dataFromApp.length > 0 && dataFromApp[0].T12
                          ).toFixed(1)}°C`}
                    </div>
                  </div>
                </div>

                <div
                  className={`py-1 px-2 text-sm 2xl:text-lg flex items-center justify-center gap-1 rounded-md  ${
                    (dataFromApp.length > 0 && dataFromApp[0].T13) === "N/A"
                      ? "border border-gray-400 text-gray-500 bg-[#f5ffff]"
                      : alertKeys.length > 0 &&
                      alertKeys.includes('T13')
                      ? "card-indicator"
                      : "text-[#23439b] bg-[#f5ffff] border border-gray-400"
                  }`}
                >
                  <BsThermometerSun className={`${viewAllCards ? 'text-xl 2xl:text-3xl' : 'text-3xl 2xl:text-4xl'}`} />
                  <div>
                    <div
                      className={`${
                        alertKeys.length > 0 &&
                    alertKeys.includes('T13')
                          ? "text-white"
                          : "text-black"
                      } text-center ${viewAllCards && "text-xs 2xl:text-sm"}`}
                    >
                      T13
                    </div>
                    <div className={`font-bold ${viewAllCards ? 'text-base 2xl:text-2xl' : 'text-lg 2xl:text-3xl'}`}>
                      {isNaN(
                        parseFloat(dataFromApp.length > 0 && dataFromApp[0].T13)
                      )
                        ? "N/A"
                        : `${parseFloat(
                            dataFromApp.length > 0 && dataFromApp[0].T13
                          ).toFixed(1)}°C`}
                    </div>
                  </div>
                </div>

                <div
                  className={`py-1 px-2 text-sm 2xl:text-lg flex items-center justify-center gap-1 rounded-md  ${
                    (dataFromApp.length > 0 && dataFromApp[0].T14) === "N/A"
                      ? "border border-gray-400 text-gray-500 bg-[#f5ffff]"
                      : alertKeys.length > 0 &&
                      alertKeys.includes('T14')
                      ? "card-indicator"
                      : "text-[#23439b] bg-[#f5ffff] border border-gray-400"
                  }`}
                >
                  <BsThermometerSun className={`${viewAllCards ? 'text-xl 2xl:text-3xl' : 'text-3xl 2xl:text-4xl'}`} />
                  <div>
                    <div
                      className={`${
                        alertKeys.length > 0 &&
                    alertKeys.includes('T14')
                          ? "text-white"
                          : "text-black"
                      } text-center ${viewAllCards && "text-xs 2xl:text-sm"}`}
                    >
                      T14
                    </div>
                    <div className={`font-bold ${viewAllCards ? 'text-base 2xl:text-2xl' : 'text-lg 2xl:text-3xl'}`}>
                      {isNaN(
                        parseFloat(dataFromApp.length > 0 && dataFromApp[0].T14)
                      )
                        ? "N/A"
                        : `${parseFloat(
                            dataFromApp.length > 0 && dataFromApp[0].T14
                          ).toFixed(1)}°C`}
                    </div>
                  </div>
                </div>

                <div
                  className={`py-1 px-2 text-sm 2xl:text-lg flex items-center justify-center gap-1 rounded-md  ${
                    (dataFromApp.length > 0 && dataFromApp[0].T15) === "N/A"
                      ? "border border-gray-400 text-gray-500 bg-[#f5ffff]"
                      : alertKeys.length > 0 &&
                      alertKeys.includes('T15')
                      ? "card-indicator"
                      : "text-[#23439b] bg-[#f5ffff] border border-gray-400"
                  }`}
                >
                  <BsThermometerSun className={`${viewAllCards ? 'text-xl 2xl:text-3xl' : 'text-3xl 2xl:text-4xl'}`} />
                  <div>
                    <div
                      className={`${
                        alertKeys.length > 0 &&
                    alertKeys.includes('T15')
                          ? "text-white"
                          : "text-black"
                      } text-center ${viewAllCards && "text-xs 2xl:text-sm"}`}
                    >
                      T15
                    </div>
                    <div className={`font-bold ${viewAllCards ? 'text-base 2xl:text-2xl' : 'text-lg 2xl:text-3xl'}`}>
                      {isNaN(
                        parseFloat(dataFromApp.length > 0 && dataFromApp[0].T15)
                      )
                        ? "N/A"
                        : `${parseFloat(
                            dataFromApp.length > 0 && dataFromApp[0].T15
                          ).toFixed(1)}°C`}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* threshold chart */}
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
        </div>
      </div>

      {/* main content 2 h-[40%] */}
      <div className="h-[40%] rounded-xl flex flex-col-reverse md:flex-row gap-2 ">
        {/* alert box */}
        <div className="relative w-full md:w-[25%] flex flex-col gap-2 h-[300px] xl:h-full rounded-xl p-1 bg-[#dde3f1] overflow-auto">
          <div className=" relative flex justify-center gap-2 items-center py-1 px-2 font-bold text-[#23439b] ">
            <div className="2xl:text-xl">Alerts</div>
            {/* <div
              className="text-xl absolute top-1/2 right-2 transform -translate-y-1/2 cursor-pointer hover:scale-125 duration-200 z-10"
              // onClick={() => setSettingsPopup(!settingsPopup)}
            >
              {settingsPopup === true ? (
                <RiCloseCircleLine className="text-2xl" />
              ) : (
                <IoMdSettings
                  data-tooltip-id="tooltip-style"
                  data-tooltip-content="Alert Limit Settings"
                />
              )}
            </div> */}
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
              alertsArray.map((alert, index) => {
                const key = Object.keys(alert)[0];
                const value = alert[key];

                return (
                  <div
                    key={index}
                    className="rounded-md text-white bg-gradient-to-tr from-red-700 via-red-500 to-red-400 p-1 flex flex-wrap justify-around items-center mb-2 text-sm 2xl:text-base"
                  >
                    <div>{key}</div>
                    <div>-</div>
                    <div className="font-medium">{value}&nbsp;°C</div>
                    <div>-</div>
                    <div>{alert.Time}</div>
                  </div>
                );
              })
            ) : (
              <div className="absolute inset-0 flex justify-center items-center text-sm ">
                No new Alerts
              </div>
            )}
          </div>

          {/* settings popup */}
          {/* {settingsPopup && (
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
          )} */}
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
