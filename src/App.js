import React from 'react';
import { useEffect, useState } from "react";
import axios from "axios";
import Login from './Components/Pages/Login';
import ProtectedRoute from "./Components/Pages/ProtectedRoute";
import { Route, Routes } from "react-router-dom";
import Dashboard from './Components/Pages/Dashboard';
import Reports from './Components/Pages/Reports';
import Analysis from './Components/Pages/Analytics';
// import GraphTesting from './Components/Pages/GraphTesting';

const App = () => {

  const [hindalcoData, setHindalcoData] = useState([]);

  // for line graph limit
  // const getInitialHindalcoCondition = () => {
  //   const storedLimit = localStorage.getItem("HindalcoLimit");
  //   return storedLimit ? 1 : 0;
  // };

  // const [hindalcoCondition, setHindalcoCondition] = useState(
  //   getInitialHindalcoCondition
  // );

  // useEffect(() => {
  //   if (hindalcoCondition === 0) {
  //     localStorage.setItem("HindalcoLimit", "100");
  //     setHindalcoCondition(1);
  //   }
  // }, []);

  // // for card alert limit
  // const getInitialHindalcoAlertCondition = () => {
  //   const storedLimit = localStorage.getItem("HindalcoAlertLimit");
  //   return storedLimit ? 1 : 0;
  // };

  // const [hindalcoAlertCondition, setHindalcoAlertCondition] = useState(
  //   getInitialHindalcoAlertCondition
  // );

  // useEffect(() => {
  //   if (hindalcoAlertCondition === 0) {
  //     localStorage.setItem("HindalcoAlertLimit", "75");
  //     setHindalcoAlertCondition(1);
  //   }
  // }, []);

  // // for view more cards
  // const getInitialViewCondition = () => {
  //   const storedView = localStorage.getItem('HindalcoCardsViewMore');
  //   return storedView ? 1 : 0;
  // };

  // const [hindalcoViewCondition, setHindalcoViewCondition] = useState(getInitialViewCondition);

  // useEffect(() => {
  //   if(hindalcoViewCondition === 0) {
  //     localStorage.setItem("HindalcoCardsViewMore", 'false');
  //     setHindalcoViewCondition(1);
  //   }
  // },[]);

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
          `https://hindalcoxyma.live/backend/getHindalcoData?limit=${hindalcoLimit}`
          // `http://localhost:4000/backend/getHindalcoData?limit=${hindalcoLimit}`
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

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute />}>
          <Route index element={<Dashboard dataFromApp={hindalcoData} />} />
          <Route path="Reports" element={<Reports dataFromApp={hindalcoData[0]} />} />
          <Route path="Analytics" element={<Analysis />} />
          {/* <Route path="Graphs" element={<GraphTesting />} /> */}
        </Route>
      </Routes>
    </>
  );
}
 
export default App;
