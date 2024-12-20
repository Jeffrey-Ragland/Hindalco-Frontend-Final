import React from "react";
import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { LuCalendarSearch } from "react-icons/lu";
import { MdOutlineSensors } from "react-icons/md";
import { TbHash } from "react-icons/tb";
import { FaFileDownload } from "react-icons/fa";
import { TbSum } from "react-icons/tb";
import { AiOutlineFieldTime } from "react-icons/ai";
import axios from "axios";
import reportsImg from "../Assets/reports.jpeg";
import loadingGif from "../Assets/loading.gif";

const Reports = ({ dataFromApp, thermocoupleConfiguration }) => {
  //build

  // console.log('reports page data', dataFromApp);
  // console.log(
  //   "Thermocouple configuration in reports",
  //   thermocoupleConfiguration
  // );

  const [selectedReportOption, setSelectedReportOption] =
    useState("datePicker");
  const [count, setCount] = useState();
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
  const [averageOption, setAverageOption] = useState("hour");
  const [intervalFromDate, setIntervalFromDate] = useState("");
  const [intervalToDate, setIntervalToDate] = useState("");
  const [intervalOption, setIntervalOption] = useState("hour");
  const [loading, setLoading] = useState(false);
  const [selectedThermocoupleConfig, setSelectedThermocoupleConfig] =
    useState("");

  // console.log('avg opt', averageOption);

  const projectName = "XY001";

  // used for displaying the sensor names in sensor wise data option
  useEffect(() => {
    if (dataFromApp) {
      const filteredData = Object.keys(dataFromApp).filter(
        (key) => key.startsWith("T") && key !== "Time"
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
      const unselected = parameters.filter(
        (sensor) => !selectedSensors.includes(sensor)
      );

      setUnselectedSensors(unselected);
    }
  }, [parameters, selectedSensors]);

  const handleSensorWiseDataSensorSelection = (key) => {
    setSelectedSensors((prevSelectedSensors) => {
      if (prevSelectedSensors.includes(key)) {
        return prevSelectedSensors.filter((sensor) => sensor !== key);
      } else {
        return [...prevSelectedSensors, key];
      }
    });
  };

  const generateExcel = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      const response = await axios.get(
        // "http://34.93.162.58:4000/sensor/getDemokitUtmapsData",
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
            unselectedSensors: unselectedSensors.join(","),
            sensorWiseFromDate: sensorWiseFromDate,
            sensorWiseToDate: sensorWiseToDate,
            sensorWiseCount: sensorWiseCount,
            thermocoupleConfiguration: selectedThermocoupleConfig,
          },
        }
      );
      setLoading(false);

      // console.log("report data", response.data.data);

      const ws = XLSX.utils.json_to_sheet(response.data.data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const info = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(info, `${projectName}_Report.xlsx`);
    } catch (error) {
      console.error(error);
    }
  };

  const generateAverageExcel = async (e) => {
    try {
      // console.log("before api");

      e.preventDefault();
      setLoading(true);
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
            thermocoupleConfiguration: selectedThermocoupleConfig,
          },
        }
      );
      // console.log("after api");
      setLoading(false);
      // console.log("report data", response.data.data);
      const ws = XLSX.utils.json_to_sheet(response.data.data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const info = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(info, `${projectName}_Report.xlsx`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="h-screen text-white p-4 flex flex-col gap-2">
      {/* top bar - h-[10%] */}
      <div className="h-[10%]">
        <Navbar />
      </div>
      <div className="relative h-[90%] flex flex-col justify-center text-sm md:text-base">
        <div className="flex gap-2 justify-evenly font-medium">
          <div
            className={`flex flex-col gap-1 items-center hover:scale-125 duration-200 cursor-pointer hover:text-[#e4ba4c] hover:bg-white/10 text-[10px] md:text-base text-center rounded-md px-2 py-0.5 ${
              selectedReportOption === "datePicker" &&
              "text-[#e4ba4c] bg-white/10"
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
              setIntervalFromDate("");
              setIntervalToDate("");
              setSelectedThermocoupleConfig("");
            }}
          >
            <LuCalendarSearch className="text-3xl md:text-6xl 2xl:text-8xl" />
            Date&nbsp;Picker
          </div>

          <div
            className={`flex flex-col gap-1 items-center hover:scale-125 duration-200 cursor-pointer hover:text-[#e4ba4c] hover:bg-white/10 text-[10px] md:text-base text-center rounded-md px-2 py-0.5 ${
              selectedReportOption === "countWiseData" &&
              "text-[#e4ba4c] bg-white/10"
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
              setIntervalFromDate("");
              setIntervalToDate("");
              setSelectedThermocoupleConfig("");
            }}
          >
            <TbHash className="text-3xl md:text-6xl 2xl:text-8xl" />
            Count-wise Data
          </div>

          <div
            className={`flex flex-col gap-1 items-center hover:scale-125 duration-200 cursor-pointer hover:text-[#e4ba4c] hover:bg-white/10 text-[10px] md:text-base text-center rounded-md px-2 py-0.5 ${
              selectedReportOption === "averageData" &&
              "text-[#e4ba4c] bg-white/10"
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
              setIntervalFromDate("");
              setIntervalToDate("");
              setSelectedThermocoupleConfig("");
            }}
          >
            <TbSum className="text-3xl md:text-6xl 2xl:text-8xl" />
            Average Data
          </div>

          <div
            className={`flex flex-col gap-1 items-center hover:scale-125 duration-200 cursor-pointer hover:text-[#e4ba4c] hover:bg-white/10 text-[10px] md:text-base text-center rounded-md px-2 py-0.5 ${
              selectedReportOption === "intervalData" &&
              "text-[#e4ba4c] bg-white/10"
            }`}
            onClick={() => {
              setSelectedReportOption("intervalData");
              setFromDate("");
              setToDate("");
              setCount();
              setSensorWiseCount();
              setSelectedSensors([]);
              setUnselectedSensors([]);
              setSensorWiseFromDate("");
              setSensorWiseToDate("");
              setEnableCount(false);
              setAvgFromDate("");
              setAvgToDate("");
              setSelectedThermocoupleConfig("");
            }}
          >
            <AiOutlineFieldTime className="text-3xl md:text-6xl 2xl:text-8xl" />
            Interval Data
          </div>

          {/* <div
            className={`flex flex-col gap-1 items-center hover:scale-125 duration-200 cursor-pointer hover:text-[#e4ba4c] hover:bg-white/10 text-[10px] md:text-base text-center rounded-md px-2 py-0.5 ${
              selectedReportOption === "sensorWiseData" &&
              "text-[#e4ba4c] bg-white/10"
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
              setIntervalFromDate("");
              setIntervalToDate("");
            }}
          >
            <MdOutlineSensors className="text-3xl md:text-6xl 2xl:text-8xl" />
            Sensor-wise Data
          </div> */}
        </div>

        <div className="flex-1 flex items-center justify-center ">
          <div className="flex flex-col md:flex-row p-4 md:p-8 rounded-xl text-[#23439b] bg-[#dde3f1]">
            <div className="p-2 md:p-4 flex items-center justify-center">
              <img
                src={reportsImg}
                alt="reportsVector"
                className="max-w-[150px] md:max-w-[300px] rounded-xl"
              />
            </div>

            {/* averageData option */}
            {selectedReportOption === "averageData" && (
              <form
                className="p-8 flex flex-col items-center justify-center gap-6"
                onSubmit={generateAverageExcel}
              >
                <center className="text-xl font-medium">
                  Select Date Range
                </center>
                <div className="flex gap-2">
                  <div className="flex flex-col gap-4 font-medium">
                    <div>Configuration</div>
                    <label>From</label>
                    <label>To</label>
                  </div>
                  <div className="flex flex-col gap-4">
                    <select
                      name="thermocoupleConfiguration"
                      className="text-black rounded-md p-1 text-sm 2xl:text-base"
                      onChange={(e) =>
                        setSelectedThermocoupleConfig(e.target.value)
                      }
                      value={selectedThermocoupleConfig}
                      required
                    >
                      <option value="" disabled>
                        Select Configuration
                      </option>
                      {thermocoupleConfiguration.map((config, index) => (
                        <option
                          key={index}
                          value={config.thermocoupleConfiguration}
                        >
                          {config.thermocoupleConfiguration}
                        </option>
                      ))}
                    </select>

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
                  <div className="text-center ">Average By:</div>
                  <div className="flex gap-2 items-center text-black">
                    {/* <div className="flex items-center gap-1">
                      <input
                        type="radio"
                        id="option1"
                        name="averageOption"
                        value={averageOption}
                        className="cursor-pointer mt-0.5"
                        onChange={() => setAverageOption("minute")}
                      />
                      <label htmlFor="option1" className="mr-2 cursor-pointer">
                        Minute
                      </label>
                    </div> */}

                    <div className="flex items-center gap-1">
                      <input
                        type="radio"
                        id="option2"
                        name="averageOption"
                        value={averageOption}
                        defaultChecked
                        className="cursor-pointer mt-0.5"
                        onChange={() => setAverageOption("hour")}
                      />
                      <label htmlFor="option2" className="mr-2 cursor-pointer">
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
                      <label htmlFor="option3" className="mr-2 cursor-pointer">
                        Day
                      </label>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center gap-4 font-medium">
                  <button
                    type="submit"
                    className="rounded-md bg-[#e4ba4c] hover:scale-110 duration-200 py-1 px-2 2xl:py-2 2xl:px-4 flex items-center gap-1 text-black"
                  >
                    <FaFileDownload className="text-lg" />
                    Download Excel
                  </button>
                </div>
              </form>
            )}

            {/* interval option */}
            {selectedReportOption === "intervalData" && (
              <form
                className="flex flex-col gap-6 py-4 md:py-8 px-5 md:px-10 items-center justify-center"
                onSubmit={generateAverageExcel}
              >
                <center className="text-xl font-medium">
                  Select Time Interval
                </center>
                <div className="flex gap-2">
                  <div className="flex flex-col gap-4 font-medium">
                    <div>Configuration</div>
                    <label>From</label>
                    <label>To</label>
                  </div>
                  <div className="flex flex-col gap-4">
                    <select
                      name="thermocoupleConfiguration"
                      className="text-black rounded-md p-1 text-sm 2xl:text-base"
                      onChange={(e) =>
                        setSelectedThermocoupleConfig(e.target.value)
                      }
                      value={selectedThermocoupleConfig}
                      required
                    >
                      <option value="" disabled>
                        Select Configuration
                      </option>
                      {thermocoupleConfiguration.map((config, index) => (
                        <option
                          key={index}
                          value={config.thermocoupleConfiguration}
                        >
                          {config.thermocoupleConfiguration}
                        </option>
                      ))}
                    </select>

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
                  {/* <div className="flex items-center gap-1">
                    <input
                      type="radio"
                      id="intervaOption2"
                      name="intervalOptions"
                      value={intervalOption}
                      className="cursor-pointer mt-0.5"
                      onChange={() => setIntervalOption("minute")}
                    />
                    <label htmlFor="intervaOption2" className="cursor-pointer">
                      Minute
                    </label>
                  </div> */}

                  <div className="flex items-center gap-1">
                    <input
                      type="radio"
                      id="intervaOption1"
                      name="intervalOptions"
                      value={intervalOption}
                      defaultChecked
                      className="cursor-pointer mt-0.5"
                      onChange={() => setIntervalOption("hour")}
                    />
                    <label htmlFor="intervaOption1" className="cursor-pointer">
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
                    <label htmlFor="intervaOption3" className="cursor-pointer">
                      Day
                    </label>
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    className="rounded-md bg-[#e4ba4c] hover:scale-110 duration-200 py-1 px-2 2xl:py-2 2xl:px-4 flex items-center gap-1 text-black font-medium"
                  >
                    <FaFileDownload className="text-lg" />
                    Download Excel
                  </button>
                </div>
              </form>
            )}

            {/* datepicker option */}
            {selectedReportOption === "datePicker" && (
              <form
                className="p-4 md:p-8 flex flex-col items-center justify-center gap-6"
                onSubmit={generateExcel}
              >
                {/* <center className="text-xl font-medium">
                  Select Thermocouple Configuration
                </center> */}
                <center className="text-xl font-medium">
                  Select Date Range
                </center>

                <div className="flex gap-2">
                  <div className="flex flex-col gap-4 font-medium">
                    <div>Configuration</div>
                    <label>From</label>
                    <label>To</label>
                  </div>
                  <div className="flex flex-col gap-4">
                    <select
                      name="thermocoupleConfiguration"
                      className="text-black rounded-md p-1 text-sm 2xl:text-base"
                      onChange={(e) =>
                        setSelectedThermocoupleConfig(e.target.value)
                      }
                      value={selectedThermocoupleConfig}
                      required
                    >
                      <option value="" disabled>
                        Select Configuration
                      </option>
                      {thermocoupleConfiguration.map((config, index) => (
                        <option
                          key={index}
                          value={config.thermocoupleConfiguration}
                        >
                          {config.thermocoupleConfiguration}
                        </option>
                      ))}
                    </select>

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
                    type="submit"
                    className="rounded-md bg-[#e4ba4c] hover:scale-110 duration-200 py-1 px-2 2xl:py-2 2xl:px-4 flex items-center gap-1 text-black"
                  >
                    <FaFileDownload className="text-lg" />
                    Download Excel
                  </button>
                </div>
              </form>
            )}

            {/* countwise option */}
            {selectedReportOption === "countWiseData" && (
              <form
                className="flex flex-col gap-4 py-4 md:py-8 px-5 md:px-10 items-center justify-center"
                onSubmit={generateExcel}
              >
                <center className="text-xl font-medium">Select Count</center>
                <div className="flex flex-col gap-2 md:gap-4 text-black">
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
                        required
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
                    type="submit"
                  >
                    <FaFileDownload className="text-lg" />
                    Download Excel
                  </button>
                </div>
              </form>
            )}

            {/* sensorwise data option */}
            {selectedReportOption === "sensorWiseData" && (
              <form
                className="px-4 md:px-8 py-2 md:py-4 flex flex-col items-center justify-center gap-4 text-sm md:text-base"
                onSubmit={generateExcel}
              >
                <center className="text-sm md:text-xl font-medium">
                  Select sensor
                </center>
                {/* sensor selection */}
                <div
                  className="flex gap-2 md:gap-4 w-48 md:w-60 xl:w-80 overflow-auto"
                  style={{ scrollbarWidth: "none" }}
                >
                  {parameters &&
                    parameters.length > 0 &&
                    parameters.map((key) => (
                      <div className="flex gap-1 items-center" key={key}>
                        <input
                          type="checkbox"
                          id={key}
                          className="h-3 md:h-6 w-3 md:w-6 cursor-pointer"
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
                    className={`flex flex-col gap-1 items-center hover:scale-110 duration-200 cursor-pointer hover:text-[#23439b] text-xs md:text-base ${
                      selectedSensorWiseReportOption === "datePicker"
                        ? "text-[#23439b]"
                        : "text-gray-400"
                    }`}
                    onClick={() => {
                      setSelectedSensorWiseReportOption("datePicker");
                      setSensorWiseCount();
                      setEnableSensorWiseCount(false);
                    }}
                  >
                    <LuCalendarSearch className="text-2xl md:text-5xl" />
                    Date Picker
                  </div>

                  <div
                    className={`flex flex-col gap-1 items-center hover:scale-110 duration-200 cursor-pointer hover:text-[#23439b] text-xs md:text-base ${
                      selectedSensorWiseReportOption === "countWiseData"
                        ? "text-[#23439b]"
                        : " text-gray-400"
                    }`}
                    onClick={() => {
                      setSelectedSensorWiseReportOption("countWiseData");
                      setSensorWiseFromDate("");
                      setSensorWiseToDate("");
                      setSensorWiseCount(100);
                      setEnableSensorWiseCount(false);
                    }}
                  >
                    <TbHash className="text-2xl md:text-5xl" />
                    Count-wise Data
                  </div>
                </div>

                {/* sensorwise datepicker option */}
                {selectedSensorWiseReportOption === "datePicker" && (
                  <div className="flex flex-col items-center justify-center gap-2">
                    <center className="text-sm md:text-xl font-medium">
                      Select date
                    </center>
                    <div className="flex gap-2">
                      <div className="flex flex-col gap-2 font-medium">
                        <label>From</label>
                        <label>To</label>
                      </div>
                      <div className="flex flex-col gap-2">
                        <input
                          type="date"
                          className="text-black rounded-md px-0.5"
                          required
                          value={sensorWiseFromDate}
                          onChange={(e) =>
                            setSensorWiseFromDate(e.target.value)
                          }
                        />
                        <input
                          type="date"
                          className="text-black rounded-md px-0.5"
                          required
                          value={sensorWiseToDate}
                          onChange={(e) => setSensorWiseToDate(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* sensorwise countwise option */}
                {selectedSensorWiseReportOption === "countWiseData" && (
                  <div className="flex flex-col gap-2">
                    <center className="text-sm md:text-xl font-medium">
                      Select Count
                    </center>
                    <div className="flex gap-4">
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
                      <div className="flex gap-2">
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

                <div className="flex gap-4">
                  <button
                    className="rounded-md bg-[#e4ba4c] hover:scale-110 duration-200 py-1 px-2 2xl:py-2 2xl:px-4 flex items-center gap-1 text-black font-medium"
                    type="submit"
                  >
                    <FaFileDownload className="text-lg" />
                    Download Excel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
        {loading && (
          <div className="absolute inset-0 bg-black/70 flex flex-col justify-center items-center font-semibold text-sm">
            <div>Your report is being downloaded!</div>
            <img src={loadingGif} className="max-w-[40px]" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
