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
  const [graphKeys, setGraphKeys] = useState([]);
  const [avgGraphKeys, setAvgGraphKeys] = useState([]);

  const projectName = "XY001";

  // console.log('selected sensors', selectedSensors)

  // for graph selection
  // const graphKeys = (analyticsData && Array.isArray(analyticsData) && analyticsData.length > 0) && Object.keys(analyticsData[0]).filter((key) => key.startsWith('S'));

  useEffect(() => {
    if (
      analyticsData &&
      Array.isArray(analyticsData) &&
      analyticsData.length > 0
    ) 
    {
      const keys = Object.keys(analyticsData[0]).filter((key) =>
        key.startsWith("S")
      );
      setGraphKeys(keys);
    }
  }, [analyticsData])

  useEffect(() => {
    if (
      analyticsData &&
      Array.isArray(analyticsData) &&
      analyticsData.length > 0
    ) {
      const keys = Object.keys(analyticsData[0]).filter((key) =>
        key.startsWith("avgS")
      );
      setAvgGraphKeys(keys);
    }
  }, [analyticsData]);
  

  console.log('graph keys', graphKeys);
  
  // const firstGraphKey = graphKeys.length > 0 && graphKeys[0];

  // console.log("first graph key", firstGraphKey);
  
  // console.log("graphKeys", graphKeys);

  // const avgGraphKeys = (analyticsData && Array.isArray(analyticsData) && analyticsData.length > 0) && Object.keys(analyticsData[0]).filter((key) => key.startsWith('avgS'));
  
  const [selectedGraphKeys, setSelectedGraphKeys] = useState(['S1']);
  const [selectedAvgGraphKeys, setSelectedAvgGraphKeys] = useState(["avgS1"]);

  const handleLineSelection = (key) => {
    if (selectedReportOption !== "averageData") {
      setSelectedGraphKeys((prevState) =>
        prevState.includes(key)
          ? prevState.filter((sensor) => sensor !== key)
          : [...prevState, key]
      );
    }
    else if (selectedReportOption === 'averageData') {
      setSelectedAvgGraphKeys((prevState) =>
        prevState.includes(key)
          ? prevState.filter((sensor) => sensor !== key)
          : [...prevState, key]
      );
    }
  };

  console.log('selected graph keys', selectedGraphKeys);
  console.log('selected avg graph keys', selectedAvgGraphKeys);

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
        show: true,
        borderColor: "#4d4d4d",
        strokeDashArray: 4,
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
    if (analyticsData && Array.isArray(analyticsData) && analyticsData.length > 0) {
      if(selectedReportOption === 'averageData') {
        const lineCategories = analyticsData
          .map((item) => item.dateTimeRange)
          .reverse();
        const allSeries = [
          {
            name: "avgS1",
            data: [...analyticsData.map((item) => item.avgS1).reverse()],
          },
          {
            name: "avgS2",
            data: [...analyticsData.map((item) => item.avgS2).reverse()],
          },
          {
            name: "avgS3",
            data: [...analyticsData.map((item) => item.avgS3).reverse()],
          },
          {
            name: "avgS4",
            data: [...analyticsData.map((item) => item.avgS4).reverse()],
          },
          {
            name: "avgS5",
            data: [...analyticsData.map((item) => item.avgS5).reverse()],
          },
          {
            name: "avgS6",
            data: [...analyticsData.map((item) => item.avgS6).reverse()],
          },
          {
            name: "avgS7",
            data: [...analyticsData.map((item) => item.avgS7).reverse()],
          },
          {
            name: "avgS8",
            data: [...analyticsData.map((item) => item.avgS8).reverse()],
          },
          {
            name: "avgS9",
            data: [...analyticsData.map((item) => item.avgS9).reverse()],
          },
          {
            name: "avgS10",
            data: [...analyticsData.map((item) => item.avgS10).reverse()],
          },
          {
            name: "avgS11",
            data: [...analyticsData.map((item) => item.avgS11).reverse()],
          },
          {
            name: "avgS12",
            data: [...analyticsData.map((item) => item.avgS12).reverse()],
          },
          {
            name: "avgS13",
            data: [...analyticsData.map((item) => item.avgS13).reverse()],
          },
          {
            name: "avgS14",
            data: [...analyticsData.map((item) => item.avgS14).reverse()],
          },
          {
            name: "avgS15",
            data: [...analyticsData.map((item) => item.avgS15).reverse()],
          },
        ];

        const lineSeries = allSeries.filter((series) =>
          selectedAvgGraphKeys.includes(series.name)
        );

        console.log('line series average', lineSeries);

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
          .map((item) => item.Time)
          .reverse();
        const allSeries = [
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

        const lineSeries = allSeries.filter((series) =>
          selectedGraphKeys.includes(series.name)
        );

        // const lineSeries = Object.keys(analyticsData[0] || {}) // Get the keys from the first data point
        //   .filter((key) => key.startsWith("S")) // Filter keys that start with 'S'
        //   .map((key) => ({
        //     name: key,
        //     data: analyticsData.map((item) => item[key]).reverse(),
        // }));

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
  }, [analyticsData, selectedGraphKeys, selectedAvgGraphKeys]);

  return (
    <div className="xl:h-screen text-white p-4 flex flex-col gap-2 ">
      {/* top bar - h-[10%] */}
      <div className="xl:h-[10%]">
        <Navbar />
      </div>

      <div className="xl:h-[90%] flex flex-col gap-2 justify-center">
        <div className="flex gap-2 justify-evenly font-medium xl:h-[15%]">
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
              setAnalyticsData([]);
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
              setAnalyticsData([]);
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
              setAnalyticsData([]);
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
              className="p-4 rounded-xl h-[300px] lg:h-[400px] xl:h-2/3 flex justify-center items-center text-gray-600 2xl:text-2xl"
              style={{
                backgroundImage:
                  "radial-gradient(circle, #dbf2ff, #d6ebf9, #d1e4f3, #ccdced, #c8d5e7, #c2cfe3, #bdcadf, #afbfdb, #a9bbd9, #a1b4d6, #98b0d4, #90aad1)",
              }}
            >
              {/* datepicker option */}
              {selectedReportOption === "datePicker" && (
                <div className="flex flex-col items-center justify-center gap-6 2xl:gap-12 h-full">
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
                <div className="flex flex-col gap-4 2xl:gap-12 items-center justify-center">
                  <center className="text-xl 2xl:text-2xl font-medium">
                    Select Count
                  </center>
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
                <div className="flex flex-col items-center justify-center gap-6 2xl:gap-12">
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
            </div>

            {/* table */}
            <div
              className="h-[300px] lg:h-[400px] xl:h-1/3 rounded-xl overflow-auto text-gray-600"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#1D4ED8 transparent",
                backgroundImage:
                  "radial-gradient(circle, #dbf2ff, #d6ebf9, #d1e4f3, #ccdced, #c8d5e7, #c2cfe3, #bdcadf, #afbfdb, #a9bbd9, #a1b4d6, #98b0d4, #90aad1)",
              }}
            >
              {analyticsData &&
              Array.isArray(analyticsData) &&
              analyticsData.length > 0 ? (
                <table className="w-full text-center">
                  <thead className="sticky top-0 text-sm backdrop-blur-sm">
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
                          <th className="px-2">{key}</th>
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
            </div>
          </div>

          {/* right half graph */}
          <div
            className="rounded-xl p-1 w-full h-[300px] lg:h-[400px] xl:h-auto xl:w-[70%] overflow-hidden flex flex-col text-gray-600 text-sm 2xl:text-base"
            style={{
              backgroundImage:
                "radial-gradient(circle, #dbf2ff, #d6ebf9, #d1e4f3, #ccdced, #c8d5e7, #c2cfe3, #bdcadf, #afbfdb, #a9bbd9, #a1b4d6, #98b0d4, #90aad1)",
            }}
          >
            {analyticsData &&
              Array.isArray(analyticsData) &&
              analyticsData.length > 0 &&
              (selectedReportOption === "averageData" ? (
                <div className="flex justify-evenly font-medium">
                  {avgGraphKeys.length > 0 &&
                    avgGraphKeys.map((key) => (
                      <div
                        key={key}
                        className="flex items-center gap-1 cursor-pointer"
                        onClick={() => handleLineSelection(key)}
                      >
                        <div
                          className={`h-2 w-2 mt-1 rounded-full border border-white 
                        ${
                          selectedAvgGraphKeys.includes(key)
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                        />
                        {key}
                      </div>
                    ))}
                </div>
              ) : (
                <div className="flex justify-evenly font-medium">
                  {graphKeys.length > 0 &&
                    graphKeys.map((key) => (
                      <div
                        key={key}
                        className="flex items-center gap-1 cursor-pointer"
                        onClick={() => handleLineSelection(key)}
                      >
                        <div
                          className={`h-2 w-2 rounded-full border border-white 
                        ${
                          selectedGraphKeys.includes(key)
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                        />
                        {key}
                      </div>
                    ))}
                </div>
              ))}

            <div className="flex-1">
              <ApexCharts
                options={lineData.options}
                series={
                  analyticsData &&
                  Array.isArray(analyticsData) &&
                  analyticsData.length > 0
                    ? lineData.series
                    : [{ name: "No Data", data: [] }]
                }
                type="line"
                height="100%"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
