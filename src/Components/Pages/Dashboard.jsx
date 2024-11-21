import React from "react";
import axios from "axios";
import { useMemo, useState, useEffect } from "react";
import ThreeDModel from "./ThreeDModel";
import loadingGif from "../Assets/loading.gif";
import { FaBell } from "react-icons/fa";
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
import { PiBatteryWarningBold } from "react-icons/pi";
import { TbAlertTriangle } from "react-icons/tb";
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
  processTimeLeft,
  fixedThermocouples,
  lineNameDB,
  potNumberDB,
}) => {
  // console.log("threshold graph data", thresholdGraphData);
  // console.log("time left", processTimeLeft);
  // console.log("thermocouple configuration:", thermocoupleConfiguration);

  // console.log("data", dataFromApp);
  // console.log("fixed thermocouples", fixedThermocouples);

  const [activeStatus, setActiveStatus] = useState("");
  const [previousProcessDataOpen, setPreviousProcessDataOpen] = useState(false);
  const [previousProcessDataLoading, setPreviousProcessDataLoading] =
    useState(false);
  const [previousProcessData, setPreviousProcessData] = useState([]);
  const [clickedLegends, setClickedLegends] = useState([]);
  const [startPopup, setStartPopup] = useState(false);
  const [stopPopup, setStopPopup] = useState(false);
  const [coords, setCoords] = useState([0, 0]);
  const [meshName, setMeshName] = useState("");
  const [selectedThermocouples, setSelectedThermocouples] = useState([]);
  const [selectedLine, setSelectedLine] = useState("");
  const [potNumber, setPotNumber] = useState("");
  const [batteryPopup, setBatteryPopup] = useState(false);
  const [startConfirmationPopup, setStartConfirmationPopup] = useState(false);

  // console.log("selected thermocouples", selectedThermocouples);
  // console.log("pot number", potNumber);
  // console.log("line name", selectedLine);

  const initialClickedLegends = useMemo(() => {
    return fixedThermocouples.length > 0 ? [fixedThermocouples[0]] : [];
  }, [fixedThermocouples]);

  useEffect(() => {
    if (clickedLegends.length === 0 && initialClickedLegends.length > 0) {
      setClickedLegends(initialClickedLegends);
    }
  }, [clickedLegends, initialClickedLegends]);

  // thermocouple selection
  const thermocouples = Array.from({ length: 15 }, (_, i) => `T${i + 1}`);

  const toggleThermocouple = (name) => {
    setSelectedThermocouples((prevselected) =>
      prevselected.includes(name)
        ? prevselected.filter((item) => item !== name)
        : [...prevselected, name]
    );
  };

  // useEffect(() => {
  //   if (fixedThermocouples.length > 0) {
  //     setClickedLegends([fixedThermocouples[0]]); // Set to the first key
  //   } else {
  //     setClickedLegends([]); // Set to empty array if none selected
  //   }
  // }, [fixedThermocouples]);

  // console.log("selected thermocouples", selectedThermocouples);

  // const getInitialSelectedThermocouples = () => {
  //   const storedThermocouples = localStorage.getItem("selectedThermocouples");
  //   return storedThermocouples ? JSON.parse(storedThermocouples) : [];
  // };

  // const [fixedThermocouples, setFixedThermocouples] = useState(
  //   getInitialSelectedThermocouples
  // );

  // 3d model hover
  const handleCoordsUpdate = (newCoords) => {
    setCoords(newCoords);
  };

  const handleMeshName = (newName) => {
    setMeshName(newName);
  };

  // console.log("coords in  main file", coords);

  const upperThresholdData = Array.from(
    { length: 732 },
    (_, i) => 150 + (i * (900 - 150)) / 731
  );
  const lowerThresholdData = Array.from(
    { length: 732 },
    (_, i) => (i * 400) / 731
  );

  // console.log('upper threshold data', upperThresholdData);
  // console.log('lower threshold data', lowerThresholdData);

  // line chart limit
  // const getInitialLimit = () => {
  //   const storedLimit = localStorage.getItem("HindalcoLimit");
  //   return storedLimit ? parseInt(storedLimit) : 100;
  // };

  // const [hindalcoLimit, setHindalcoLimit] = useState(getInitialLimit);

  // const handleLineLimit = (e) => {
  //   const limit = parseInt(e.target.value);
  //   setHindalcoLimit(limit);
  //   localStorage.setItem("HindalcoLimit", limit.toString());
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
  // console.log("alert keys", alertKeys);
  // const alertKeys = [];

  // bar chart options
  const [barData, setBarData] = useState(() => {
    const screenWidth = window.innerWidth;
    const axisFontSize = screenWidth < 1536 ? "6px" : "8px";

    return {
      series: [
        {
          name: "Temperature",
          data: [],
        },
      ],
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
  //mac commit
  const [lineData, setLineData] = useState({
    labels: [],
    datasets: [],
  });

  // console.log("upperThresholdData ", upperThresholdData);
  // console.log("second Line Data", secondLineData);

  const allLabels = Array.from(
    { length: 732 },
    (_, i) => Math.floor(i / 12) + 1
  );

  // Only display the unique section labels and leave the rest as empty strings
  const displayLabels = allLabels.map((label, index) =>
    index % 12 === 0 ? label.toString() : ""
  );

  // console.log('display labels', displayLabels);

  const initialData = {
    labels: displayLabels,
    datasets: [
      {
        label: "Upper Threshold",
        data: upperThresholdData,
        borderColor: "red",
        borderWidth: 1.5,
        pointRadius: 0,
        pointHoverRadius: 0,
        fill: false,
        tooltip: { enabled: false },
        borderDash: [5, 5], // Disable tooltip
      },
      {
        label: "Lower Threshold",
        data: lowerThresholdData,
        borderColor: "red",
        borderWidth: 1.5,
        pointRadius: 0,
        pointHoverRadius: 0,
        fill: false,
        tooltip: { enabled: false },
        borderDash: [5, 5], // Disable tooltip
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
          borderWidth: 2,
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

  const lineOptions2 = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      plugins: {
        legend: {
          display: false, // Disable legend
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
          min: 0,
          max: 732, // x-axis range
          ticks: {
            font: {
              size: 7,
            },
            autoSkip: false,
            maxRotation: 0,
            callback: function (value, index) {
              return index % 24 === 0 ? this.getLabelForValue(value) : "";
            },
          },
        },
        y: {
          min: 0,
          max: 1000, // y-axis range
          ticks: {
            stepSize: 100,
            font: {
              size: 8,
            },
          },
        },
      },
    }),
    []
  );

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

  const batteryPercentage =
    Array.isArray(dataFromApp) && dataFromApp.length > 0
      ? dataFromApp[0].DeviceBattery
      : null;

  useEffect(() => {
    //for battery popup
    if (batteryPercentage !== null && batteryPercentage <= 10) {
      setBatteryPopup(true);
    }
  }, [batteryPercentage]);

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

      if (Array.isArray(thresholdGraphData) && thresholdGraphData.length > 0) {
        Object.keys(thresholdGraphData[0]).forEach((key) => {
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
                thresholdGraphData[0][key] === "N/A" ||
                isNaN(parseFloat(thresholdGraphData[0][key]))
              ) {
                barSeries.push(null);
              } else {
                barSeries.push(parseFloat(thresholdGraphData[0][key]));
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
              key !== "T11" &&
              key !== "T12" &&
              key !== "T13" &&
              key !== "T14" &&
              key !== "T15"
            ) {
              barCategories.push(key);
              // barSeries.push(parseFloat(dataFromApp[0][key]));
              if (
                thresholdGraphData[0][key] === "N/A" ||
                isNaN(parseFloat(thresholdGraphData[0][key]))
              ) {
                barSeries.push(null);
              } else {
                barSeries.push(parseFloat(thresholdGraphData[0][key]));
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
              name: "Temperature",
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

        const reversedData = [...thresholdGraphData].reverse();

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
      if (processStatus === "Start") {
        if (
          selectedLine === "" ||
          potNumber === "" ||
          selectedThermocouples.length <= 0
        ) {
          alert("Please fill all the inputs! ");
        } else {
          await axios.post(
            "https://hindalco.xyma.live/backend/updateHindalcoProcess",
            // "http://localhost:4000/backend/updateHindalcoProcess",
            {
              processStatus,
              selectedThermocouples,
              selectedLine,
              potNumber,
            }
          );
          setStartPopup(false);
          setStartConfirmationPopup(false);
          setSelectedThermocouples([]);
          setSelectedLine("");
          setPotNumber("");
        }
      } else if (processStatus === "Stop") {
        await axios.post(
          "https://hindalco.xyma.live/backend/updateHindalcoProcess",
          // "http://localhost:4000/backend/updateHindalcoProcess",
          {
            processStatus,
            selectedThermocouples,
          }
        );
      }
    } catch (error) {
      console.error("Error updating hindalco process", error);
    }
  };

  const getProcessDateRangeData = async (selectedDateRange) => {
    try {
      if (selectedDateRange !== "default") {
        setPreviousProcessDataLoading(true);
        const split = selectedDateRange.split("to");
        const startDate = split[0];
        const stopDate = split[1];

        const response = await axios.get(
          "https://hindalco.xyma.live/backend/getHindalcoReport",
          // "http://localhost:4000/backend/getHindalcoReport",
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
      } else {
        alert("Please pick a valid Date Range!");
      }
    } catch (error) {
      console.error("Error getting date range data", error);
    }
  };

  // console.log("previous process data", previousProcessData);

  return (
    <div className="relative xl:h-screen p-4 flex flex-col gap-2">
      {/* top bar - h-[10%] */}
      <div className="xl:h-[10%]">
        <Navbar />
      </div>

      {/* main content 1 h-[50%] */}
      <div className="xl:h-[50%] flex flex-col xl:flex-row gap-2 ">
        {/* 2d image */}
        <div className="w-full xl:w-[70%] flex flex-col gap-4 md:gap-2 rounded-xl p-2 bg-[#dde3f1]">
          <div className=" flex flex-col md:flex-row gap-4 md:gap-2 xl:h-[55%] text-sm 2xl:text-base">
            <div className="relative w-full md:w-[55%] p-0 xl:p-4 flex items-center justify-center  overflow-hidden h-[200px] xl:h-auto">
              {/* 3d model */}
              <div className="h-[250px] md:h-[350px] xl:h-[400px] xl:w-[450px] 2xl:h-[500px]">
                <div className="absolute top-0 left-0 h-full flex items-center justify-center ">
                  <span className="text-sm 2xl:text-base font-medium transform -rotate-90 origin-center">
                    Tap End
                  </span>
                </div>

                <div className="absolute top-0 right-0 h-full flex items-center justify-center ">
                  <span className="text-sm 2xl:text-base font-medium transform rotate-90 origin-center">
                    Duct End
                  </span>
                </div>

                <ThreeDModel
                  alertKeys={alertKeys}
                  coordsUpdateFunc={handleCoordsUpdate}
                  meshNameFunc={handleMeshName}
                />
              </div>

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
                  data-tooltip-content={
                    batteryPercentage !== null
                      ? `Battery Percentage: ${batteryPercentage}%`
                      : "Battery Percentage"
                  }
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

                {/* thermocouple configuration */}
                {lineNameDB && potNumberDB ? (
                  <div className="text-xs 2xl:text-base font-semibold rounded-md px-1 py-0.5 bg-white text-[#23439b]">
                    Device connected on: {lineNameDB}-Pot:{potNumberDB}
                  </div>
                ) : (
                  <div className="text-xs 2xl:text-base font-semibold rounded-md px-1 py-0.5 bg-white text-[#23439b]">
                    Device connected on: N/A
                  </div>
                )}
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
                (thresholdGraphData.length > 0 && thresholdGraphData[0].T1) ===
                  "N/A" || !fixedThermocouples.includes("T1")
                  ? "border border-gray-400 text-gray-500 bg-[#f5ffff]"
                  : alertKeys.length > 0 && alertKeys.includes("T1")
                  ? "card-indicator"
                  : "text-[#23439b] bg-[#f5ffff] border border-gray-400"
              }`}
            >
              <BsThermometerSun
                className={`${
                  viewAllCards
                    ? "text-xl 2xl:text-3xl"
                    : "text-3xl 2xl:text-4xl"
                }`}
              />
              <div>
                <div
                  className={`text-center font-medium  ${
                    viewAllCards && "text-xs 2xl:text-sm"
                  }`}
                >
                  T1
                </div>
                <div
                  className={`font-bold ${
                    viewAllCards
                      ? "text-base 2xl:text-2xl"
                      : "text-lg 2xl:text-3xl"
                  }`}
                >
                  {isNaN(
                    parseFloat(
                      thresholdGraphData.length > 0 && thresholdGraphData[0].T1
                    )
                  ) || !fixedThermocouples.includes("T1")
                    ? "N/A"
                    : `${parseFloat(
                        thresholdGraphData.length > 0 &&
                          thresholdGraphData[0].T1
                      ).toFixed(1)}°C`}
                </div>
              </div>
            </div>

            <div
              className={`py-1 px-2 text-sm 2xl:text-lg flex items-center justify-center gap-1 rounded-md  ${
                (thresholdGraphData.length > 0 && thresholdGraphData[0].T2) ===
                  "N/A" || !fixedThermocouples.includes("T2")
                  ? "border border-gray-400 text-gray-500 bg-[#f5ffff]"
                  : alertKeys.length > 0 && alertKeys.includes("T2")
                  ? "card-indicator"
                  : "text-[#23439b] bg-[#f5ffff] border border-gray-400"
              }`}
            >
              <BsThermometerSun
                className={`${
                  viewAllCards
                    ? "text-xl 2xl:text-3xl"
                    : "text-3xl 2xl:text-4xl"
                }`}
              />
              <div>
                <div
                  className={`text-center font-medium  ${
                    viewAllCards && "text-xs 2xl:text-sm"
                  }`}
                >
                  T2
                </div>
                <div
                  className={`font-bold ${
                    viewAllCards
                      ? "text-base 2xl:text-2xl"
                      : "text-lg 2xl:text-3xl"
                  }`}
                >
                  {isNaN(
                    parseFloat(
                      thresholdGraphData.length > 0 && thresholdGraphData[0].T2
                    )
                  ) || !fixedThermocouples.includes("T2")
                    ? "N/A"
                    : `${parseFloat(
                        thresholdGraphData.length > 0 &&
                          thresholdGraphData[0].T2
                      ).toFixed(1)}°C`}
                </div>
              </div>
            </div>

            <div
              className={`py-1 px-2 text-sm 2xl:text-lg flex items-center justify-center gap-1 rounded-md  ${
                (thresholdGraphData.length > 0 && thresholdGraphData[0].T3) ===
                  "N/A" || !fixedThermocouples.includes("T3")
                  ? "border border-gray-400 text-gray-500 bg-[#f5ffff]"
                  : alertKeys.length > 0 && alertKeys.includes("T3")
                  ? "card-indicator"
                  : "text-[#23439b] bg-[#f5ffff] border border-gray-400"
              }`}
            >
              <BsThermometerSun
                className={`${
                  viewAllCards
                    ? "text-xl 2xl:text-3xl"
                    : "text-3xl 2xl:text-4xl"
                }`}
              />
              <div>
                <div
                  className={`text-center font-medium  ${
                    viewAllCards && "text-xs 2xl:text-sm"
                  }`}
                >
                  T3
                </div>
                <div
                  className={`font-bold ${
                    viewAllCards
                      ? "text-base 2xl:text-2xl"
                      : "text-lg 2xl:text-3xl"
                  }`}
                >
                  {isNaN(
                    parseFloat(
                      thresholdGraphData.length > 0 && thresholdGraphData[0].T3
                    )
                  ) || !fixedThermocouples.includes("T3")
                    ? "N/A"
                    : `${parseFloat(
                        thresholdGraphData.length > 0 &&
                          thresholdGraphData[0].T3
                      ).toFixed(1)}°C`}
                </div>
              </div>
            </div>

            <div
              className={`py-1 px-2 text-sm 2xl:text-lg flex items-center justify-center gap-1 rounded-md  ${
                (thresholdGraphData.length > 0 && thresholdGraphData[0].T4) ===
                  "N/A" || !fixedThermocouples.includes("T4")
                  ? "border border-gray-400 text-gray-500 bg-[#f5ffff]"
                  : alertKeys.length > 0 && alertKeys.includes("T4")
                  ? "card-indicator"
                  : "text-[#23439b] bg-[#f5ffff] border border-gray-400"
              }`}
            >
              <BsThermometerSun
                className={`${
                  viewAllCards
                    ? "text-xl 2xl:text-3xl"
                    : "text-3xl 2xl:text-4xl"
                }`}
              />
              <div>
                <div
                  className={`text-center font-medium  ${
                    viewAllCards && "text-xs 2xl:text-sm"
                  }`}
                >
                  T4
                </div>
                <div
                  className={`font-bold ${
                    viewAllCards
                      ? "text-base 2xl:text-2xl"
                      : "text-lg 2xl:text-3xl"
                  }`}
                >
                  {isNaN(
                    parseFloat(
                      thresholdGraphData.length > 0 && thresholdGraphData[0].T4
                    )
                  ) || !fixedThermocouples.includes("T4")
                    ? "N/A"
                    : `${parseFloat(
                        thresholdGraphData.length > 0 &&
                          thresholdGraphData[0].T4
                      ).toFixed(1)}°C`}
                </div>
              </div>
            </div>

            <div
              className={`py-1 px-2 text-sm 2xl:text-lg flex items-center justify-center gap-1 rounded-md  ${
                (thresholdGraphData.length > 0 && thresholdGraphData[0].T5) ===
                  "N/A" || !fixedThermocouples.includes("T5")
                  ? "border border-gray-400 text-gray-500 bg-[#f5ffff]"
                  : alertKeys.length > 0 && alertKeys.includes("T5")
                  ? "card-indicator"
                  : "text-[#23439b] bg-[#f5ffff] border border-gray-400"
              }`}
            >
              <BsThermometerSun
                className={`${
                  viewAllCards
                    ? "text-xl 2xl:text-3xl"
                    : "text-3xl 2xl:text-4xl"
                }`}
              />
              <div>
                <div
                  className={`text-center font-medium  ${
                    viewAllCards && "text-xs 2xl:text-sm"
                  }`}
                >
                  T5
                </div>
                <div
                  className={`font-bold ${
                    viewAllCards
                      ? "text-base 2xl:text-2xl"
                      : "text-lg 2xl:text-3xl"
                  }`}
                >
                  {isNaN(
                    parseFloat(
                      thresholdGraphData.length > 0 && thresholdGraphData[0].T5
                    )
                  ) || !fixedThermocouples.includes("T5")
                    ? "N/A"
                    : `${parseFloat(
                        thresholdGraphData.length > 0 &&
                          thresholdGraphData[0].T5
                      ).toFixed(1)}°C`}
                </div>
              </div>
            </div>

            <div
              className={`py-1 px-2 text-sm 2xl:text-lg flex items-center justify-center gap-1 rounded-md  ${
                (thresholdGraphData.length > 0 && thresholdGraphData[0].T6) ===
                  "N/A" || !fixedThermocouples.includes("T6")
                  ? "border border-gray-400 text-gray-500 bg-[#f5ffff]"
                  : alertKeys.length > 0 && alertKeys.includes("T6")
                  ? "card-indicator"
                  : "text-[#23439b] bg-[#f5ffff] border border-gray-400"
              }`}
            >
              <BsThermometerSun
                className={`${
                  viewAllCards
                    ? "text-xl 2xl:text-3xl"
                    : "text-3xl 2xl:text-4xl"
                }`}
              />
              <div>
                <div
                  className={`text-center font-medium  ${
                    viewAllCards && "text-xs 2xl:text-sm"
                  }`}
                >
                  T6
                </div>
                <div
                  className={`font-bold ${
                    viewAllCards
                      ? "text-base 2xl:text-2xl"
                      : "text-lg 2xl:text-3xl"
                  }`}
                >
                  {isNaN(
                    parseFloat(
                      thresholdGraphData.length > 0 && thresholdGraphData[0].T6
                    )
                  ) || !fixedThermocouples.includes("T6")
                    ? "N/A"
                    : `${parseFloat(
                        thresholdGraphData.length > 0 &&
                          thresholdGraphData[0].T6
                      ).toFixed(1)}°C`}
                </div>
              </div>
            </div>

            <div
              className={`py-1 px-2 text-sm 2xl:text-lg flex items-center justify-center gap-1 rounded-md  ${
                (thresholdGraphData.length > 0 && thresholdGraphData[0].T7) ===
                  "N/A" || !fixedThermocouples.includes("T7")
                  ? "border border-gray-400 text-gray-500 bg-[#f5ffff]"
                  : alertKeys.length > 0 && alertKeys.includes("T7")
                  ? "card-indicator"
                  : "text-[#23439b] bg-[#f5ffff] border border-gray-400"
              }`}
            >
              <BsThermometerSun
                className={`${
                  viewAllCards
                    ? "text-xl 2xl:text-3xl"
                    : "text-3xl 2xl:text-4xl"
                }`}
              />
              <div>
                <div
                  className={`text-center font-medium  ${
                    viewAllCards && "text-xs 2xl:text-sm"
                  }`}
                >
                  T7
                </div>
                <div
                  className={`font-bold ${
                    viewAllCards
                      ? "text-base 2xl:text-2xl"
                      : "text-lg 2xl:text-3xl"
                  }`}
                >
                  {isNaN(
                    parseFloat(
                      thresholdGraphData.length > 0 && thresholdGraphData[0].T7
                    )
                  ) || !fixedThermocouples.includes("T7")
                    ? "N/A"
                    : `${parseFloat(
                        thresholdGraphData.length > 0 &&
                          thresholdGraphData[0].T7
                      ).toFixed(1)}°C`}
                </div>
              </div>
            </div>

            <div
              className={`py-1 px-2 text-sm 2xl:text-lg flex items-center justify-center gap-1 rounded-md  ${
                (thresholdGraphData.length > 0 && thresholdGraphData[0].T8) ===
                  "N/A" || !fixedThermocouples.includes("T8")
                  ? "border border-gray-400 text-gray-500 bg-[#f5ffff]"
                  : alertKeys.length > 0 && alertKeys.includes("T8")
                  ? "card-indicator"
                  : "text-[#23439b] bg-[#f5ffff] border border-gray-400"
              }`}
            >
              <BsThermometerSun
                className={`${
                  viewAllCards
                    ? "text-xl 2xl:text-3xl"
                    : "text-3xl 2xl:text-4xl"
                }`}
              />
              <div>
                <div
                  className={`text-center font-medium  ${
                    viewAllCards && "text-xs 2xl:text-sm"
                  }`}
                >
                  T8
                </div>
                <div
                  className={`font-bold ${
                    viewAllCards
                      ? "text-base 2xl:text-2xl"
                      : "text-lg 2xl:text-3xl"
                  }`}
                >
                  {isNaN(
                    parseFloat(
                      thresholdGraphData.length > 0 && thresholdGraphData[0].T8
                    )
                  ) || !fixedThermocouples.includes("T8")
                    ? "N/A"
                    : `${parseFloat(
                        thresholdGraphData.length > 0 &&
                          thresholdGraphData[0].T8
                      ).toFixed(1)}°C`}
                </div>
              </div>
            </div>

            <div
              className={`py-1 px-2 text-sm 2xl:text-lg flex items-center justify-center gap-1 rounded-md  ${
                (thresholdGraphData.length > 0 && thresholdGraphData[0].T9) ===
                  "N/A" || !fixedThermocouples.includes("T9")
                  ? "border border-gray-400 text-gray-500 bg-[#f5ffff]"
                  : alertKeys.length > 0 && alertKeys.includes("T9")
                  ? "card-indicator"
                  : "text-[#23439b] bg-[#f5ffff] border border-gray-400"
              }`}
            >
              <BsThermometerSun
                className={`${
                  viewAllCards
                    ? "text-xl 2xl:text-3xl"
                    : "text-3xl 2xl:text-4xl"
                }`}
              />
              <div>
                <div
                  className={`text-center font-medium  ${
                    viewAllCards && "text-xs 2xl:text-sm"
                  }`}
                >
                  T9
                </div>
                <div
                  className={`font-bold ${
                    viewAllCards
                      ? "text-base 2xl:text-2xl"
                      : "text-lg 2xl:text-3xl"
                  }`}
                >
                  {isNaN(
                    parseFloat(
                      thresholdGraphData.length > 0 && thresholdGraphData[0].T9
                    )
                  ) || !fixedThermocouples.includes("T9")
                    ? "N/A"
                    : `${parseFloat(
                        thresholdGraphData.length > 0 &&
                          thresholdGraphData[0].T9
                      ).toFixed(1)}°C`}
                </div>
              </div>
            </div>

            <div
              className={`py-1 px-2 text-sm 2xl:text-lg flex items-center justify-center gap-1 rounded-md  ${
                (thresholdGraphData.length > 0 && thresholdGraphData[0].T10) ===
                  "N/A" || !fixedThermocouples.includes("T10")
                  ? "border border-gray-400 text-gray-500 bg-[#f5ffff]"
                  : alertKeys.length > 0 && alertKeys.includes("T10")
                  ? "card-indicator"
                  : "text-[#23439b] bg-[#f5ffff] border border-gray-400"
              }`}
            >
              <BsThermometerSun
                className={`${
                  viewAllCards
                    ? "text-xl 2xl:text-3xl"
                    : "text-3xl 2xl:text-4xl"
                }`}
              />
              <div>
                <div
                  className={`text-center font-medium  ${
                    viewAllCards && "text-xs 2xl:text-sm"
                  }`}
                >
                  T10
                </div>
                <div
                  className={`font-bold ${
                    viewAllCards
                      ? "text-base 2xl:text-2xl"
                      : "text-lg 2xl:text-3xl"
                  }`}
                >
                  {isNaN(
                    parseFloat(
                      thresholdGraphData.length > 0 && thresholdGraphData[0].T10
                    )
                  ) || !fixedThermocouples.includes("T10")
                    ? "N/A"
                    : `${parseFloat(
                        thresholdGraphData.length > 0 &&
                          thresholdGraphData[0].T10
                      ).toFixed(1)}°C`}
                </div>
              </div>
            </div>

            {/* extra 5 cards */}
            {viewAllCards && (
              <>
                <div
                  className={`py-1 px-2 text-sm 2xl:text-lg flex items-center justify-center gap-1 rounded-md  ${
                    (thresholdGraphData.length > 0 &&
                      thresholdGraphData[0].T11) === "N/A" ||
                    !fixedThermocouples.includes("T11")
                      ? "border border-gray-400 text-gray-500 bg-[#f5ffff]"
                      : alertKeys.length > 0 && alertKeys.includes("T11")
                      ? "card-indicator"
                      : "text-[#23439b] bg-[#f5ffff] border border-gray-400"
                  }`}
                >
                  <BsThermometerSun
                    className={`${
                      viewAllCards
                        ? "text-xl 2xl:text-3xl"
                        : "text-3xl 2xl:text-4xl"
                    }`}
                  />
                  <div>
                    <div
                      className={`text-center font-medium  ${
                        viewAllCards && "text-xs 2xl:text-sm"
                      }`}
                    >
                      T11
                    </div>
                    <div
                      className={`font-bold ${
                        viewAllCards
                          ? "text-base 2xl:text-2xl"
                          : "text-lg 2xl:text-3xl"
                      }`}
                    >
                      {isNaN(
                        parseFloat(
                          thresholdGraphData.length > 0 &&
                            thresholdGraphData[0].T11
                        )
                      ) || !fixedThermocouples.includes("T11")
                        ? "N/A"
                        : `${parseFloat(
                            thresholdGraphData.length > 0 &&
                              thresholdGraphData[0].T11
                          ).toFixed(1)}°C`}
                    </div>
                  </div>
                </div>

                <div
                  className={`py-1 px-2 text-sm 2xl:text-lg flex items-center justify-center gap-1 rounded-md  ${
                    (thresholdGraphData.length > 0 &&
                      thresholdGraphData[0].T12) === "N/A" ||
                    !fixedThermocouples.includes("T12")
                      ? "border border-gray-400 text-gray-500 bg-[#f5ffff]"
                      : alertKeys.length > 0 && alertKeys.includes("T12")
                      ? "card-indicator"
                      : "text-[#23439b] bg-[#f5ffff] border border-gray-400"
                  }`}
                >
                  <BsThermometerSun
                    className={`${
                      viewAllCards
                        ? "text-xl 2xl:text-3xl"
                        : "text-3xl 2xl:text-4xl"
                    }`}
                  />
                  <div>
                    <div
                      className={`text-center font-medium  ${
                        viewAllCards && "text-xs 2xl:text-sm"
                      }`}
                    >
                      T12
                    </div>
                    <div
                      className={`font-bold ${
                        viewAllCards
                          ? "text-base 2xl:text-2xl"
                          : "text-lg 2xl:text-3xl"
                      }`}
                    >
                      {isNaN(
                        parseFloat(
                          thresholdGraphData.length > 0 &&
                            thresholdGraphData[0].T12
                        )
                      ) || !fixedThermocouples.includes("T12")
                        ? "N/A"
                        : `${parseFloat(
                            thresholdGraphData.length > 0 &&
                              thresholdGraphData[0].T12
                          ).toFixed(1)}°C`}
                    </div>
                  </div>
                </div>

                <div
                  className={`py-1 px-2 text-sm 2xl:text-lg flex items-center justify-center gap-1 rounded-md  ${
                    (thresholdGraphData.length > 0 &&
                      thresholdGraphData[0].T13) === "N/A" ||
                    !fixedThermocouples.includes("T13")
                      ? "border border-gray-400 text-gray-500 bg-[#f5ffff]"
                      : alertKeys.length > 0 && alertKeys.includes("T13")
                      ? "card-indicator"
                      : "text-[#23439b] bg-[#f5ffff] border border-gray-400"
                  }`}
                >
                  <BsThermometerSun
                    className={`${
                      viewAllCards
                        ? "text-xl 2xl:text-3xl"
                        : "text-3xl 2xl:text-4xl"
                    }`}
                  />
                  <div>
                    <div
                      className={`text-center font-medium  ${
                        viewAllCards && "text-xs 2xl:text-sm"
                      }`}
                    >
                      T13
                    </div>
                    <div
                      className={`font-bold ${
                        viewAllCards
                          ? "text-base 2xl:text-2xl"
                          : "text-lg 2xl:text-3xl"
                      }`}
                    >
                      {isNaN(
                        parseFloat(
                          thresholdGraphData.length > 0 &&
                            thresholdGraphData[0].T13
                        )
                      ) || !fixedThermocouples.includes("T13")
                        ? "N/A"
                        : `${parseFloat(
                            thresholdGraphData.length > 0 &&
                              thresholdGraphData[0].T13
                          ).toFixed(1)}°C`}
                    </div>
                  </div>
                </div>

                <div
                  className={`py-1 px-2 text-sm 2xl:text-lg flex items-center justify-center gap-1 rounded-md  ${
                    (thresholdGraphData.length > 0 &&
                      thresholdGraphData[0].T14) === "N/A" ||
                    !fixedThermocouples.includes("T14")
                      ? "border border-gray-400 text-gray-500 bg-[#f5ffff]"
                      : alertKeys.length > 0 && alertKeys.includes("T14")
                      ? "card-indicator"
                      : "text-[#23439b] bg-[#f5ffff] border border-gray-400"
                  }`}
                >
                  <BsThermometerSun
                    className={`${
                      viewAllCards
                        ? "text-xl 2xl:text-3xl"
                        : "text-3xl 2xl:text-4xl"
                    }`}
                  />
                  <div>
                    <div
                      className={`text-center font-medium  ${
                        viewAllCards && "text-xs 2xl:text-sm"
                      }`}
                    >
                      T14
                    </div>
                    <div
                      className={`font-bold ${
                        viewAllCards
                          ? "text-base 2xl:text-2xl"
                          : "text-lg 2xl:text-3xl"
                      }`}
                    >
                      {isNaN(
                        parseFloat(
                          thresholdGraphData.length > 0 &&
                            thresholdGraphData[0].T14
                        )
                      ) || !fixedThermocouples.includes("T14")
                        ? "N/A"
                        : `${parseFloat(
                            thresholdGraphData.length > 0 &&
                              thresholdGraphData[0].T14
                          ).toFixed(1)}°C`}
                    </div>
                  </div>
                </div>

                <div
                  className={`py-1 px-2 text-sm 2xl:text-lg flex items-center justify-center gap-1 rounded-md  ${
                    (thresholdGraphData.length > 0 &&
                      thresholdGraphData[0].T15) === "N/A" ||
                    !fixedThermocouples.includes("T15")
                      ? "border border-gray-400 text-gray-500 bg-[#f5ffff]"
                      : alertKeys.length > 0 && alertKeys.includes("T15")
                      ? "card-indicator"
                      : "text-[#23439b] bg-[#f5ffff] border border-gray-400"
                  }`}
                >
                  <BsThermometerSun
                    className={`${
                      viewAllCards
                        ? "text-xl 2xl:text-3xl"
                        : "text-3xl 2xl:text-4xl"
                    }`}
                  />
                  <div>
                    <div
                      className={`text-center font-medium  ${
                        viewAllCards && "text-xs 2xl:text-sm"
                      }`}
                    >
                      T15
                    </div>
                    <div
                      className={`font-bold ${
                        viewAllCards
                          ? "text-base 2xl:text-2xl"
                          : "text-lg 2xl:text-3xl"
                      }`}
                    >
                      {isNaN(
                        parseFloat(
                          thresholdGraphData.length > 0 &&
                            thresholdGraphData[0].T15
                        )
                      ) || !fixedThermocouples.includes("T15")
                        ? "N/A"
                        : `${parseFloat(
                            thresholdGraphData.length > 0 &&
                              thresholdGraphData[0].T15
                          ).toFixed(1)}°C`}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* threshold chart */}
        <div className="relative h-[350px] xl:h-auto rounded-xl w-full xl:w-[30%] bg-[#dde3f1] p-2">
          {!previousProcessDataOpen ? ( //live process data
            <div className="flex flex-col gap-1 w-full h-full">
              <div className="flex flex-wrap gap-2 justify-between items-center">
                <div className="flex gap-2">
                  {processIsRunning && processIsRunning === true ? (
                    <>
                      <button className="bg-gray-300 text-gray-500 text-xs 2xl:text-base font-medium rounded-md px-1 py-0.5 cursor-not-allowed">
                        Start
                      </button>

                      <button
                        className="bg-[#e4ba4c] text-xs 2xl:text-base font-medium rounded-md px-1 py-0.5 hover:scale-110 duration-200"
                        onClick={() => setStopPopup(true)}
                      >
                        Stop
                      </button>
                    </>
                  ) : processIsRunning === false ? (
                    <>
                      <button
                        className="bg-[#e4ba4c] text-xs 2xl:text-base font-medium rounded-md px-1 py-0.5 hover:scale-110 duration-200"
                        onClick={() => setStartPopup(true)}
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

                <div className="flex gap-2 items-center">
                  <button
                    onClick={() => setPreviousProcessDataOpen(true)}
                    className="flex gap-1 items-center bg-[#23439b] text-white text-xs 2xl:text-base font-medium rounded-md px-1 py-0.5 hover:scale-110 duration-200"
                  >
                    Previous&nbsp;Process&nbsp;Data
                    <TiArrowRightThick className="text-lg 2xl:text-xl" />
                  </button>

                  <div className="text-[10px] text-[#23439b] font-medium 2xl:text-base bg-white rounded-sm px-2 xl:hidden">
                    Time Left: {processTimeLeft}
                  </div>
                </div>
              </div>

              <div className="justify-end hidden xl:flex">
                <div className="text-[10px] text-[#23439b] font-medium 2xl:text-base bg-white rounded-sm px-2">
                  Time Left: {processTimeLeft}
                </div>
              </div>

              <div className="h-full w-full">
                <Line data={lineData2} options={lineOptions2} width={"100%"} />
              </div>
            </div>
          ) : (
            //previous process data
            <div className="flex flex-col h-full w-full">
              <div className="flex flex-wrap gap-2 justify-between">
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
                    <option value="default">Pick Date Range</option>
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
        <div className="relative w-full md:w-[25%] flex flex-col gap-2 h-[350px] xl:h-full rounded-xl p-1 bg-[#dde3f1] overflow-auto">
          <div className=" relative flex justify-center gap-2 items-center py-1 px-2 font-bold text-[#23439b] ">
            <div className="2xl:text-xl">Alerts</div>
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
        </div>

        {/* line chart card */}
        <div className=" overflow-hidden p-2 w-full md:w-[75%] h-[350px] xl:h-auto rounded-xl flex flex-col-reverse gap-2 md:flex-row bg-[#dde3f1]">
          <div className="w-full h-full">
            <Line data={lineData} options={lineOptions} width={"100%"} />
          </div>
          {/* <div className="flex flex-row flex-wrap md:flex-col justify-center gap-0 md:gap-2 text-sm 2xl:text-base">
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
          </div> */}
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

      {/* 3d model hover */}
      {meshName && coords && coords[0] !== 0 && coords[1] !== 0 && (
        <div
          className={`absolute  text-white p-2 rounded-md text-xs 2xl:text-base font-medium shadow-2xl flex gap-1 ${
            alertKeys.length > 0 && alertKeys.includes(meshName)
              ? "bg-red-500"
              : "bg-[#23439b]"
          }`}
          style={{
            top: `${coords[1]}px`,
            left: `${coords[0]}px`,
          }}
        >
          <div>{meshName}:</div>
          <div>
            {isNaN(
              parseFloat(dataFromApp.length > 0 && dataFromApp[0][meshName])
            )
              ? "N/A"
              : `${parseFloat(
                  dataFromApp.length > 0 && dataFromApp[0][meshName]
                ).toFixed(1)}°C`}{" "}
          </div>
        </div>
      )}

      {/* start popup */}
      {startPopup && (
        <div className="absolute inset-0 bg-black/70 flex justify-center items-center z-10">
          <div className="bg-white px-4 py-6 flex flex-col gap-4 rounded-md text-sm 2xl:text-base font-medium text-[#23439b]">
            <div className="text-[#23439b] text-center text-base 2xl:text-lg font-medium">
              Thermocouple Configuration
            </div>
            <div className="flex gap-2 items-center">
              <div className="">Select Line:</div>
              <label>
                <input
                  type="radio"
                  value="lineA"
                  name="line"
                  checked={selectedLine === "lineA"}
                  onChange={(e) => setSelectedLine(e.target.value)}
                />{" "}
                Line A
              </label>

              <label>
                <input
                  type="radio"
                  value="lineB"
                  name="line"
                  checked={selectedLine === "lineB"}
                  onChange={(e) => setSelectedLine(e.target.value)}
                />{" "}
                Line B
              </label>
            </div>

            <div className="flex gap-2">
              <label>Enter Pot Number:</label>
              <input
                type="text"
                className="border border-black rounded-sm px-1"
                onChange={(e) => setPotNumber(e.target.value)}
              />
            </div>

            <div>Select connected thermocouple(s):</div>

            <div className="grid grid-cols-5 gap-2">
              {thermocouples.map((name) => (
                <div
                  className={`border rounded-md text-center px-2 py-1 cursor-pointer hover:scale-110 duration-200 ${
                    selectedThermocouples.includes(name)
                      ? "bg-[#23439b] text-white"
                      : "bg-white border-[#23439b] text-[#23439b]"
                  }`}
                  key={name}
                  onClick={() => toggleThermocouple(name)}
                >
                  {name}
                </div>
              ))}
            </div>
            <div className="flex gap-4 justify-end items-center text-black">
              <button
                className="bg-gray-200 text-sm 2xl:text-lg font-medium rounded-md px-1 py-1 hover:scale-110 duration-200"
                onClick={() => {
                  setStartPopup(false);
                  setSelectedThermocouples([]);
                }}
              >
                Cancel
              </button>
              <button
                className="bg-[#e4ba4c] text-sm 2xl:text-lg font-medium rounded-md px-4 py-1 hover:scale-110 duration-200"
                // onClick={() => {
                //   updateHindalcoProcess("Start");
                // }}
                onClick={() => {
                  if (
                    selectedLine === "" ||
                    potNumber === "" ||
                    selectedThermocouples.length <= 0
                  ) {
                    alert("Please fill all the inputs! ");
                  } else {
                    setStartConfirmationPopup(true);
                  }
                }}
              >
                Start
              </button>
            </div>
          </div>
        </div>
      )}

      {/* start cofirmation popup */}
      {startConfirmationPopup && (
        <div className="absolute inset-0 bg-black/70 flex justify-center items-center z-10">
          <div className="bg-white px-6 py-6 flex flex-col gap-2 rounded-md text-center md:w-96">
            <div className="flex justify-center items-center">
              <TbAlertTriangle className="text-6xl 2xl:text-7xl text-orange-400" />
            </div>

            <div>
              Are you sure that the selected thermocouples are properly
              connected with the data logger, If yes click start.{" "}
            </div>
            <div className="flex gap-4 justify-end items-center text-black">
              <button
                className="bg-gray-200 text-sm 2xl:text-lg font-medium rounded-md px-3 py-1 hover:scale-110 duration-200"
                onClick={() => setStartConfirmationPopup(false)}
              >
                Back
              </button>
              <button
                className="bg-[#e4ba4c] text-sm 2xl:text-lg font-medium rounded-md px-4 py-1 hover:scale-110 duration-200"
                onClick={() => {
                  updateHindalcoProcess("Start");
                }}
              >
                Start
              </button>
            </div>
          </div>
        </div>
      )}

      {/* stop confirmation popup */}
      {stopPopup && (
        <div className="absolute inset-0 bg-black/70 flex justify-center items-center z-10">
          <div className="bg-white px-4 py-6 flex flex-col gap-6 rounded-md">
            <div>Do you really want to stop the process?</div>
            <div className="flex items-center justify-end gap-4">
              <button
                className="bg-gray-200 text-sm 2xl:text-lg font-medium rounded-md px-1 py-1 hover:scale-110 duration-200"
                onClick={() => setStopPopup(false)}
              >
                Cancel
              </button>
              <button
                className="bg-[#e4ba4c] text-sm 2xl:text-lg font-medium rounded-md px-4 py-1 hover:scale-110 duration-200"
                onClick={() => {
                  setStopPopup(false);
                  updateHindalcoProcess("Stop");
                  window.location.reload();
                }}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* low battery popup */}
      {batteryPopup && (
        <div className="absolute inset-0 bg-black/70 flex justify-center items-center z-10">
          <div className="bg-white px-6 py-4 flex flex-col gap-6 rounded-md">
            <div className="flex gap-2 items-center">
              <PiBatteryWarningBold className="text-2xl 2xl:text-3xl text-red-500" />
              <div className="text-sm 2xl:text-base font-medium">
                Low Device Battery!
              </div>
            </div>
            <div className="flex justify-center">
              <button
                onClick={() => setBatteryPopup(false)}
                className="bg-[#e4ba4c] text-sm 2xl:text-lg font-medium rounded-md px-4 py-1 hover:scale-110 duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
