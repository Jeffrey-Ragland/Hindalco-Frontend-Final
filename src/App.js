import React from 'react';
import { useEffect, useState } from "react";
import axios from "axios";
import Login from './Components/Pages/Login';
import ProtectedRoute from "./Components/Pages/ProtectedRoute";
import { Route, Routes } from "react-router-dom";
import Dashboard from './Components/Pages/Dashboard';
import Reports from './Components/Pages/Reports';
import Analysis from './Components/Pages/Analytics';

const App = () => {

  const [hindalcoData, setHindalcoData] = useState([]);

  // fetching data
  useEffect(() => {
    getHindalcoData();

    const hindalcoInterval = setInterval(getHindalcoData, 2000);

    return () => {
      clearInterval(hindalcoInterval);
    };
  }, []);

  // get data api
  const getHindalcoData = async () => {
    try {
      const hindalcoLimit = localStorage.getItem("HindalcoLimit");
      const hindalcoAlertLimit = localStorage.getItem("HindalcoAlertLimit");
      const HindalcoCardsViewMore = localStorage.getItem("HindalcoCardsViewMore");
      // console.log('localstorage', hindalcoLimit);
      if (hindalcoLimit && hindalcoAlertLimit && HindalcoCardsViewMore) {
        const response = await axios.get(
          // `https://hindalco.xyma.live/backend/getHindalcoData?limit=${hindalcoLimit}`
          `http://localhost:4000/backend/getHindalcoData?limit=${hindalcoLimit}`
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

  // console.log('hindalco data', hindalcoData);
  // mac update

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute />}>
          <Route index element={<Dashboard dataFromApp={hindalcoData} />} />
          <Route path="Reports" element={<Reports dataFromApp={hindalcoData[0]} />} />
          <Route path="Analytics" element={<Analysis />} />
        </Route>
      </Routes>
    </>
  );
}
 
export default App;
