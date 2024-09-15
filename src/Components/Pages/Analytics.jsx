import React from 'react';
import { useEffect, useState, useRef } from "react";
import Navbar from "./Navbar";
import { LuCalendarSearch } from "react-icons/lu";
import { MdOutlineSensors } from "react-icons/md";
import { TbHash, TbSum } from "react-icons/tb";
import { BiScatterChart } from "react-icons/bi";
import axios from "axios";
import ApexCharts from "react-apexcharts";

const Analytics = ({ dataFromApp }) => {
  const [selectedReportOption, setSelectedReportOption] =
    useState("averageData");
  const [count, setCount] = useState(100);
  const [enableCount, setEnableCount] = useState(false);
  const [parameters, setParameters] = useState({}); // for sensor-wise data
  const [selectedSensors, setSelectedSensors] = useState([]); //for sensor wise data
  const [unselectedSensors, setUnselectedSensors] = useState([]);
  const [selectedSensorWiseReportOption, setSelectedSensorWiseReportOption] =
    useState("datePicker"); // for sensor wise data
  const [sensorWiseCount, setSensorWiseCount] = useState(100); // for sensor-wise data
  const [enableSensorWiseCount, setEnableSensorWiseCount] = useState(false); // for sensor-wise data
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [sensorWiseFromDate, setSensorWiseFromDate] = useState("");
  const [sensorWiseToDate, setSensorWiseToDate] = useState("");
  const [avgFromDate, setAvgFromDate] = useState("");
  const [avgToDate, setAvgToDate] = useState("");
  const [analyticsData, setAnalyticsData] = useState([]);

  const projectName = "XY001";

  // console.log('selected sensors', selectedSensors)

  // used for displaying the sensor names in sensor wise data option
  useEffect(() => {
    if (dataFromApp) {
      // const { createdAt, ...filteredData } = dataFromApp;
      // setParameters(filteredData);
      const filteredData = Object.keys(dataFromApp).filter((key) =>
        key.startsWith("S")
      );
      setParameters(filteredData);
    }
  }, [dataFromApp]);

  // console.log('parameters', parameters);

  // used for setting unselected sensor
  useEffect(() => {
    if (
      parameters &&
      selectedSensors &&
      selectedReportOption === "sensorWiseData"
    ) {
      // const allSensors = Object.keys(parameters);
      // console.log('allsensors', allSensors);
      const unselected = parameters.filter(
        (sensor) => !selectedSensors.includes(sensor)
      );

      setUnselectedSensors(unselected);
    }
  }, [parameters, selectedSensors]);

  // console.log("unselected sensors:", unselectedSensors);

  const handleSensorWiseDataSensorSelection = (key) => {
    setSelectedSensors((prevSelectedSensors) => {
      if (prevSelectedSensors.includes(key)) {
        return prevSelectedSensors.filter((sensor) => sensor !== key);
      } else {
        return [...prevSelectedSensors, key];
      }
    });
  };

  // console.log('selected sensors', selectedSensors);

  const generateAnalyticsData = async () => {
    try {
      const response = await axios.get(
        // "http://34.93.162.58:4000/sensor/getDemokitUtmapsData",
        "http://localhost:4000/backend/getHindalcoReport",
        {
          params: {
            projectName: projectName,
            avgFromDate: avgFromDate,
            avgToDate: avgToDate,
            fromDate: fromDate,
            toDate: toDate,
            count: count,
            unselectedSensors: unselectedSensors.join(","),
            sensorWiseFromDate: sensorWiseFromDate,
            sensorWiseToDate: sensorWiseToDate,
            sensorWiseCount: sensorWiseCount,
          },
        }
      );
      setAnalyticsData(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const generateAverageAnalyticsData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/backend/getHindalcoAverageReport",
        {
          params: {
            projectName: projectName,
            avgFromDate: avgFromDate,
            avgToDate: avgToDate,
          },
        }
      );
      setAnalyticsData(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  console.log("analytics data", analyticsData);

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

  // const chartRef = useRef({ min: null, max: null });

  // chart data assignment
  useEffect(() => {
    if (analyticsData.length > 0) {
      if(selectedReportOption === 'averageData') {
        const lineCategories = analyticsData
          .map((item) => item.dateTimeRange)
          .reverse();
        const lineSeries = [
          {
            name: "S1",
            data: [...analyticsData.map((item) => item.avgS1).reverse()],
          },
          {
            name: "S2",
            data: [...analyticsData.map((item) => item.avgS2).reverse()],
          },
          {
            name: "S3",
            data: [...analyticsData.map((item) => item.avgS3).reverse()],
          },
          {
            name: "S4",
            data: [...analyticsData.map((item) => item.avgS4).reverse()],
          },
          {
            name: "S5",
            data: [...analyticsData.map((item) => item.avgS5).reverse()],
          },
          {
            name: "S6",
            data: [...analyticsData.map((item) => item.avgS6).reverse()],
          },
          {
            name: "S7",
            data: [...analyticsData.map((item) => item.avgS7).reverse()],
          },
          {
            name: "S8",
            data: [...analyticsData.map((item) => item.avgS8).reverse()],
          },
          {
            name: "S9",
            data: [...analyticsData.map((item) => item.avgS9).reverse()],
          },
          {
            name: "S10",
            data: [...analyticsData.map((item) => item.avgS10).reverse()],
          },
          {
            name: "S11",
            data: [...analyticsData.map((item) => item.avgS11).reverse()],
          },
          {
            name: "S12",
            data: [...analyticsData.map((item) => item.avgS12).reverse()],
          },
          {
            name: "S13",
            data: [...analyticsData.map((item) => item.avgS13).reverse()],
          },
          {
            name: "S14",
            data: [...analyticsData.map((item) => item.avgS14).reverse()],
          },
          {
            name: "S15",
            data: [...analyticsData.map((item) => item.avgS15).reverse()],
          },
        ];
        setLineData({
          series: lineSeries,
          options: {
            ...lineData.options,
            xaxis: {
              categories: lineCategories,
            },
          },
        });
      } else if(selectedReportOption !== 'averageData') {
        const lineCategories = analyticsData
          .map((item) => new Date(item.createdAt).toLocaleString("en-GB"))
          .reverse();
        const lineSeries = [
          {
            name: "S1",
            data: [...analyticsData.map((item) => item.S1).reverse()],
          },
          {
            name: "S2",
            data: [...analyticsData.map((item) => item.S2).reverse()],
          },
          {
            name: "S3",
            data: [...analyticsData.map((item) => item.S3).reverse()],
          },
          {
            name: "S4",
            data: [...analyticsData.map((item) => item.S4).reverse()],
          },
          {
            name: "S5",
            data: [...analyticsData.map((item) => item.S5).reverse()],
          },
          {
            name: "S6",
            data: [...analyticsData.map((item) => item.S6).reverse()],
          },
          {
            name: "S7",
            data: [...analyticsData.map((item) => item.S7).reverse()],
          },
          {
            name: "S8",
            data: [...analyticsData.map((item) => item.S8).reverse()],
          },
          {
            name: "S9",
            data: [...analyticsData.map((item) => item.S9).reverse()],
          },
          {
            name: "S10",
            data: [...analyticsData.map((item) => item.S10).reverse()],
          },
          {
            name: "S11",
            data: [...analyticsData.map((item) => item.S11).reverse()],
          },
          {
            name: "S12",
            data: [...analyticsData.map((item) => item.S12).reverse()],
          },
          {
            name: "S13",
            data: [...analyticsData.map((item) => item.S13).reverse()],
          },
          {
            name: "S14",
            data: [...analyticsData.map((item) => item.S14).reverse()],
          },
          {
            name: "S15",
            data: [...analyticsData.map((item) => item.S15).reverse()],
          },
        ];
        setLineData({
          series: lineSeries,
          options: {
            ...lineData.options,
            xaxis: {
              categories: lineCategories,
            },
          },
        });
      }
      

      // const lineSeries = allSeries.filter((series) =>
      //   selectedSensors.includes(series.name)
      // );

      
    }
  }, [analyticsData]);

  return (
    <div className="h-screen text-white p-4 flex flex-col gap-2 ">
      {/* top bar - h-[10%] */}
      <div className="xl:h-[10%]">
        <Navbar />
      </div>

      <div className="xl:h-[90%] flex flex-col gap-2 justify-center">
        <div className="flex gap-2 justify-evenly font-medium">
          <div
            className={`flex flex-col gap-1 items-center hover:scale-125 duration-200 cursor-pointer hover:text-[#9cb3d6] text-xs md:text-base text-center ${
              selectedReportOption === "averageData" && "text-[#9cb3d6]"
            }`}
            onClick={() => {
              setSelectedReportOption("averageData");
              setFromDate("");
              setToDate("");
              setCount();
              setSensorWiseCount();
              setSelectedSensors([]);
              setUnselectedSensors([]);
              setSensorWiseFromDate("");
              setSensorWiseToDate("");
              setEnableCount(false);
            }}
          >
            <TbSum className="text-3xl md:text-6xl 2xl:text-8xl" />
            Average Data
          </div>

          <div
            className={`flex flex-col gap-1 items-center hover:scale-125 duration-200 cursor-pointer hover:text-[#9cb3d6] text-xs md:text-base ${
              selectedReportOption === "datePicker" && "text-[#9cb3d6]"
            }`}
            onClick={() => {
              setSelectedReportOption("datePicker");
              setCount();
              setSensorWiseCount();
              setSelectedSensors([]);
              setUnselectedSensors([]);
              setSensorWiseFromDate("");
              setSensorWiseToDate("");
              setEnableCount(false);
              setAvgFromDate("");
              setAvgToDate("");
            }}
          >
            <LuCalendarSearch className="text-3xl md:text-6xl 2xl:text-8xl" />
            Date&nbsp;Picker
          </div>

          <div
            className={`flex flex-col gap-1 items-center hover:scale-125 duration-200 cursor-pointer hover:text-[#9cb3d6] text-xs md:text-base text-center ${
              selectedReportOption === "countWiseData" && "text-[#9cb3d6]"
            }`}
            onClick={() => {
              setSelectedReportOption("countWiseData");
              setFromDate("");
              setToDate("");
              setCount(100);
              setSensorWiseCount();
              setSelectedSensors([]);
              setUnselectedSensors([]);
              setSensorWiseFromDate("");
              setSensorWiseToDate("");
              setEnableCount(false);
              setAvgFromDate("");
              setAvgToDate("");
            }}
          >
            <TbHash className="text-3xl md:text-6xl 2xl:text-8xl" />
            Count-wise Data
          </div>

          <div
            className={`flex flex-col gap-1 items-center hover:scale-125 duration-200 cursor-pointer hover:text-[#9cb3d6] text-xs md:text-base text-center ${
              selectedReportOption === "sensorWiseData" && "text-[#9cb3d6]"
            }`}
            onClick={() => {
              setSelectedReportOption("sensorWiseData");
              setFromDate("");
              setToDate("");
              setCount();
              setSelectedSensorWiseReportOption("datePicker");
              setEnableCount(false);
              setAvgFromDate("");
              setAvgToDate("");
            }}
          >
            <MdOutlineSensors className="text-3xl md:text-6xl 2xl:text-8xl" />
            Sensor-wise Data
          </div>
        </div>

        <div className="flex-1 flex gap-4">
          {/* left half */}
          <div className="w-[30%] flex flex-col gap-4">
            {/* selector */}
            <div
              className="p-4 rounded-xl h-2/3 flex justify-center items-center text-gray-600"
              style={{
                backgroundImage:
                  "radial-gradient(circle, #dbf2ff, #d6ebf9, #d1e4f3, #ccdced, #c8d5e7, #c2cfe3, #bdcadf, #afbfdb, #a9bbd9, #a1b4d6, #98b0d4, #90aad1)",
              }}
            >
              {/* datepicker option */}
              {selectedReportOption === "datePicker" && (
                <div className="flex flex-col items-center justify-center gap-6">
                  <center className="text-xl font-medium">Select Date</center>
                  <div className="flex gap-2">
                    <div className="flex flex-col gap-4 font-medium">
                      <label>From</label>
                      <label>To</label>
                    </div>
                    <div className="flex flex-col gap-4">
                      <input
                        type="date"
                        className="text-gray-600 rounded-md px-0.5"
                        required
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                      />
                      <input
                        type="date"
                        className="text-gray-600 rounded-md px-0.5"
                        required
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex justify-center gap-4 font-medium">
                    <button
                      className="rounded-md bg-gradient-to-tr from-blue-700 via-blue-600 to-blue-400 hover:scale-110 duration-200 py-1 px-2 2xl:py-2 2xl:px-4 flex items-center gap-1 text-white"
                      onClick={generateAnalyticsData}
                    >
                      <BiScatterChart className="text-lg" />
                      Plot Graph
                    </button>
                  </div>
                </div>
              )}

              {/* countwise option */}
              {selectedReportOption === "countWiseData" && (
                <div className="flex flex-col gap-4 items-center justify-center">
                  <center className="text-xl font-medium">Select Count</center>
                  <div className="grid grid-cols-2 gap-2 md:gap-4">
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
                          className="text-gray-600 w-32 rounded-md px-2"
                          onChange={(e) =>
                            setCount(parseInt(e.target.value) || 0)
                          }
                        />
                      </>
                    )}
                  </div>
                  <div className="flex gap-4">
                    <button
                      className="rounded-md bg-gradient-to-tr from-blue-700 via-blue-600 to-blue-400 hover:scale-110 duration-200 py-1 px-2 2xl:py-2 2xl:px-4 flex items-center gap-1 text-white"
                      onClick={generateAnalyticsData}
                    >
                      <BiScatterChart className="text-lg" />
                      Plot Graph
                    </button>
                  </div>
                </div>
              )}

              {/* averageData option */}
              {selectedReportOption === "averageData" && (
                <div className="flex flex-col items-center justify-center gap-6">
                  <center className="text-xl font-medium">
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
                        className="text-gray-600 rounded-md px-0.5"
                        required
                        value={avgFromDate}
                        onChange={(e) => setAvgFromDate(e.target.value)}
                      />
                      <input
                        type="date"
                        className="text-gray-600 rounded-md px-0.5"
                        required
                        value={avgToDate}
                        onChange={(e) => setAvgToDate(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex justify-center gap-4 font-medium">
                    <button
                      className="rounded-md bg-gradient-to-tr from-blue-700 via-blue-600 to-blue-400 hover:scale-110 duration-200 py-1 px-2 2xl:py-2 2xl:px-4 flex items-center gap-1 text-white"
                      onClick={generateAverageAnalyticsData}
                    >
                      <BiScatterChart className="text-lg" />
                      Plot Graph
                    </button>
                  </div>
                </div>
              )}

              {/* sensorwise data option */}
              {selectedReportOption === "sensorWiseData" && (
                <div className="flex flex-col items-center justify-center gap-1.5 text-sm md:text-base">
                  <center className="text-sm md:text-xl font-medium">
                    Select sensor
                  </center>
                  {/* sensor selection */}
                  <div
                    className="flex gap-2 md:gap-4 w-80 overflow-auto"
                    style={{ scrollbarWidth: "none" }}
                  >
                    {parameters &&
                      parameters.length > 0 &&
                      parameters.map((key) => (
                        <div
                          className="flex gap-1 items-center text-sm 2xl:text-base"
                          key={key}
                        >
                          <input
                            type="checkbox"
                            id={key}
                            className="h-2 md:h-4 w-2 md:w-4 cursor-pointer"
                            value={key}
                            onClick={() =>
                              handleSensorWiseDataSensorSelection(key)
                            }
                          />
                          <label className="cursor-pointer" htmlFor={key}>
                            {key}
                          </label>
                        </div>
                      ))}
                  </div>

                  <div className="flex gap-4 font-medium">
                    <div
                      className={`flex flex-col gap-1 items-center hover:scale-110 duration-200 cursor-pointer hover:text-gray-700 text-xs md:text-base ${
                        selectedSensorWiseReportOption === "datePicker"
                          ? "text-gray-700"
                          : "text-white"
                      }`}
                      onClick={() => {
                        setSelectedSensorWiseReportOption("datePicker");
                        setSensorWiseCount();
                        setEnableSensorWiseCount(false);
                      }}
                    >
                      <LuCalendarSearch className="text-2xl md:text-4xl" />
                      Date Picker
                    </div>

                    <div
                      className={`flex flex-col gap-1 items-center hover:scale-110 duration-200 cursor-pointer hover:text-gray-700 text-xs md:text-base ${
                        selectedSensorWiseReportOption === "countWiseData"
                          ? "text-gray-700"
                          : "text-white"
                      }`}
                      onClick={() => {
                        setSelectedSensorWiseReportOption("countWiseData");
                        setSensorWiseFromDate("");
                        setSensorWiseToDate("");
                        setSensorWiseCount(100);
                        setEnableSensorWiseCount(false);
                      }}
                    >
                      <TbHash className="text-2xl md:text-4xl" />
                      Count-wise Data
                    </div>
                  </div>

                  {/* sensorwise datepicker option */}
                  {selectedSensorWiseReportOption === "datePicker" && (
                    <div className="flex flex-col items-center justify-center gap-2 text-sm md:text-base">
                      <center className=" font-medium">Select date</center>
                      <div className="flex gap-2 text-sm 2xl:text-base">
                        <div className="flex flex-col gap-2 font-medium ">
                          <label>From</label>
                          <label>To</label>
                        </div>
                        <div className="flex flex-col gap-2">
                          <input
                            type="date"
                            className="text-gray-600 rounded-md px-0.5"
                            required
                            value={sensorWiseFromDate}
                            onChange={(e) =>
                              setSensorWiseFromDate(e.target.value)
                            }
                          />
                          <input
                            type="date"
                            className="text-gray-600 rounded-md px-0.5"
                            required
                            value={sensorWiseToDate}
                            onChange={(e) =>
                              setSensorWiseToDate(e.target.value)
                            }
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* sensorwise countwise option */}
                  {selectedSensorWiseReportOption === "countWiseData" && (
                    <div className="flex flex-col gap-2 text-sm md:text-base">
                      <center className="font-medium">Select Count</center>
                      <div className="flex gap-4 text-sm 2xl:text-base">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              id="option1"
                              name="options"
                              value={100}
                              checked={sensorWiseCount === 100}
                              readOnly
                              className="cursor-pointer mr-1"
                              onClick={() => {
                                setSensorWiseCount(100);
                                setEnableSensorWiseCount(false);
                              }}
                            />
                            <label htmlFor="option1" className="cursor-pointer">
                              Last 100 Data
                            </label>
                          </div>
                          <div>
                            <input
                              type="radio"
                              id="option3"
                              name="options"
                              value={1000}
                              checked={sensorWiseCount === 1000}
                              readOnly
                              className="cursor-pointer mr-1"
                              onClick={() => {
                                setSensorWiseCount(1000);
                                setEnableSensorWiseCount(false);
                              }}
                            />
                            <label htmlFor="option3" className="cursor-pointer">
                              Last 1000 Data
                            </label>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <div>
                            <input
                              type="radio"
                              id="option2"
                              name="options"
                              value={500}
                              checked={sensorWiseCount === 500}
                              readOnly
                              className="cursor-pointer mr-1"
                              onClick={() => {
                                setSensorWiseCount(500);
                                setEnableSensorWiseCount(false);
                              }}
                            />
                            <label htmlFor="option2" className="cursor-pointer">
                              Last 500 Data
                            </label>
                          </div>

                          <div>
                            <input
                              type="radio"
                              id="option4"
                              name="options"
                              checked={enableSensorWiseCount === true}
                              readOnly
                              className="cursor-pointer mr-1"
                              onClick={() => {
                                setSensorWiseCount(0);
                                setEnableSensorWiseCount(true);
                              }}
                            />
                            <label htmlFor="option4" className="cursor-pointer">
                              Custom Count
                            </label>
                          </div>
                        </div>
                      </div>
                      {enableSensorWiseCount && (
                        <div className="flex gap-2 text-sm 2xl:text-base">
                          <label htmlFor="count">Enter Count:</label>
                          <input
                            type="number"
                            id="count"
                            value={sensorWiseCount}
                            className="text-gray-600 w-40 rounded-md px-2"
                            onChange={(e) =>
                              setSensorWiseCount(parseInt(e.target.value) || 0)
                            }
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* sensorwise overall data option */}
                  {/* {selectedSensorWiseReportOption === "overallData" && (
                  <div className="font-medium">
                    Entire data from the database will be <br />
                    downloaded!
                  </div>
                )} */}

                  <div className="flex gap-4 text-sm">
                    <button
                      className="rounded-md bg-gradient-to-tr from-blue-700 via-blue-600 to-blue-400 hover:scale-110 duration-200 py-1 px-2 2xl:py-2 2xl:px-4 flex items-center gap-1 text-white"
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
            <div className="border border-white h-1/3">
              <table className="w-full">
                <thead className="sticky top-0 text-sm">
                  {/* <tr>
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
                  </tr> */}
                </thead>
              </table>
            </div>
          </div>

          {/* right half graph */}
          <div className="border border-white w-[70%] overflow-hidden">
            {analyticsData.length > 0 ? (
              <ApexCharts
                options={lineData.options}
                series={lineData.series}
                type="line"
                height="100%"
              />
            ) : (
              <div className="h-full flex justify-center items-center">
                No Data Found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
