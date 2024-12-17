import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import Login from "./Components/Pages/Login";
import ProtectedRoute from "./Components/Pages/ProtectedRoute";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./Components/Pages/Dashboard";
import Reports from "./Components/Pages/Reports";
import Analysis from "./Components/Pages/Analytics";

const App = () => {
  const [hindalcoData, setHindalcoData] = useState([]);
  const [thresholdGraphData, setThresholdGraphData] = useState([]);
  const [thresholdGraphDateRange, setThresholdGraphDateRange] = useState([]);
  const [processIsRunning, setProcessIsRunning] = useState();
  const [processTimeLeft, setProcessTimeLeft] = useState("");
  const [fixedThermocouples, setFixedThermocouples] = useState([]);
  const [thermocoupleConfiguration, setThermocoupleConfiguration] = useState(
    []
  );
  const [lineName, setLineName] = useState("");
  const [potNumber, setPotNumber] = useState("");
  const [t1Status, setT1Status] = useState([]);
  const [t4Status, setT4Status] = useState([]);
  const [t5Status, setT5Status] = useState([]);
  const [t6Status, setT6Status] = useState([]);
  const [t8Status, setT8Status] = useState([]);

  // fetching data
  useEffect(() => {
    getHindalcoData();
    getHindalcoProcess();

    const hindalcoInterval = setInterval(getHindalcoData, 2000);
    const hindalcoProcessInterval = setInterval(getHindalcoProcess, 2000);

    return () => {
      clearInterval(hindalcoInterval);
      clearInterval(hindalcoProcessInterval);
    };
  }, []);

  // get data api changess
  const getHindalcoData = async () => {
    try {
      const HindalcoCardsViewMore = localStorage.getItem(
        "HindalcoCardsViewMore"
      );
      if (HindalcoCardsViewMore) {
        const response = await axios.get(
          `https://hindalco.xyma.live/backend/getHindalcoData`
          // `http://localhost:4000/backend/getHindalcoData`
        );
        if (response.data.success) {
          setHindalcoData(response.data.data);
        } else {
          console.log("No data found");
        }
      }
    } catch (error) {
      console.error("Error fetching hindalco data", error);
    }
  };

  const getHindalcoProcess = async () => {
    try {
      const response = await axios.get(
        "https://hindalco.xyma.live/backend/getHindalcoProcess"
        // "http://localhost:4000/backend/getHindalcoProcess"
      );
      setThresholdGraphDateRange(response.data.dateRange);
      setThermocoupleConfiguration(response.data.thermocoupleConfiguration);
      setProcessIsRunning(response.data.inTimeRange);
      setProcessTimeLeft(response.data.timeLeft);
      setFixedThermocouples(response.data.selectedThermocouples);
      setLineName(response.data.lineName);
      setPotNumber(response.data.potNumber);
      setT1Status(response.data.t1Status);
      setT4Status(response.data.t4Status);
      setT5Status(response.data.t5Status);
      setT6Status(response.data.t6Status);
      setT8Status(response.data.t8Status);

      if (response.data.success && response.data.inTimeRange) {
        // console.log('data after process time', response.data.data);
        setThresholdGraphData(response.data.data);
      } else if (response.data.success && !response.data.inTimeRange) {
        // console.log('Hindalco process range expired');
      } else if (!response.data.success) {
        // console.log("process stopped");
      }
      // }
    } catch (error) {
      console.log("Error fetching hindalco process", error);
    }
  };

  // console.log("t4 status", t4Status);

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute />}>
          <Route
            index
            element={
              <Dashboard
                dataFromApp={hindalcoData}
                thresholdGraphData={thresholdGraphData}
                thresholdGraphDateRange={thresholdGraphDateRange}
                processIsRunning={processIsRunning}
                processTimeLeft={processTimeLeft}
                fixedThermocouples={fixedThermocouples}
                lineNameDB={lineName}
                potNumberDB={potNumber}
                t1Status={t1Status}
                t4Status={t4Status}
                t5Status={t5Status}
                t6Status={t6Status}
                t8Status={t8Status}
              />
            }
          />
          <Route
            path="Reports"
            element={
              <Reports
                dataFromApp={hindalcoData[0]}
                thermocoupleConfiguration={thermocoupleConfiguration}
              />
            }
          />
          <Route
            path="Analytics"
            element={
              <Analysis
                thermocoupleConfiguration={thermocoupleConfiguration}
                fixedThermocouples={fixedThermocouples}
              />
            }
          />
        </Route>
      </Routes>
    </>
  );
};

export default App;
