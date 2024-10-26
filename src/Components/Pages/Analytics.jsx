import React from 'react';
import { useEffect, useState, useMemo } from "react";
import Navbar from "./Navbar";
import { LuCalendarSearch } from "react-icons/lu";
import { TbHash, TbSum } from "react-icons/tb";
import { BiScatterChart } from "react-icons/bi";
import { AiOutlineFieldTime } from "react-icons/ai";
import loadingGif from "../Assets/loading.gif";
import axios from "axios";
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

const Analytics = () => {
  const [selectedReportOption, setSelectedReportOption] = useState("averageData");
  const [count, setCount] = useState(100);
  const [enableCount, setEnableCount] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [avgFromDate, setAvgFromDate] = useState("");
  const [avgToDate, setAvgToDate] = useState("");
  const [analyticsData, setAnalyticsData] = useState([]);
  const [averageOption, setAverageOption] = useState('minute');
  const [intervalFromDate, setIntervalFromDate] = useState("");
  const [intervalToDate, setIntervalToDate] = useState("");
  const [intervalOption, setIntervalOption] = useState("minute");
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);

  // console.log('average option', averageOption);

  const projectName = "XY001";

  // console.log('selected sensors', selectedSensors)

  const [lineData, setLineData] = useState({
    labels: [],
    datasets: [],
  });

  const generateAnalyticsData = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      setTableLoading(true);
      const response = await axios.get(
        "https://hindalco.xyma.live/backend/getHindalcoReport",
        // "http://localhost:4000/backend/getHindalcoReport",
        {
          params: {
            projectName: projectName,
            avgFromDate: avgFromDate,
            avgToDate: avgToDate,
            fromDate: fromDate,
            toDate: toDate,
            count: count,
          },
        }
      );
      setAnalyticsData(response.data.data);
      setTableLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const generateAverageAnalyticsData = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      setTableLoading(true);
      const response = await axios.get(
        "https://hindalco.xyma.live/backend/getHindalcoAverageReport",
        // "http://localhost:4000/backend/getHindalcoAverageReport",
        {
          params: {
            projectName: projectName,
            avgFromDate: avgFromDate,
            avgToDate: avgToDate,
            averageOption: averageOption,
            intervalFromDate: intervalFromDate,
            intervalToDate: intervalToDate,
            intervalOption: intervalOption,
          },
        }
      );
      setAnalyticsData(response.data.data);
      setTableLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  console.log("analytics data", analyticsData);

  useEffect(() => {
    if (analyticsData && Array.isArray(analyticsData) && analyticsData.length > 0) {
      const reversedData = [...analyticsData].reverse();
      if(selectedReportOption !== 'averageData') {
        const lineLabels = reversedData.map((item) => {
          return item.Time;
        });

        const sensor1Data = reversedData.map((item) => item.T1);
        const sensor2Data = reversedData.map((item) => item.T2);
        const sensor3Data = reversedData.map((item) => item.T3);
        const sensor4Data = reversedData.map((item) => item.T4);
        const sensor5Data = reversedData.map((item) => item.T5);
        const sensor6Data = reversedData.map((item) => item.T6);
        const sensor7Data = reversedData.map((item) => item.T7);
        const sensor8Data = reversedData.map((item) => item.T8);
        const sensor9Data = reversedData.map((item) => item.T9);
        const sensor10Data = reversedData.map((item) => item.T10);
        const sensor11Data = reversedData.map((item) => item.T11);
        const sensor12Data = reversedData.map((item) => item.T12);
        const sensor13Data = reversedData.map((item) => item.T13);
        const sensor14Data = reversedData.map((item) => item.T14);
        const sensor15Data = reversedData.map((item) => item.T15);

        setLineData({
          labels: lineLabels,
          datasets: [
            {
              label: "T1",
              data: sensor1Data,
              borderColor: "rgb(240, 5, 5)", // Vibrant Red
              backgroundColor: "rgba(240, 5, 5, 0.2)",
              pointRadius: 0,
              pointHoverRadius: 0,
              borderWidth: 1.25,
            },
            {
              label: "T2",
              data: sensor2Data,
              borderColor: "rgb(0, 123, 255)", // Bright Blue
              backgroundColor: "rgba(0, 123, 255, 0.2)",
              pointRadius: 0,
              pointHoverRadius: 0,
              borderWidth: 1.25,
              hidden: true,
            },
            {
              label: "T3",
              data: sensor3Data,
              borderColor: "rgb(40, 167, 69)", // Bright Green
              backgroundColor: "rgba(40, 167, 69, 0.2)",
              pointRadius: 0,
              pointHoverRadius: 0,
              borderWidth: 1.25,
              hidden: true,
            },
            {
              label: "T4",
              data: sensor4Data,
              borderColor: "rgb(255, 193, 7)", // Bright Yellow
              backgroundColor: "rgba(255, 193, 7, 0.2)",
              pointRadius: 0,
              pointHoverRadius: 0,
              borderWidth: 1.25,
              hidden: true,
            },
            {
              label: "T5",
              data: sensor5Data,
              borderColor: "rgb(153, 50, 204)", // Vibrant Purple
              backgroundColor: "rgba(153, 50, 204, 0.2)",
              pointRadius: 0,
              pointHoverRadius: 0,
              borderWidth: 1.25,
              hidden: true,
            },
            {
              label: "T6",
              data: sensor6Data,
              borderColor: "rgb(163, 106, 2)", // Bright Orange
              backgroundColor: "rgba(163, 106, 2, 0.2)",
              pointRadius: 0,
              pointHoverRadius: 0,
              borderWidth: 1.25,
              hidden: true,
            },
            {
              label: "T7",
              data: sensor7Data,
              borderColor: "rgb(241, 110, 250)", // Vibrant Tomato Red
              backgroundColor: "rgba(241, 110, 250, 0.2)",
              pointRadius: 0,
              pointHoverRadius: 0,
              borderWidth: 1.25,
              hidden: true,
            },
            {
              label: "T8",
              data: sensor8Data,
              borderColor: "rgb(0, 255, 127)", // Medium Sea Green
              backgroundColor: "rgba(0, 255, 127, 0.2)",
              pointRadius: 0,
              pointHoverRadius: 0,
              borderWidth: 1.25,
              hidden: true,
            },
            {
              label: "T9",
              data: sensor9Data,
              borderColor: "rgb(148, 72, 148)", // Violet
              backgroundColor: "rgba(148, 72, 148, 0.2)",
              pointRadius: 0,
              pointHoverRadius: 0,
              borderWidth: 1.25,
              hidden: true,
            },
            {
              label: "T10",
              data: sensor10Data,
              borderColor: "rgb(240, 128, 128)", // Light Coral
              backgroundColor: "rgba(240, 128, 128, 0.2)",
              pointRadius: 0,
              pointHoverRadius: 0,
              borderWidth: 1.25,
              hidden: true,
            },
            {
              label: "T11",
              data: sensor11Data,
              borderColor: "rgb(255, 20, 147)", // Deep Pink
              backgroundColor: "rgba(255, 20, 147, 0.2)",
              pointRadius: 0,
              pointHoverRadius: 0,
              borderWidth: 1.25,
              hidden: true,
            },
            {
              label: "T12",
              data: sensor12Data,
              borderColor: "rgb(0, 191, 255)", // Deep Sky Blue
              backgroundColor: "rgba(0, 191, 255, 0.2)",
              pointRadius: 0,
              pointHoverRadius: 0,
              borderWidth: 1.25,
              hidden: true,
            },
            {
              label: "T13",
              data: sensor13Data,
              borderColor: "rgb(75, 0, 130)", // Indigo
              backgroundColor: "rgba(75, 0, 130, 0.2)",
              pointRadius: 0,
              pointHoverRadius: 0,
              borderWidth: 1.25,
              hidden: true,
            },
            {
              label: "T14",
              data: sensor14Data,
              borderColor: "rgb(255, 99, 71)", // Bright Coral
              backgroundColor: "rgba(255, 99, 71, 0.2)",
              pointRadius: 0,
              pointHoverRadius: 0,
              borderWidth: 1.25,
              hidden: true,
            },
            {
              label: "T15",
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
        // console.log('graph rendered');
      }

      else if(selectedReportOption === 'averageData') {
        const lineLabels = reversedData.map((item) => {
          return item.dateRange;
        });

        const avgSensor1Data = reversedData.map((item) => item.avgT1);
        const avgSensor2Data = reversedData.map((item) => item.avgT2);
        const avgSensor3Data = reversedData.map((item) => item.avgT3);
        const avgSensor4Data = reversedData.map((item) => item.avgT4);
        const avgSensor5Data = reversedData.map((item) => item.avgT5);
        const avgSensor6Data = reversedData.map((item) => item.avgT6);
        const avgSensor7Data = reversedData.map((item) => item.avgT7);
        const avgSensor8Data = reversedData.map((item) => item.avgT8);
        const avgSensor9Data = reversedData.map((item) => item.avgT9);
        const avgSensor10Data = reversedData.map((item) => item.avgT10);
        const avgSensor11Data = reversedData.map((item) => item.avgT11);
        const avgSensor12Data = reversedData.map((item) => item.avgT12);
        const avgSensor13Data = reversedData.map((item) => item.avgT13);
        const avgSensor14Data = reversedData.map((item) => item.avgT14);
        const avgSensor15Data = reversedData.map((item) => item.avgT15);

        setLineData({
          labels: lineLabels,
          datasets: [
            {
              label: "avgT1",
              data: avgSensor1Data,
              borderColor: "rgb(240, 5, 5)", // Vibrant Red
              backgroundColor: "rgba(240, 5, 5, 0.2)",
              pointRadius: 0,
              pointHoverRadius: 0,
              borderWidth: 1.25,
            },
            {
              label: "avgT2",
              data: avgSensor2Data,
              borderColor: "rgb(0, 123, 255)", // Bright Blue
              backgroundColor: "rgba(0, 123, 255, 0.2)",
              pointRadius: 0,
              pointHoverRadius: 0,
              borderWidth: 1.25,
              hidden: true,
            },
            {
              label: "avgT3",
              data: avgSensor3Data,
              borderColor: "rgb(40, 167, 69)", // Bright Green
              backgroundColor: "rgba(40, 167, 69, 0.2)",
              pointRadius: 0,
              pointHoverRadius: 0,
              borderWidth: 1.25,
              hidden: true,
            },
            {
              label: "avgT4",
              data: avgSensor4Data,
              borderColor: "rgb(255, 193, 7)", // Bright Yellow
              backgroundColor: "rgba(255, 193, 7, 0.2)",
              pointRadius: 0,
              pointHoverRadius: 0,
              borderWidth: 1.25,
              hidden: true,
            },
            {
              label: "avgT5",
              data: avgSensor5Data,
              borderColor: "rgb(153, 50, 204)", // Vibrant Purple
              backgroundColor: "rgba(153, 50, 204, 0.2)",
              pointRadius: 0,
              pointHoverRadius: 0,
              borderWidth: 1.25,
              hidden: true,
            },
            {
              label: "avgT6",
              data: avgSensor6Data,
              borderColor: "rgb(163, 106, 2)", // Bright Orange
              backgroundColor: "rgba(163, 106, 2, 0.2)",
              pointRadius: 0,
              pointHoverRadius: 0,
              borderWidth: 1.25,
              hidden: true,
            },
            {
              label: "avgT7",
              data: avgSensor7Data,
              borderColor: "rgb(241, 110, 250)", // Vibrant Tomato Red
              backgroundColor: "rgba(241, 110, 250, 0.2)",
              pointRadius: 0,
              pointHoverRadius: 0,
              borderWidth: 1.25,
              hidden: true,
            },
            {
              label: "avgT8",
              data: avgSensor8Data,
              borderColor: "rgb(0, 255, 127)", // Medium Sea Green
              backgroundColor: "rgba(0, 255, 127, 0.2)",
              pointRadius: 0,
              pointHoverRadius: 0,
              borderWidth: 1.25,
              hidden: true,
            },
            {
              label: "avgT9",
              data: avgSensor9Data,
              borderColor: "rgb(148, 72, 148)", // Violet
              backgroundColor: "rgba(148, 72, 148, 0.2)",
              pointRadius: 0,
              pointHoverRadius: 0,
              borderWidth: 1.25,
              hidden: true,
            },
            {
              label: "avgT10",
              data: avgSensor10Data,
              borderColor: "rgb(240, 128, 128)", // Light Coral
              backgroundColor: "rgba(240, 128, 128, 0.2)",
              pointRadius: 0,
              pointHoverRadius: 0,
              borderWidth: 1.25,
              hidden: true,
            },
            {
              label: "avgT11",
              data: avgSensor11Data,
              borderColor: "rgb(255, 20, 147)", // Deep Pink
              backgroundColor: "rgba(255, 20, 147, 0.2)",
              pointRadius: 0,
              pointHoverRadius: 0,
              borderWidth: 1.25,
              hidden: true,
            },
            {
              label: "avgT12",
              data: avgSensor12Data,
              borderColor: "rgb(0, 191, 255)", // Deep Sky Blue
              backgroundColor: "rgba(0, 191, 255, 0.2)",
              pointRadius: 0,
              pointHoverRadius: 0,
              borderWidth: 1.25,
              hidden: true,
            },
            {
              label: "avgT13",
              data: avgSensor13Data,
              borderColor: "rgb(75, 0, 130)", // Indigo
              backgroundColor: "rgba(75, 0, 130, 0.2)",
              pointRadius: 0,
              pointHoverRadius: 0,
              borderWidth: 1.25,
              hidden: true,
            },
            {
              label: "avgT14",
              data: avgSensor14Data,
              borderColor: "rgb(255, 99, 71)", // Bright Coral
              backgroundColor: "rgba(255, 99, 71, 0.2)",
              pointRadius: 0,
              pointHoverRadius: 0,
              borderWidth: 1.25,
              hidden: true,
            },
            {
              label: "avgT15",
              data: avgSensor15Data,
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
      setLoading(false);
    }
  },[analyticsData]);

  const lineOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
          align: 'start',
          labels: {
            color: "#4B5563",
            font: {
              size: 9,
            },
            boxWidth: 12,
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
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: "#4B5563",
            font: {
              size: 7,
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
              size: 7,
            },
          },
        },
      },
    }),
    []
  );

  return (
    <div className="xl:h-screen text-white p-4 flex flex-col gap-2 ">
      {/* top bar - h-[10%] */}
      <div className="xl:h-[10%]">
        <Navbar />
      </div>

      <div className="xl:h-[90%] flex flex-col gap-2 justify-center">
        <div className="flex gap-2 justify-evenly font-medium xl:h-[15%]">
          <div
            className={`flex flex-col gap-1 items-center hover:scale-125 duration-200 cursor-pointer hover:text-[#e4ba4c] hover:bg-white/10 text-xs md:text-base text-center rounded-md px-2 py-0.5 ${
              selectedReportOption === "averageData" &&
              "text-[#e4ba4c] bg-white/10"
            }`}
            onClick={() => {
              setSelectedReportOption("averageData");
              setFromDate("");
              setToDate("");
              setCount();
              setEnableCount(false);
              setAnalyticsData([]);
              setIntervalFromDate("");
              setIntervalToDate("");
            }}
          >
            <TbSum className="text-3xl md:text-6xl 2xl:text-8xl" />
            Average Data
          </div>

          <div
            className={`flex flex-col gap-1 items-center hover:scale-125 duration-200 cursor-pointer hover:text-[#e4ba4c] hover:bg-white/10 text-xs md:text-base text-center rounded-md px-2 py-0.5 ${
              selectedReportOption === "intervalData" &&
              "text-[#e4ba4c] bg-white/10"
            }`}
            onClick={() => {
              setSelectedReportOption("intervalData");
              setFromDate("");
              setToDate("");
              setCount();
              setEnableCount(false);
              setAvgFromDate("");
              setAvgToDate("");
              setAnalyticsData([]);
            }}
          >
            <AiOutlineFieldTime className="text-3xl md:text-6xl 2xl:text-8xl" />
            Interval Data
          </div>

          <div
            className={`flex flex-col gap-1 items-center hover:scale-125 duration-200 cursor-pointer hover:text-[#e4ba4c] hover:bg-white/10 text-xs md:text-base text-center rounded-md px-2 py-0.5 ${
              selectedReportOption === "datePicker" &&
              "text-[#e4ba4c] bg-white/10"
            }`}
            onClick={() => {
              setSelectedReportOption("datePicker");
              setCount();
              setEnableCount(false);
              setAvgFromDate("");
              setAvgToDate("");
              setAnalyticsData([]);
              setIntervalFromDate("");
              setIntervalToDate("");
            }}
          >
            <LuCalendarSearch className="text-3xl md:text-6xl 2xl:text-8xl" />
            Date&nbsp;Picker
          </div>

          <div
            className={`flex flex-col gap-1 items-center hover:scale-125 duration-200 cursor-pointer hover:text-[#e4ba4c] hover:bg-white/10 text-xs md:text-base text-center rounded-md px-2 py-0.5 ${
              selectedReportOption === "countWiseData" &&
              "text-[#e4ba4c] bg-white/10"
            }`}
            onClick={() => {
              setSelectedReportOption("countWiseData");
              setFromDate("");
              setToDate("");
              setCount(100);
              setEnableCount(false);
              setAvgFromDate("");
              setAvgToDate("");
              setAnalyticsData([]);
              setIntervalFromDate("");
              setIntervalToDate("");
            }}
          >
            <TbHash className="text-3xl md:text-6xl 2xl:text-8xl" />
            Count-wise Data
          </div>
        </div>

        <div className="xl:h-[85%] flex flex-col xl:flex-row gap-2">
          {/* left half */}
          <div className="w-full xl:w-[30%] flex flex-col gap-2">
            {/* selector */}
            <div
              className="p-4 rounded-xl h-[300px] lg:h-[400px] xl:h-2/3 flex justify-center items-center 2xl:text-2xl text-[#23439b] bg-[#dde3f1]"
              // style={{
              //   backgroundImage:
              //     "radial-gradient(circle, #dbf2ff, #d6ebf9, #d1e4f3, #ccdced, #c8d5e7, #c2cfe3, #bdcadf, #afbfdb, #a9bbd9, #a1b4d6, #98b0d4, #90aad1)",
              // }}
            >
              {/* averageData option */}
              {selectedReportOption === "averageData" && (
                <form
                  className="flex flex-col items-center justify-center gap-6 2xl:gap-12"
                  onSubmit={generateAverageAnalyticsData}
                >
                  <center className="text-xl 2xl:text-2xl font-medium">
                    Select Date Range
                  </center>
                  <div className="flex gap-2">
                    <div className="flex flex-col gap-4 font-medium">
                      <label>From</label>
                      <label>To</label>
                    </div>
                    <div className="flex flex-col gap-4">
                      <input
                        type="date"
                        className="text-black rounded-md px-0.5"
                        required
                        value={avgFromDate}
                        onChange={(e) => setAvgFromDate(e.target.value)}
                      />
                      <input
                        type="date"
                        className="text-black rounded-md px-0.5"
                        required
                        value={avgToDate}
                        onChange={(e) => setAvgToDate(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 text-sm 2xl:text-base font-medium">
                    <div className="text-center">Average By:</div>
                    <div className="flex gap-2 items-center text-black">
                      <div className="flex items-center gap-1">
                        <input
                          type="radio"
                          id="option1"
                          name="averageOption"
                          value={averageOption}
                          defaultChecked
                          className="cursor-pointer mt-0.5"
                          onChange={() => setAverageOption("minute")}
                        />
                        <label
                          htmlFor="option1"
                          className="mr-2 cursor-pointer"
                        >
                          Minute
                        </label>
                      </div>

                      <div className="flex items-center gap-1">
                        <input
                          type="radio"
                          id="option2"
                          name="averageOption"
                          value={averageOption}
                          className="cursor-pointer mt-0.5"
                          onChange={() => setAverageOption("hour")}
                        />
                        <label
                          htmlFor="option2"
                          className="mr-2 cursor-pointer"
                        >
                          Hour
                        </label>
                      </div>

                      <div className="flex items-center gap-1">
                        <input
                          type="radio"
                          id="option3"
                          name="averageOption"
                          value={averageOption}
                          className="cursor-pointer mt-0.5"
                          onChange={() => setAverageOption("day")}
                        />
                        <label
                          htmlFor="option3"
                          className="mr-2 cursor-pointer"
                        >
                          Day
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center gap-4 font-medium">
                    <button
                      className="rounded-md bg-[#e4ba4c] hover:scale-110 duration-200 py-1 px-2 2xl:py-2 2xl:px-4 flex items-center gap-1 text-black"
                      type="submit"
                    >
                      <BiScatterChart className="text-lg" />
                      Plot Graph
                    </button>
                  </div>
                </form>
              )}

              {/* interval data */}
              {selectedReportOption === "intervalData" && (
                <form
                  className="flex flex-col gap-4 py-4 md:py-8 px-5 md:px-10 items-center justify-center"
                  onSubmit={generateAverageAnalyticsData}
                >
                  <center className="text-xl font-medium">
                    Select Time Interval
                  </center>
                  <div className="flex gap-2">
                    <div className="flex flex-col gap-4 font-medium">
                      <label>From</label>
                      <label>To</label>
                    </div>
                    <div className="flex flex-col gap-4">
                      <input
                        type="date"
                        className="text-black rounded-md px-0.5"
                        required
                        value={intervalFromDate}
                        onChange={(e) => setIntervalFromDate(e.target.value)}
                      />
                      <input
                        type="date"
                        className="text-black rounded-md px-0.5"
                        required
                        value={intervalToDate}
                        onChange={(e) => setIntervalToDate(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="text-sm 2xl:text-base font-medium">
                    Get 1 data for every -
                  </div>
                  <div className="flex gap-2 text-sm 2xl:text-base font-medium text-black">
                    <div className="flex items-center gap-1">
                      <input
                        type="radio"
                        id="intervaOption2"
                        name="intervalOptions"
                        value={intervalOption}
                        defaultChecked
                        className="cursor-pointer mt-0.5"
                        onChange={() => setIntervalOption("minute")}
                      />
                      <label
                        htmlFor="intervaOption2"
                        className="cursor-pointer"
                      >
                        Minute
                      </label>
                    </div>

                    <div className="flex items-center gap-1">
                      <input
                        type="radio"
                        id="intervaOption1"
                        name="intervalOptions"
                        value={intervalOption}
                        className="cursor-pointer mt-0.5"
                        onChange={() => setIntervalOption("hour")}
                      />
                      <label
                        htmlFor="intervaOption1"
                        className="cursor-pointer"
                      >
                        Hour
                      </label>
                    </div>

                    <div className="flex items-center gap-1">
                      <input
                        type="radio"
                        id="intervaOption3"
                        name="intervalOptions"
                        value={intervalOption}
                        className="cursor-pointer mt-0.5"
                        onChange={() => setIntervalOption("day")}
                      />
                      <label
                        htmlFor="intervaOption3"
                        className="cursor-pointer"
                      >
                        Day
                      </label>
                    </div>
                  </div>
                  <div>
                    <button
                      className="rounded-md bg-[#e4ba4c] hover:scale-110 duration-200 py-1 px-2 2xl:py-2 2xl:px-4 flex items-center gap-1 text-black font-medium"
                      type="submit"
                    >
                      <BiScatterChart className="text-lg" />
                      Plot Graph
                    </button>
                  </div>
                </form>
              )}

              {/* datepicker option */}
              {selectedReportOption === "datePicker" && (
                <form
                  className="flex flex-col items-center justify-center gap-6 2xl:gap-12 h-full"
                  onSubmit={generateAnalyticsData}
                >
                  <center className="text-xl 2xl:text-2xl font-medium">
                    Select Date
                  </center>
                  <div className="flex gap-2">
                    <div className="flex flex-col gap-4 font-medium">
                      <label>From</label>
                      <label>To</label>
                    </div>
                    <div className="flex flex-col gap-4">
                      <input
                        type="date"
                        className="text-black rounded-md px-0.5"
                        required
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                      />
                      <input
                        type="date"
                        className="text-black rounded-md px-0.5"
                        required
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex justify-center gap-4 font-medium">
                    <button
                      className="rounded-md bg-[#e4ba4c] hover:scale-110 duration-200 py-1 px-2 2xl:py-2 2xl:px-4 flex items-center gap-1 text-black"
                      type="submit"
                    >
                      <BiScatterChart className="text-lg" />
                      Plot Graph
                    </button>
                  </div>
                </form>
              )}

              {/* countwise option */}
              {selectedReportOption === "countWiseData" && (
                <div className="flex flex-col gap-4 2xl:gap-12 items-center justify-center">
                  <center className="text-xl 2xl:text-2xl font-medium">
                    Select Count
                  </center>
                  <div className="grid grid-cols-2 gap-2 md:gap-4 text-black">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="option1"
                        name="options"
                        value={100}
                        checked={count === 100}
                        readOnly
                        className="cursor-pointer mr-1"
                        onClick={() => {
                          setCount(100);
                          setEnableCount(false);
                        }}
                      />
                      <label htmlFor="option1" className="cursor-pointer">
                        Last 100 Data
                      </label>
                    </div>

                    <div>
                      <input
                        type="radio"
                        id="option2"
                        name="options"
                        value={500}
                        checked={count === 500}
                        readOnly
                        className="cursor-pointer mr-1"
                        onClick={() => {
                          setCount(500);
                          setEnableCount(false);
                        }}
                      />
                      <label htmlFor="option2" className="cursor-pointer">
                        Last 500 Data
                      </label>
                    </div>

                    <div>
                      <input
                        type="radio"
                        id="option3"
                        name="options"
                        value={1000}
                        checked={count === 1000}
                        readOnly
                        className="cursor-pointer mr-1"
                        onClick={() => {
                          setCount(1000);
                          setEnableCount(false);
                        }}
                      />
                      <label htmlFor="option3" className="cursor-pointer">
                        Last 1000 Data
                      </label>
                    </div>

                    <div>
                      <input
                        type="radio"
                        id="option4"
                        name="options"
                        className="cursor-pointer mr-1"
                        checked={enableCount === true}
                        readOnly
                        onClick={() => {
                          setCount(0);
                          setEnableCount(true);
                        }}
                      />
                      <label htmlFor="option4" className="cursor-pointer">
                        Custom Count
                      </label>
                    </div>

                    {enableCount && (
                      <>
                        <label htmlFor="count">Enter Count:</label>
                        <input
                          type="number"
                          id="count"
                          value={count}
                          className="text-black w-32 rounded-md px-2"
                          onChange={(e) =>
                            setCount(parseInt(e.target.value) || 0)
                          }
                        />
                      </>
                    )}
                  </div>
                  <div className="flex gap-4">
                    <button
                      className="rounded-md bg-[#e4ba4c] hover:scale-110 duration-200 py-1 px-2 2xl:py-2 2xl:px-4 flex items-center gap-1 text-black font-medium"
                      onClick={generateAnalyticsData}
                    >
                      <BiScatterChart className="text-lg" />
                      Plot Graph
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* table */}
            <div
              className="relative h-[300px] lg:h-[400px] xl:h-1/3 rounded-xl overflow-auto text-black bg-[#dde3f1]"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#23439b transparent",
              }}
            >
              {analyticsData &&
              Array.isArray(analyticsData) &&
              analyticsData.length > 0 ? (
                <table className="w-full text-center">
                  <thead className="sticky top-0 text-sm backdrop-blur-sm text-[#23439b]">
                    <tr>
                      {analyticsData &&
                        Array.isArray(analyticsData) &&
                        analyticsData.length > 0 && (
                          <th className="px-2">S.No</th>
                        )}
                      {analyticsData &&
                        Array.isArray(analyticsData) &&
                        analyticsData.length > 0 &&
                        Object.keys(analyticsData[0]).map((key) => (
                          <th key={key} className="px-2">
                            {key}
                          </th>
                        ))}
                    </tr>
                  </thead>
                  <tbody className="text-xs 2xl:text-base ">
                    {selectedReportOption === "averageData"
                      ? analyticsData &&
                        analyticsData.map((data, index) => (
                          <tr key={index}>
                            <td className="px-2 border border-gray-400">
                              {index + 1}
                            </td>
                            {Object.keys(data).map((key) => (
                              <td
                                className="px-2 border border-gray-400"
                                key={key}
                              >
                                {data[key]}
                              </td>
                            ))}
                          </tr>
                        ))
                      : analyticsData &&
                        analyticsData.map((data, index) => (
                          <tr key={index}>
                            <td className="px-2 border border-gray-400">
                              {index + 1}
                            </td>
                            {Object.keys(data)
                              .filter((key) => key !== "createdAt")
                              .map((key) => (
                                <td
                                  className="px-2 border border-gray-400"
                                  key={key}
                                >
                                  {data[key]}
                                </td>
                              ))}
                          </tr>
                        ))}
                  </tbody>
                </table>
              ) : (
                <div className="h-full flex justify-center items-center text-sm 2xl:text-base font-medium">
                  No Data
                </div>
              )}
              {tableLoading && (
                <div className="absolute inset-0 bg-black/70 rounded-xl flex flex-col justify-center items-center font-semibold text-base text-white">
                  <div>Loading table data!</div>
                  <img src={loadingGif} className="max-w-[40px]" />
                </div>
              )}
            </div>
          </div>

          {/* right half graph */}
          <div
            className="relative rounded-xl p-1 w-full h-[300px] lg:h-[400px] xl:h-auto xl:w-[70%] overflow-hidden flex flex-col text-black text-sm 2xl:text-base bg-[#dde3f1]"
            // style={{
            //   backgroundImage:
            //     "radial-gradient(circle, #dbf2ff, #d6ebf9, #d1e4f3, #ccdced, #c8d5e7, #c2cfe3, #bdcadf, #afbfdb, #a9bbd9, #a1b4d6, #98b0d4, #90aad1)",
            // }}
          >
            <div className="h-full w-full">
              {analyticsData &&
              Array.isArray(analyticsData) &&
              analyticsData.length > 0 ? (
                <Line data={lineData} options={lineOptions} width={"100%"} />
              ) : (
                <Line
                  data={{ datasets: [] }}
                  options={lineOptions}
                  width={"100%"}
                />
              )}
            </div>
            {loading && (
              <div className="absolute inset-0 bg-black/70 rounded-xl flex flex-col justify-center items-center font-semibold text-base text-white z-10">
                <div>Loading line chart!</div>
                <img src={loadingGif} className="max-w-[40px]" />
              </div>
            )}
            {/* no of data points */}
            {analyticsData &&
              Array.isArray(analyticsData) &&
              analyticsData.length > 0 && (
                <div className="absolute top-1 right-2 text-xs font-medium md:flex items-center gap-1 text-[#23439b] hidden">
                  <div>Data Points:</div>
                  <div className="bg-white px-2 rounded-md text-black border border-gray-300">
                    {analyticsData.length}
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
