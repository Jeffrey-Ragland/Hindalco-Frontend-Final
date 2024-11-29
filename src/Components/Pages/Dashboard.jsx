import React from "react";
import axios from "axios";
import { useMemo, useState, useEffect } from "react";
import potlineTop2 from "../Assets/potlineTop2.png";
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
import { TbAlertTriangle, TbDelta } from "react-icons/tb";
import { FiInfo } from "react-icons/fi";
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
  t4Status,
  t5Status,
  t6Status,
}) => {
  const [activeStatus, setActiveStatus] = useState("");
  const [previousProcessDataOpen, setPreviousProcessDataOpen] = useState(false);
  const [previousProcessDataLoading, setPreviousProcessDataLoading] =
    useState(false);
  const [previousProcessData, setPreviousProcessData] = useState([]);
  const [clickedLegends, setClickedLegends] = useState([]);
  const [startPopup, setStartPopup] = useState(false);
  const [stopPopup, setStopPopup] = useState(false);
  const [selectedThermocouples, setSelectedThermocouples] = useState([]);
  const [selectedLine, setSelectedLine] = useState("");
  const [potNumber, setPotNumber] = useState("");
  const [batteryPopup, setBatteryPopup] = useState(false);
  const [startConfirmationPopup, setStartConfirmationPopup] = useState(false);
  const [previousSelectedDateRange, setPreviousSelectedDateRange] =
    useState("");

  const initialClickedLegends = useMemo(() => {
    return fixedThermocouples.length > 0 ? [fixedThermocouples[0]] : [];
  }, [fixedThermocouples]);

  useEffect(() => {
    if (clickedLegends.length === 0 && initialClickedLegends.length > 0) {
      setClickedLegends(initialClickedLegends);
    }
  }, [clickedLegends, initialClickedLegends]);

  const toggleThermocouple = (name) => {
    setSelectedThermocouples((prevselected) =>
      prevselected.includes(name)
        ? prevselected.filter((item) => item !== name)
        : [...prevselected, name]
    );
  };

  const isMobile = window.matchMedia("(max-width: 768px)").matches; //to restrict mobile graph wheel zoom

  // console.log("fixed termocouples", fixegdThermocouples);
  // console.log("datarange", thresholdGraphDateRange);
  console.log("threshold graph data", thresholdGraphData);
  console.log("t4 status", t4Status);
  console.log("t5 status", t5Status);
  console.log("t6 status", t6Status);

  const upperThresholdDataX = Array.from(
    { length: 732 },
    (_, i) => 150 + (i * (900 - 150)) / 731
  );
  const lowerThresholdDataX = Array.from(
    { length: 732 },
    (_, i) => (i * 400) / 731
  );

  // threshold calculation for T4, T5, T6
  const timeIntervals = [
    0, 180, 360, 540, 720, 900, 1080, 1260, 1440, 1620, 1800, 1980, 2160, 2340,
    2520, 2700, 2880, 3060, 3240, 3420,
  ];
  const lowerLimits = [
    57, 122, 176, 222, 263, 294, 326, 360, 394, 433, 475, 509, 549, 581, 607,
    636, 659, 679, 701, 711,
  ];
  const upperLimits = [
    70, 151, 218, 273, 322, 365, 406, 452, 495, 549, 606, 660, 707, 746, 782,
    816, 842, 861, 886, 896,
  ];

  // Number of data points for 5-minute intervals
  const totalPoints = 732; // (60 hours * 12 intervals per hour)

  // Function to calculate interpolated values
  const interpolate = (x, x1, y1, x2, y2) =>
    y1 + ((x - x1) / (x2 - x1)) * (y2 - y1);

  // Generate thresholds for 5-minute intervals
  const upperThresholdData456 = Array.from({ length: totalPoints }, (_, i) => {
    const currentTime = i * 5; // 5-minute intervals

    // Find the interval where currentTime falls
    const index = timeIntervals.findIndex(
      (t, idx) => t <= currentTime && currentTime <= timeIntervals[idx + 1]
    );

    // Perform linear interpolation
    const x1 = timeIntervals[index];
    const y1 = upperLimits[index];
    const x2 = timeIntervals[index + 1];
    const y2 = upperLimits[index + 1];
    return interpolate(currentTime, x1, y1, x2, y2);
  });

  const lowerThresholdData456 = Array.from({ length: totalPoints }, (_, i) => {
    const currentTime = i * 5; // 5-minute intervals

    // Find the interval where currentTime falls
    const index = timeIntervals.findIndex(
      (t, idx) => t <= currentTime && currentTime <= timeIntervals[idx + 1]
    );

    // Perform linear interpolation
    const x1 = timeIntervals[index];
    const y1 = lowerLimits[index];
    const x2 = timeIntervals[index + 1];
    const y2 = lowerLimits[index + 1];
    return interpolate(currentTime, x1, y1, x2, y2);
  });

  // threshold calculation for T1
  const timeIntervalsT1 = [
    0, 180, 360, 540, 720, 900, 1080, 1260, 1440, 1620, 1800, 1980, 2160, 2340,
    2520, 2700, 2880, 3060, 3240, 3420, 3600,
  ];

  const lowerLimitsT1 = [
    36, 108, 166, 207, 240, 268, 296, 319, 343, 374, 410, 450, 490, 529, 563,
    591, 615, 635, 685, 708, 720,
  ];

  const upperLimitsT1 = [
    47, 152, 224, 285, 328, 365, 406, 446, 496, 542, 584, 621, 647, 670, 694,
    717, 732, 744, 731, 745, 753,
  ];

  const interpolateT1 = (x, x1, y1, x2, y2) =>
    y1 + ((x - x1) / (x2 - x1)) * (y2 - y1);

  const totalPointsT1 = 732;

  // Generate upper and lower threshold data for 5-minute intervals
  const upperThresholdDataT1 = Array.from({ length: totalPointsT1 }, (_, i) => {
    const currentTime = i * 5; // 5-minute intervals

    // Find the interval where currentTime falls
    const index = timeIntervalsT1.findIndex(
      (t, idx) => t <= currentTime && currentTime <= timeIntervalsT1[idx + 1]
    );

    // Perform linear interpolation
    const x1 = timeIntervalsT1[index];
    const y1 = upperLimitsT1[index];
    const x2 = timeIntervalsT1[index + 1];
    const y2 = upperLimitsT1[index + 1];
    return interpolateT1(currentTime, x1, y1, x2, y2);
  });

  const lowerThresholdDataT1 = Array.from({ length: totalPointsT1 }, (_, i) => {
    const currentTime = i * 5; // 5-minute intervals

    // Find the interval where currentTime falls
    const index = timeIntervalsT1.findIndex(
      (t, idx) => t <= currentTime && currentTime <= timeIntervalsT1[idx + 1]
    );

    // Perform linear interpolation
    const x1 = timeIntervalsT1[index];
    const y1 = lowerLimitsT1[index];
    const x2 = timeIntervalsT1[index + 1];
    const y2 = lowerLimitsT1[index + 1];
    return interpolateT1(currentTime, x1, y1, x2, y2);
  });

  // threshold calculation for T8
  const timeIntervalsT8 = [
    0, 180, 360, 540, 720, 900, 1080, 1260, 1440, 1620, 1800, 1980, 2160, 2340,
    2520, 2700, 2880, 3060, 3240, 3420, 3600,
  ];

  const lowerLimitsT8 = [
    33, 97, 150, 189, 221, 250, 278, 310, 344, 379, 410, 446, 479, 511, 537,
    558, 586, 611, 647, 697, 710,
  ];

  const upperLimitsT8 = [
    48, 155, 237, 297, 343, 383, 419, 451, 486, 526, 555, 585, 611, 640, 664,
    686, 703, 715, 723, 738, 749,
  ];

  const interpolateT8 = (x, x1, y1, x2, y2) =>
    y1 + ((x - x1) / (x2 - x1)) * (y2 - y1);

  const totalPointsT8 = 732;

  // Generate upper and lower threshold data for 5-minute intervals
  const upperThresholdDataT8 = Array.from({ length: totalPointsT8 }, (_, i) => {
    const currentTime = i * 5; // 5-minute intervals

    // Find the interval where currentTime falls
    const index = timeIntervalsT8.findIndex(
      (t, idx) => t <= currentTime && currentTime <= timeIntervalsT8[idx + 1]
    );

    // Perform linear interpolation
    const x1 = timeIntervalsT8[index];
    const y1 = upperLimitsT8[index];
    const x2 = timeIntervalsT8[index + 1];
    const y2 = upperLimitsT8[index + 1];
    return interpolateT8(currentTime, x1, y1, x2, y2);
  });

  const lowerThresholdDataT8 = Array.from({ length: totalPointsT8 }, (_, i) => {
    const currentTime = i * 5; // 5-minute intervals

    // Find the interval where currentTime falls
    const index = timeIntervalsT8.findIndex(
      (t, idx) => t <= currentTime && currentTime <= timeIntervalsT8[idx + 1]
    );

    // Perform linear interpolation
    const x1 = timeIntervalsT8[index];
    const y1 = lowerLimitsT8[index];
    const x2 = timeIntervalsT8[index + 1];
    const y2 = lowerLimitsT8[index + 1];
    return interpolateT8(currentTime, x1, y1, x2, y2);
  });

  // console.log("upper threshold t8", upperThresholdDataT8);
  // console.log("lower threshold t8", lowerThresholdDataT8);

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

  // const deviationValues = [
  //   24.33, // 0-3 hours
  //   20.17, // 3-6 hours
  //   16.83, // 6-9 hours
  //   15.0, // 9-12 hours
  //   12.33, // 12-15 hours
  //   12.17, // 15-18 hours
  //   13.33, // 18-21 hours
  //   12.83, // 21-24 hours
  //   15.5, // 24-27 hours
  //   16.5, // 27-30 hours
  //   14.67, // 30-33 hours
  //   14.5, // 33-36 hours
  //   11.83, // 36-39 hours
  //   10.33, // 39-42 hours
  //   10.5, // 42-45 hours
  //   8.17, // 45-48 hours
  //   6.5, // 48-51 hours
  //   7.83, // 51-54 hours
  //   3.33,
  // ];

  if (thresholdGraphData.length > 0) {
    const latestData = thresholdGraphData[0];
    const time = thresholdGraphData[0].Time;
    const index = thresholdGraphData.length - 1;

    // Mapping of sensors to their respective threshold data
    const thresholdMapping = {
      T1: {
        upper: upperThresholdDataT1,
        lower: lowerThresholdDataT1,
      },
      T4: {
        upper: upperThresholdData456,
        lower: lowerThresholdData456,
      },
      T5: {
        upper: upperThresholdData456,
        lower: lowerThresholdData456,
      },
      T6: {
        upper: upperThresholdData456,
        lower: lowerThresholdData456,
      },
      T8: {
        upper: upperThresholdDataT8,
        lower: lowerThresholdDataT8,
      },
      T2: {
        upper: upperThresholdDataX,
        lower: lowerThresholdDataX,
      },
      T3: {
        upper: upperThresholdDataX,
        lower: lowerThresholdDataX,
      },
      T7: {
        upper: upperThresholdDataX,
        lower: lowerThresholdDataX,
      },
      T9: {
        upper: upperThresholdDataX,
        lower: lowerThresholdDataX,
      },
      T10: {
        upper: upperThresholdDataX,
        lower: lowerThresholdDataX,
      },
      T11: {
        upper: upperThresholdDataX,
        lower: lowerThresholdDataX,
      },
      T12: {
        upper: upperThresholdDataX,
        lower: lowerThresholdDataX,
      },
      T13: {
        upper: upperThresholdDataX,
        lower: lowerThresholdDataX,
      },
      T14: {
        upper: upperThresholdDataX,
        lower: lowerThresholdDataX,
      },
      T15: {
        upper: upperThresholdDataX,
        lower: lowerThresholdDataX,
      },
    };

    Object.entries(latestData)
      .filter(([key]) => key !== "Time" && key !== "_id")
      .forEach(([key, value]) => {
        const sensorValue = parseFloat(value);

        // Check if a threshold mapping exists for the sensor (T1, T4, etc.)
        const threshold = thresholdMapping[key];

        if (threshold) {
          const upperThresholdValue = threshold.upper[index];
          const lowerThresholdValue = threshold.lower[index];

          // Check if the sensor value is outside the threshold
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
        }
      });
  }

  const alertKeys = alertsArray.map((alert) => Object.keys(alert)[0]);

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

  const [lineData, setLineData] = useState({
    labels: [],
    datasets: [],
  });

  const allLabels = Array.from({ length: 733 }, (_, i) => Math.floor(i / 12));

  // Only display the unique section labels and leave the rest as empty strings
  const displayLabels = allLabels.map((label, index) =>
    index % 12 === 0 ? label.toString() : ""
  );

  // console.log("display labels", displayLabels);
  // console.log("threshold graph data", thresholdGraphData);

  const initialData = {
    labels: displayLabels,
    datasets: [], // Start with an empty datasets array
  };

  // const initialData = {
  //   labels: displayLabels,
  //   datasets: [
  //     {
  //       label: "Upper Threshold",
  //       data: upperThresholdData,
  //       borderColor: "red",
  //       borderWidth: 1.5,
  //       pointRadius: 0,
  //       pointHoverRadius: 0,
  //       fill: false,
  //       tooltip: { enabled: false },
  //       borderDash: [5, 5],
  //     },
  //     {
  //       label: "Lower Threshold",
  //       data: lowerThresholdData,
  //       borderColor: "red",
  //       borderWidth: 1.5,
  //       pointRadius: 0,
  //       pointHoverRadius: 0,
  //       fill: false,
  //       tooltip: { enabled: false },
  //       borderDash: [5, 5],
  //     },
  //   ],
  // };

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

  // useEffect(() => {
  //   if (thresholdGraphData && thresholdGraphData.length > 0) {
  //     const reversedData = [...thresholdGraphData].reverse();

  //     const sensorData = fixedThermocouples.map((sensor) => {
  //       return reversedData.map((item) => item[sensor]);
  //     });

  //     const datasets = fixedThermocouples.map((sensor, index) => {
  //       return {
  //         label: sensor,
  //         data: sensorData[index],
  //         borderColor: sensorColors[index],
  //         borderWidth: 2,
  //         pointRadius: 0,
  //         pointHoverRadius: 0,
  //         fill: false,
  //         hidden: index !== 0,
  //       };
  //     });

  //     setLineData2((prevData) => ({
  //       ...prevData,
  //       datasets: [prevData.datasets[0], prevData.datasets[1], ...datasets],
  //     }));
  //   }
  // }, [thresholdGraphData]);

  useEffect(() => {
    if (thresholdGraphData && thresholdGraphData.length > 0) {
      const reversedData = [...thresholdGraphData].reverse();

      // Extract sensor data for each thermocouple
      const sensorData = fixedThermocouples.map((sensor) =>
        reversedData.map((item) => item[sensor])
      );

      // Create datasets for the thermocouples
      const sensorDatasets = fixedThermocouples.map((sensor, index) => ({
        label: sensor,
        data: sensorData[index],
        borderColor: sensorColors[index],
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
        fill: false,
        // hidden: index !== 0, // Hide all sensors except the first one by default
        hidden: !clickedLegends.includes(sensor),
      }));

      // Add Upper and Lower Threshold datasets
      const thresholdDatasets = [
        {
          label: "UT4,UT5,UT6",
          data: upperThresholdData456,
          borderColor: "red",
          borderWidth: 1.5,
          pointRadius: 0,
          pointHoverRadius: 0,
          fill: false,
          tooltip: { enabled: false },
          borderDash: [5, 5],
          hidden: !clickedLegends.some((legend) =>
            ["T4", "T5", "T6"].includes(legend)
          ),
        },
        {
          label: "LT4,LT5,LT6",
          data: lowerThresholdData456,
          borderColor: "red",
          borderWidth: 1.5,
          pointRadius: 0,
          pointHoverRadius: 0,
          fill: false,
          tooltip: { enabled: false },
          borderDash: [5, 5],
          hidden: !clickedLegends.some((legend) =>
            ["T4", "T5", "T6"].includes(legend)
          ),
        },
        {
          label: "UT1",
          data: upperThresholdDataT1,
          borderColor: "green",
          borderWidth: 1.5,
          pointRadius: 0,
          pointHoverRadius: 0,
          fill: false,
          tooltip: { enabled: false },
          borderDash: [5, 5],
          hidden: !clickedLegends.some((legend) => ["T1"].includes(legend)),
        },
        {
          label: "LT1",
          data: lowerThresholdDataT1,
          borderColor: "green",
          borderWidth: 1.5,
          pointRadius: 0,
          pointHoverRadius: 0,
          fill: false,
          tooltip: { enabled: false },
          borderDash: [5, 5],
          hidden: !clickedLegends.some((legend) => ["T1"].includes(legend)),
        },
        {
          label: "UT8",
          data: upperThresholdDataT8,
          borderColor: "blue",
          borderWidth: 1.5,
          pointRadius: 0,
          pointHoverRadius: 0,
          fill: false,
          tooltip: { enabled: false },
          borderDash: [5, 5],
          hidden: !clickedLegends.some((legend) => ["T8"].includes(legend)),
        },
        {
          label: "LT8",
          data: lowerThresholdDataT8,
          borderColor: "blue",
          borderWidth: 1.5,
          pointRadius: 0,
          pointHoverRadius: 0,
          fill: false,
          tooltip: { enabled: false },
          borderDash: [5, 5],
          hidden: !clickedLegends.some((legend) => ["T8"].includes(legend)),
        },
        {
          label: "UTX",
          data: upperThresholdDataX,
          borderColor: "black",
          borderWidth: 1.5,
          pointRadius: 0,
          pointHoverRadius: 0,
          fill: false,
          tooltip: { enabled: false },
          borderDash: [5, 5],
          hidden: !clickedLegends.some((legend) =>
            [
              "T2",
              "T3",
              "T7",
              "T9",
              "T10",
              "T11",
              "T12",
              "T13",
              "T14",
              "T15",
            ].includes(legend)
          ),
        },
        {
          label: "LTX",
          data: lowerThresholdDataX,
          borderColor: "black",
          borderWidth: 1.5,
          pointRadius: 0,
          pointHoverRadius: 0,
          fill: false,
          tooltip: { enabled: false },
          borderDash: [5, 5],
          hidden: !clickedLegends.some((legend) =>
            [
              "T2",
              "T3",
              "T7",
              "T9",
              "T10",
              "T11",
              "T12",
              "T13",
              "T14",
              "T15",
            ].includes(legend)
          ),
        },
      ];

      // Update the state with the thresholds and actual sensor data
      setLineData2({
        labels: displayLabels,
        datasets: [...thresholdDatasets, ...sensorDatasets],
      });
    }
  }, [thresholdGraphData]);

  const lineOptions2 = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      plugins: {
        legend: {
          display: false,
          // labels: {
          //   filter: (legendItem) => {
          //     if (
          //       legendItem.datasetIndex === 0 ||
          //       legendItem.datasetIndex === 1 ||
          //       legendItem.datasetIndex === 2 ||
          //       legendItem.datasetIndex === 3
          //     ) {
          //       return false; // Hide the "Upper Threshold" and "Lower Threshold" from the legend
          //     }
          //     return true; // Keep other legends visible and interactive
          //   },
          //   color: "#4B5563",
          //   font: {
          //     size: 9,
          //   },
          //   boxWidth: 15,
          //   padding: 5,
          // },
        },
        zoom: {
          pan: {
            enabled: true,
            mode: "x",
          },
          zoom: {
            mode: "x",
            wheel: {
              enabled: !isMobile,
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

  const lineOptions3 = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      plugins: {
        legend: {
          position: "top",
          align: "start",
          labels: {
            color: "#4B5563",
            font: {
              size: 9,
            },
            boxWidth: 12,
            padding: 5,
            filter: (legendItem) => {
              return (
                legendItem.text !== "Upper Threshold" &&
                legendItem.text !== "Lower Threshold"
              );
            },
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
              enabled: !isMobile,
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

      const sensorLabels = Array.from({ length: 15 }, (_, i) => `T${i + 1}`);

      setLineData3((prevData) => ({
        ...prevData,
        labels: prevData.labels,
        datasets: [
          // Keep the original datasets (upper and lower threshold)
          ...prevData.datasets.filter(
            (dataset) =>
              dataset.label === "Upper Threshold" ||
              dataset.label === "Lower Threshold"
          ),
          // Add the new sensor datasets
          ...sensorData.map((data, i) => ({
            label: sensorLabels[i],
            data,
            borderColor: sensorColors[i],
            borderWidth: 1.25,
            pointRadius: 0,
            pointHoverRadius: 0,
          })),
        ],
      }));
    }
  }, [previousProcessData]);

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

        if (differenceInMinutes < 6) {
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

        const sensorData = fixedThermocouples.map((sensor) => {
          return reversedData.map((item) => item[sensor]);
        });

        const sensorLabels = fixedThermocouples;

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
              enabled: !isMobile,
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
            // "https://hindalco.xyma.live/backend/updateHindalcoProcess",
            "http://localhost:4000/backend/updateHindalcoProcess",
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
          // "https://hindalco.xyma.live/backend/updateHindalcoProcess",
          "http://localhost:4000/backend/updateHindalcoProcess",
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
      setPreviousProcessDataLoading(true);
      const split = selectedDateRange.split("to");
      const startDate = split[0];
      const stopDate = split[1];

      const response = await axios.get(
        // "https://hindalco.xyma.live/backend/getHindalcoReport",
        "http://localhost:4000/backend/getHindalcoReport",
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
    } catch (error) {
      console.error("Error getting date range data", error);
    }
  };

  return (
    <div className="relative xl:h-screen p-4 flex flex-col gap-2">
      {/* top bar - h-[10%] */}
      <div className="xl:h-[10%]">
        <Navbar />
      </div>

      {/* main content 1 h-[50%] */}
      <div className="xl:h-[55%] flex flex-col xl:flex-row gap-2 ">
        {/* 2d image */}
        <div className="w-full xl:w-[70%] flex flex-col gap-4 md:gap-2 rounded-xl p-2 bg-[#dde3f1]">
          <div className=" flex flex-col md:flex-row gap-4 md:gap-2 xl:h-[55%] text-sm 2xl:text-base">
            <div className="relative w-full md:w-[55%] p-0 xl:p-4 flex items-center justify-center h-[200px] xl:h-auto">
              {/* 2d model */}
              <div className="relative font-bold">
                <img
                  src={potlineTop2}
                  className="max-w-[320px] md:max-w-[410px]"
                />

                <div className="absolute top-4 right-14 text-sm font-medium">
                  Side A
                </div>

                <div className="absolute bottom-0 right-12 text-sm font-medium">
                  Side B
                </div>

                <div className="absolute bottom-[35px] md:bottom-[48px] left-[15px] md:left-[24px] flex items-center gap-0.5">
                  <div
                    className={`duration-200 ${
                      fixedThermocouples.includes("T2")
                        ? alertKeys.includes("T2")
                          ? "text-red-500"
                          : "text-[#23439b]"
                        : "text-gray-500"
                    }`}
                  >
                    T2
                  </div>
                  <div
                    className={`h-4 md:h-5 w-4 md:w-5 shadow-2xl rounded-full border border-white duration-200 ${
                      fixedThermocouples.includes("T2")
                        ? alertKeys.includes("T2")
                          ? "card-indicator"
                          : "bg-[#23439b]"
                        : "bg-gray-500"
                    }`}
                  ></div>
                </div>

                <div className="absolute bottom-[58px] md:bottom-[75px] left-[20px] md:left-[30px] flex items-center gap-0.5">
                  <div
                    className={`duration-200 ${
                      fixedThermocouples.includes("T1")
                        ? alertKeys.includes("T1")
                          ? "text-red-500"
                          : "text-[#23439b]"
                        : "text-gray-500"
                    }`}
                  >
                    T1
                  </div>
                  <div
                    className={`h-4 md:h-5 w-4 md:w-5 shadow-2xl rounded-full border border-white duration-200 ${
                      fixedThermocouples.includes("T1")
                        ? alertKeys.includes("T1")
                          ? "card-indicator"
                          : "bg-[#23439b]"
                        : "bg-gray-500"
                    }`}
                  ></div>
                </div>

                <div className="absolute bottom-[80px] md:bottom-[105px] left-[15px] md:left-[25px] flex items-center gap-0.5">
                  <div
                    className={`duration-200 ${
                      fixedThermocouples.includes("T12")
                        ? alertKeys.includes("T12")
                          ? "text-red-500"
                          : "text-[#23439b]"
                        : "text-gray-500"
                    }`}
                  >
                    T12
                  </div>
                  <div
                    className={`h-4 md:h-5 w-4 md:w-5 shadow-2xl rounded-full border border-white duration-200 ${
                      fixedThermocouples.includes("T12")
                        ? alertKeys.includes("T12")
                          ? "card-indicator"
                          : "bg-[#23439b]"
                        : "bg-gray-500"
                    }`}
                  ></div>
                </div>

                <div className="absolute bottom-[85px] md:bottom-[110px] left-[60px] md:left-[80px] flex flex-col items-center gap-0.5">
                  <div
                    className={`duration-200 ${
                      fixedThermocouples.includes("T11")
                        ? alertKeys.includes("T11")
                          ? "text-red-500"
                          : "text-[#23439b]"
                        : "text-gray-500"
                    }`}
                  >
                    T11
                  </div>
                  <div
                    className={`h-4 md:h-5 w-4 md:w-5 shadow-2xl rounded-full border border-white duration-200 ${
                      fixedThermocouples.includes("T11")
                        ? alertKeys.includes("T11")
                          ? "card-indicator"
                          : "bg-[#23439b]"
                        : "bg-gray-500"
                    }`}
                  ></div>
                </div>

                <div className="absolute bottom-[58px] md:bottom-[75px] left-[75px] md:left-[96px] flex items-center gap-0.5">
                  <div
                    className={`duration-200 ${
                      fixedThermocouples.includes("T4")
                        ? alertKeys.includes("T4")
                          ? "text-red-500"
                          : "text-[#23439b]"
                        : "text-gray-500"
                    }`}
                  >
                    T4
                  </div>
                  <div
                    className={`h-4 md:h-5 w-4 md:w-5 shadow-2xl rounded-full border border-white duration-200 ${
                      fixedThermocouples.includes("T4")
                        ? alertKeys.includes("T4")
                          ? "card-indicator"
                          : "bg-[#23439b]"
                        : "bg-gray-500"
                    }`}
                  ></div>
                </div>

                <div className="absolute bottom-[58px] md:bottom-[75px] left-[135px] md:left-[165px] flex items-center gap-0.5">
                  <div
                    className={`duration-200 ${
                      fixedThermocouples.includes("T5")
                        ? alertKeys.includes("T5")
                          ? "text-red-500"
                          : "text-[#23439b]"
                        : "text-gray-500"
                    }`}
                  >
                    T5
                  </div>
                  <div
                    className={`h-4 md:h-5 w-4 md:w-5 shadow-2xl rounded-full border border-white duration-200 ${
                      fixedThermocouples.includes("T5")
                        ? alertKeys.includes("T5")
                          ? "card-indicator"
                          : "bg-[#23439b]"
                        : "bg-gray-500"
                    }`}
                  ></div>
                </div>

                <div className="absolute bottom-[58px] md:bottom-[75px] left-[185px] md:left-[240px] flex items-center gap-0.5">
                  <div
                    className={`duration-200 ${
                      fixedThermocouples.includes("T6")
                        ? alertKeys.includes("T6")
                          ? "text-red-500"
                          : "text-[#23439b]"
                        : "text-gray-500"
                    }`}
                  >
                    T6
                  </div>
                  <div
                    className={`h-4 md:h-5 w-4 md:w-5 shadow-2xl rounded-full border border-white duration-200 ${
                      fixedThermocouples.includes("T6")
                        ? alertKeys.includes("T6")
                          ? "card-indicator"
                          : "bg-[#23439b]"
                        : "bg-gray-500"
                    }`}
                  ></div>
                </div>

                <div className="absolute bottom-[58px] md:bottom-[75px] left-[267px] md:left-[345px] flex items-center gap-0.5">
                  <div
                    className={`h-4 md:h-5 w-4 md:w-5 shadow-2xl rounded-full border border-white duration-200 ${
                      fixedThermocouples.includes("T8")
                        ? alertKeys.includes("T8")
                          ? "card-indicator"
                          : "bg-[#23439b]"
                        : "bg-gray-500"
                    }`}
                  ></div>
                  <div
                    className={`duration-200 ${
                      fixedThermocouples.includes("T8")
                        ? alertKeys.includes("T8")
                          ? "text-red-500"
                          : "text-[#23439b]"
                        : "text-gray-500"
                    }`}
                  >
                    T8
                  </div>
                </div>

                <div className="absolute bottom-[85px] md:bottom-[110px] left-[150px] md:left-[215px] flex flex-col items-center gap-0.5">
                  <div
                    className={`duration-200 ${
                      fixedThermocouples.includes("T14")
                        ? alertKeys.includes("T14")
                          ? "text-red-500"
                          : "text-[#23439b]"
                        : "text-gray-500"
                    }`}
                  >
                    T14
                  </div>
                  <div
                    className={`h-4 md:h-5 w-4 md:w-5 shadow-2xl rounded-full border border-white duration-200 ${
                      fixedThermocouples.includes("T14")
                        ? alertKeys.includes("T14")
                          ? "card-indicator"
                          : "bg-[#23439b]"
                        : "bg-gray-500"
                    }`}
                  ></div>
                </div>

                <div className="absolute bottom-[85px] md:bottom-[110px] left-[175px] md:left-[245px] flex flex-col items-center gap-0.5">
                  <div
                    className={`duration-200 ${
                      fixedThermocouples.includes("T10")
                        ? alertKeys.includes("T10")
                          ? "text-red-500"
                          : "text-[#23439b]"
                        : "text-gray-500"
                    }`}
                  >
                    T10
                  </div>
                  <div
                    className={`h-4 md:h-5 w-4 md:w-5 shadow-2xl rounded-full border border-white duration-200 ${
                      fixedThermocouples.includes("T10")
                        ? alertKeys.includes("T10")
                          ? "card-indicator"
                          : "bg-[#23439b]"
                        : "bg-gray-500"
                    }`}
                  ></div>
                </div>

                <div className="absolute bottom-[85px] md:bottom-[105px] left-[265px] md:left-[343px] flex items-center gap-0.5">
                  <div
                    className={`h-4 md:h-5 w-4 md:w-5 shadow-2xl rounded-full border border-white duration-200 ${
                      fixedThermocouples.includes("T9")
                        ? alertKeys.includes("T9")
                          ? "card-indicator"
                          : "bg-[#23439b]"
                        : "bg-gray-500"
                    }`}
                  ></div>
                  <div
                    className={`duration-200 ${
                      fixedThermocouples.includes("T9")
                        ? alertKeys.includes("T9")
                          ? "text-red-500"
                          : "text-[#23439b]"
                        : "text-gray-500"
                    }`}
                  >
                    T9
                  </div>
                </div>

                <div className="absolute bottom-[10px] md:bottom-[15px] left-[105px] md:left-[130px] flex flex-col items-center gap-2">
                  <div
                    className={`h-4 md:h-5 w-4 md:w-5 shadow-2xl rounded-full border border-white duration-200 ${
                      fixedThermocouples.includes("T3")
                        ? alertKeys.includes("T3")
                          ? "card-indicator"
                          : "bg-[#23439b]"
                        : "bg-gray-500"
                    }`}
                  ></div>
                  <div
                    className={`duration-200 ${
                      fixedThermocouples.includes("T3")
                        ? alertKeys.includes("T3")
                          ? "text-red-500"
                          : "text-[#23439b]"
                        : "text-gray-500"
                    }`}
                  >
                    T3
                  </div>
                </div>

                <div className="absolute bottom-[10px] md:bottom-[15px] left-[240px] md:left-[305px] flex flex-col items-center gap-2">
                  <div
                    className={`h-4 md:h-5 w-4 md:w-5 shadow-2xl rounded-full border border-white duration-200 ${
                      fixedThermocouples.includes("T7")
                        ? alertKeys.includes("T7")
                          ? "card-indicator"
                          : "bg-[#23439b]"
                        : "bg-gray-500"
                    }`}
                  ></div>
                  <div
                    className={`duration-200 ${
                      fixedThermocouples.includes("T7")
                        ? alertKeys.includes("T7")
                          ? "text-red-500"
                          : "text-[#23439b]"
                        : "text-gray-500"
                    }`}
                  >
                    T7
                  </div>
                </div>

                <div className="absolute bottom-[10px] md:bottom-[15px] left-[265px] md:left-[340px] flex flex-col items-center gap-2">
                  <div
                    className={`h-4 md:h-5 w-4 md:w-5 shadow-2xl rounded-full border border-white duration-200 ${
                      fixedThermocouples.includes("T13")
                        ? alertKeys.includes("T13")
                          ? "card-indicator"
                          : "bg-[#23439b]"
                        : "bg-gray-500"
                    }`}
                  ></div>
                  <div
                    className={`duration-200 ${
                      fixedThermocouples.includes("T13")
                        ? alertKeys.includes("T13")
                          ? "text-red-500"
                          : "text-[#23439b]"
                        : "text-gray-500"
                    }`}
                  >
                    T13
                  </div>
                </div>

                <div className="absolute bottom-[10px] md:bottom-[15px] left-[180px] md:left-[230px] flex flex-col items-center gap-2">
                  <div
                    className={`h-4 md:h-5 w-4 md:w-5 shadow-2xl rounded-full border border-white duration-200 ${
                      fixedThermocouples.includes("T15")
                        ? alertKeys.includes("T15")
                          ? "card-indicator"
                          : "bg-[#23439b]"
                        : "bg-gray-500"
                    }`}
                  ></div>
                  <div
                    className={`duration-200 ${
                      fixedThermocouples.includes("T15")
                        ? alertKeys.includes("T15")
                          ? "text-red-500"
                          : "text-[#23439b]"
                        : "text-gray-500"
                    }`}
                  >
                    T15
                  </div>
                </div>
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
                    data-tooltip-content="No data is being recieved for more than 6 minutes"
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
              className={`relative py-1 px-2 text-sm 2xl:text-lg flex items-center justify-center gap-1 rounded-md shadow-xl ${
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
              <div className="border border-black">
                <div
                  className={`text-center font-medium  ${
                    viewAllCards && "text-xs 2xl:text-sm"
                  }`}
                >
                  T1
                </div>
                <div
                  className={`font-bold text-center ${
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
                <div className="xl:absolute xl:top-0 xl:left-0.5 text-xs font-medium">
                  High Deviation
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
                  className={`font-bold text-center ${
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
                  className={`font-bold text-center ${
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
              className={`relative py-1 px-2 text-sm 2xl:text-lg flex items-center justify-center gap-1 rounded-md  ${
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
                  className={`font-bold text-center ${
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

                {t4Status &&
                  (Array.isArray(t4Status)
                    ? t4Status.length > 0
                    : Object.keys(t4Status).length > 0) && (
                    <div
                      className="xl:absolute flex items-center  top-0 left-0.5 text-xs font-medium text-red-500 bg-white px-1 rounded-md mb-1 xl:mb-0"
                      data-tooltip-id="tooltip-style"
                      data-tooltip-content={`Required Δ: ${t4Status.DeviationUsed}°C | Current Δ: ${t4Status.Difference}°C`}
                    >
                      {t4Status.Hour}&nbsp;:&nbsp;{t4Status.Status}&nbsp;
                      <TbDelta />
                    </div>
                  )}
              </div>
            </div>

            <div
              className={`relative py-1 px-2 text-sm 2xl:text-lg flex items-center justify-center gap-1 rounded-md  ${
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
                  className={`font-bold text-center ${
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

                {t5Status &&
                  (Array.isArray(t5Status)
                    ? t5Status.length > 0
                    : Object.keys(t5Status).length > 0) && (
                    <div
                      className="xl:absolute flex items-center  top-0 left-0.5 text-xs font-medium text-red-500 bg-white px-1 rounded-md mb-1 xl:mb-0"
                      data-tooltip-id="tooltip-style"
                      data-tooltip-content={`Required Δ: ${t5Status.DeviationUsed}°C | Current Δ: ${t5Status.Difference}°C`}
                    >
                      {t5Status.Hour}&nbsp;:&nbsp;{t5Status.Status}&nbsp;
                      <TbDelta />
                    </div>
                  )}
              </div>
            </div>

            <div
              className={`relative py-1 px-2 text-sm 2xl:text-lg flex items-center justify-center gap-1 rounded-md  ${
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
                  className={`font-bold text-center ${
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

                {t6Status &&
                  (Array.isArray(t6Status)
                    ? t6Status.length > 0
                    : Object.keys(t6Status).length > 0) && (
                    <div
                      className="xl:absolute flex items-center  top-0 left-0.5 text-xs font-medium text-red-500 bg-white px-1 rounded-md mb-1 xl:mb-0"
                      data-tooltip-id="tooltip-style"
                      data-tooltip-content={`Required Δ: ${t6Status.DeviationUsed}°C | Current Δ: ${t6Status.Difference}°C`}
                    >
                      {t6Status.Hour}&nbsp;:&nbsp;{t6Status.Status}&nbsp;
                      <TbDelta />
                    </div>
                  )}
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
                  className={`font-bold text-center ${
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
                  className={`font-bold text-center ${
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
                  className={`font-bold text-center ${
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
                  className={`font-bold text-center ${
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
                      className={`font-bold text-center ${
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
                      className={`font-bold text-center ${
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
                      className={`font-bold text-center ${
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
                      className={`font-bold text-center ${
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
                      className={`font-bold text-center ${
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
                        className="bg-green-500 text-white text-xs 2xl:text-base font-medium rounded-md px-1 py-0.5 hover:scale-110 duration-200"
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
                    // window.location.reload();
                  }}
                  className="flex gap-1 items-center bg-[#23439b] text-white text-xs 2xl:text-base font-medium rounded-md px-1 py-0.5 hover:scale-110 duration-200"
                >
                  <TiArrowLeftThick className="text-lg 2xl:text-xl" />
                  Live&nbsp;Data
                </button>

                {previousSelectedDateRange && thresholdGraphDateRange && (
                  <div className="flex gap-2 items-center">
                    <div className="text-xs 2xl:text-base font-semibold rounded-md px-1 py-0.5 bg-white text-[#23439b]">
                      {
                        thresholdGraphDateRange.find(
                          (data) =>
                            previousSelectedDateRange ===
                            `${data.startTime}to${data.stopTime}`
                        )?.lineName
                      }
                      , Pot Number:{" "}
                      {
                        thresholdGraphDateRange.find(
                          (data) =>
                            previousSelectedDateRange ===
                            `${data.startTime}to${data.stopTime}`
                        )?.potNumber
                      }
                    </div>

                    <div
                      data-tooltip-id="tooltip-style"
                      data-tooltip-content={`Selected Thermocouples: ${
                        thresholdGraphDateRange
                          .find(
                            (data) =>
                              previousSelectedDateRange ===
                              `${data.startTime}to${data.stopTime}`
                          )
                          ?.selectedThermocouples?.join(", ") || "None"
                      }`}
                    >
                      <FiInfo className="text-lg 2xl:text-xl text-[#23439b]" />
                    </div>
                  </div>
                )}

                <div className="flex gap-1 text-xs 2xl:text-base font-medium items-center">
                  <select
                    onChange={(e) => {
                      getProcessDateRangeData(e.target.value);
                      setPreviousSelectedDateRange(e.target.value);
                    }}
                    className="rounded-md px-1 py-0.5 cursor-pointer"
                    value={previousSelectedDateRange}
                  >
                    <option value="" disabled>
                      Pick Date Range
                    </option>
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
                <Line data={lineData3} options={lineOptions3} width={"100%"} />
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
      <div className="h-[35%] rounded-xl flex flex-col-reverse md:flex-row gap-2 ">
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

            <div className="relative text-xs md:text-sm font-bold">
              <img
                src={potlineTop2}
                className="max-w-[300px] md:max-w-[400px]"
              />

              <div
                className="absolute bottom-[35px] md:bottom-[48px] left-[15px] md:left-[24px] flex items-center gap-0.5 cursor-pointer hover:scale-125 duration-200"
                onClick={() => toggleThermocouple("T2")}
              >
                <div
                  className={` duration-200 ${
                    selectedThermocouples.includes("T2")
                      ? "text-green-500"
                      : "text-[#23439b]"
                  }`}
                >
                  T2
                </div>
                <div
                  className={`h-4 md:h-5 w-4 md:w-5 shadow-2xl rounded-full border border-white duration-200 ${
                    selectedThermocouples.includes("T2")
                      ? "bg-green-500"
                      : "bg-[#23439b]"
                  }`}
                ></div>
              </div>

              <div
                className="absolute bottom-[55px] md:bottom-[74px] left-[20px] md:left-[28px] flex items-center gap-0.5 cursor-pointer hover:scale-125 duration-200"
                onClick={() => toggleThermocouple("T1")}
              >
                <div
                  className={` duration-200 ${
                    selectedThermocouples.includes("T1")
                      ? "text-green-500"
                      : "text-[#23439b]"
                  }`}
                >
                  T1
                </div>
                <div
                  className={`h-4 md:h-5 w-4 md:w-5 shadow-2xl rounded-full border border-white duration-200 ${
                    selectedThermocouples.includes("T1")
                      ? "bg-green-500"
                      : "bg-[#23439b]"
                  }`}
                ></div>
              </div>

              <div
                className="absolute bottom-[80px] md:bottom-[100px] left-[15px] md:left-[22px] flex items-center gap-0.5 cursor-pointer hover:scale-125 duration-200"
                onClick={() => toggleThermocouple("T12")}
              >
                <div
                  className={` duration-200 ${
                    selectedThermocouples.includes("T12")
                      ? "text-green-500"
                      : "text-[#23439b]"
                  }`}
                >
                  T12
                </div>
                <div
                  className={`h-4 md:h-5 w-4 md:w-5 shadow-2xl rounded-full border border-white duration-200 ${
                    selectedThermocouples.includes("T12")
                      ? "bg-green-500"
                      : "bg-[#23439b]"
                  }`}
                ></div>
              </div>

              <div
                className="absolute bottom-[80px] md:bottom-[105px] left-[60px] md:left-[80px] flex flex-col items-center gap-0.5 cursor-pointer hover:scale-125 duration-200"
                onClick={() => toggleThermocouple("T11")}
              >
                <div
                  className={` duration-200 ${
                    selectedThermocouples.includes("T11")
                      ? "text-green-500"
                      : "text-[#23439b]"
                  }`}
                >
                  T11
                </div>
                <div
                  className={`h-4 md:h-5 w-4 md:w-5 shadow-2xl rounded-full border border-white duration-200 ${
                    selectedThermocouples.includes("T11")
                      ? "bg-green-500"
                      : "bg-[#23439b]"
                  }`}
                ></div>
              </div>

              <div
                className="absolute bottom-[55px] md:bottom-[74px] left-[65px] md:left-[96px] flex items-center gap-0.5 cursor-pointer hover:scale-125 duration-200"
                onClick={() => toggleThermocouple("T4")}
              >
                <div
                  className={` duration-200 ${
                    selectedThermocouples.includes("T4")
                      ? "text-green-500"
                      : "text-[#23439b]"
                  }`}
                >
                  T4
                </div>
                <div
                  className={`h-4 md:h-5 w-4 md:w-5 shadow-2xl rounded-full border border-white duration-200 ${
                    selectedThermocouples.includes("T4")
                      ? "bg-green-500"
                      : "bg-[#23439b]"
                  }`}
                ></div>
              </div>

              <div
                className="absolute bottom-[55px] md:bottom-[74px] left-[125px] md:left-[165px] flex items-center gap-0.5 cursor-pointer hover:scale-125 duration-200"
                onClick={() => toggleThermocouple("T5")}
              >
                <div
                  className={` duration-200 ${
                    selectedThermocouples.includes("T5")
                      ? "text-green-500"
                      : "text-[#23439b]"
                  }`}
                >
                  T5
                </div>
                <div
                  className={`h-4 md:h-5 w-4 md:w-5 shadow-2xl rounded-full border border-white duration-200 ${
                    selectedThermocouples.includes("T5")
                      ? "bg-green-500"
                      : "bg-[#23439b]"
                  }`}
                ></div>
              </div>

              <div
                className="absolute bottom-[55px] md:bottom-[74px] left-[175px] md:left-[240px] flex items-center gap-0.5 cursor-pointer hover:scale-125 duration-200"
                onClick={() => toggleThermocouple("T6")}
              >
                <div
                  className={` duration-200 ${
                    selectedThermocouples.includes("T6")
                      ? "text-green-500"
                      : "text-[#23439b]"
                  }`}
                >
                  T6
                </div>
                <div
                  className={`h-4 md:h-5 w-4 md:w-5 shadow-2xl rounded-full border border-white duration-200 ${
                    selectedThermocouples.includes("T6")
                      ? "bg-green-500"
                      : "bg-[#23439b]"
                  }`}
                ></div>
              </div>

              <div
                className="absolute bottom-[55px] md:bottom-[74px] left-[250px] md:left-[335px] flex items-center gap-0.5 cursor-pointer hover:scale-125 duration-200"
                onClick={() => toggleThermocouple("T8")}
              >
                <div
                  className={`h-4 md:h-5 w-4 md:w-5 shadow-2xl rounded-full border border-white duration-200 ${
                    selectedThermocouples.includes("T8")
                      ? "bg-green-500"
                      : "bg-[#23439b]"
                  }`}
                ></div>
                <div
                  className={` duration-200 ${
                    selectedThermocouples.includes("T8")
                      ? "text-green-500"
                      : "text-[#23439b]"
                  }`}
                >
                  T8
                </div>
              </div>

              <div
                className="absolute bottom-[80px] md:bottom-[105px] left-[160px] md:left-[215px] flex flex-col items-center gap-0.5 cursor-pointer hover:scale-125 duration-200"
                onClick={() => toggleThermocouple("T14")}
              >
                <div
                  className={` duration-200 ${
                    selectedThermocouples.includes("T14")
                      ? "text-green-500"
                      : "text-[#23439b]"
                  }`}
                >
                  T14
                </div>
                <div
                  className={`h-4 md:h-5 w-4 md:w-5 shadow-2xl rounded-full border border-white duration-200 ${
                    selectedThermocouples.includes("T14")
                      ? "bg-green-500"
                      : "bg-[#23439b]"
                  }`}
                ></div>
              </div>

              <div
                className="absolute bottom-[80px] md:bottom-[105px] left-[185px] md:left-[245px] flex flex-col items-center gap-0.5 cursor-pointer hover:scale-125 duration-200"
                onClick={() => toggleThermocouple("T10")}
              >
                <div
                  className={` duration-200 ${
                    selectedThermocouples.includes("T10")
                      ? "text-green-500"
                      : "text-[#23439b]"
                  }`}
                >
                  T10
                </div>
                <div
                  className={`h-4 md:h-5 w-4 md:w-5 shadow-2xl rounded-full border border-white duration-200 ${
                    selectedThermocouples.includes("T10")
                      ? "bg-green-500"
                      : "bg-[#23439b]"
                  }`}
                ></div>
              </div>

              <div
                className="absolute bottom-[80px] md:bottom-[105px] left-[245px] md:left-[330px] flex flex-col items-center gap-0.5 cursor-pointer hover:scale-125 duration-200"
                onClick={() => toggleThermocouple("T9")}
              >
                <div
                  className={` duration-200 ${
                    selectedThermocouples.includes("T9")
                      ? "text-green-500"
                      : "text-[#23439b]"
                  }`}
                >
                  T9
                </div>
                <div
                  className={`h-4 md:h-5 w-4 md:w-5 shadow-2xl rounded-full border border-white duration-200 ${
                    selectedThermocouples.includes("T9")
                      ? "bg-green-500"
                      : "bg-[#23439b]"
                  }`}
                ></div>
              </div>

              <div
                className="absolute bottom-[12px] md:bottom-[15px] left-[95px] md:left-[130px] flex flex-col items-center gap-1.5 cursor-pointer hover:scale-125 duration-200"
                onClick={() => toggleThermocouple("T3")}
              >
                <div
                  className={`h-4 md:h-5 w-4 md:w-5 shadow-2xl rounded-full border border-white duration-200 ${
                    selectedThermocouples.includes("T3")
                      ? "bg-green-500"
                      : "bg-[#23439b]"
                  }`}
                ></div>
                <div
                  className={` duration-200 ${
                    selectedThermocouples.includes("T3")
                      ? "text-green-500"
                      : "text-[#23439b]"
                  }`}
                >
                  T3
                </div>
              </div>

              <div
                className="absolute bottom-[12px] md:bottom-[15px] left-[230px] md:left-[305px] flex flex-col items-center gap-1.5 cursor-pointer hover:scale-125 duration-200"
                onClick={() => toggleThermocouple("T7")}
              >
                <div
                  className={`h-4 md:h-5 w-4 md:w-5 shadow-2xl rounded-full border border-white duration-200 ${
                    selectedThermocouples.includes("T7")
                      ? "bg-green-500"
                      : "bg-[#23439b]"
                  }`}
                ></div>
                <div
                  className={` duration-200 ${
                    selectedThermocouples.includes("T7")
                      ? "text-green-500"
                      : "text-[#23439b]"
                  }`}
                >
                  T7
                </div>
              </div>

              <div
                className="absolute bottom-[12px] md:bottom-[15px] left-[250px] md:left-[340px] flex flex-col items-center gap-1.5 cursor-pointer hover:scale-125 duration-200"
                onClick={() => toggleThermocouple("T13")}
              >
                <div
                  className={`h-4 md:h-5 w-4 md:w-5 shadow-2xl rounded-full border border-white duration-200 ${
                    selectedThermocouples.includes("T13")
                      ? "bg-green-500"
                      : "bg-[#23439b]"
                  }`}
                ></div>
                <div
                  className={` duration-200 ${
                    selectedThermocouples.includes("T13")
                      ? "text-green-500"
                      : "text-[#23439b]"
                  }`}
                >
                  T13
                </div>
              </div>

              <div
                className="absolute bottom-[12px] md:bottom-[15px] left-[170px] md:left-[230px] flex flex-col items-center gap-1.5 cursor-pointer hover:scale-125 duration-200"
                onClick={() => toggleThermocouple("T15")}
              >
                <div
                  className={`h-4 md:h-5 w-4 md:w-5 shadow-2xl rounded-full border border-white duration-200 ${
                    selectedThermocouples.includes("T15")
                      ? "bg-green-500"
                      : "bg-[#23439b]"
                  }`}
                ></div>
                <div
                  className={` duration-200 ${
                    selectedThermocouples.includes("T15")
                      ? "text-green-500"
                      : "text-[#23439b]"
                  }`}
                >
                  T15
                </div>
              </div>
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
          <div className="bg-white px-6 py-4 flex flex-col gap-6 rounded-md md:w-96">
            <div className="flex gap-2 items-center">
              <PiBatteryWarningBold className="text-2xl 2xl:text-3xl text-red-500" />
              <div className="text-base 2xl:text-lg font-medium">
                Low Device Battery!
              </div>
            </div>
            <div className="text-sm 2xl:text-base text-gray-700 text-center">
              The device battery is critically low. Please charge the data
              logger ASAP.
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
