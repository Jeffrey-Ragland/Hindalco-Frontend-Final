import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import loginCover from "../Assets/loginCover.jpg";
import loginVector from "../Assets/loginVector.jpg";
import xymaLogo from "../Assets/xymaLogoWhite.png";
import { FaUserCheck } from "react-icons/fa";
import { PiPasswordFill } from "react-icons/pi";

const Login = () => {
  const [Username, setUsername] = useState("");
  const [Password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLoginFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "https://hindalco.xyma.live/backend/login",
        // "http://localhost:4000/backend/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ Username, Password }),
        }
      );
      const data = await response.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("HindalcoLimit", "100");
        localStorage.setItem("HindalcoCardsViewMore", "false");
        navigate(data.redirectUrl);
      } else {
        alert(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className="h-screen flex justify-center items-center"
      style={{
        backgroundImage: `url(${loginCover})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="backdrop-blur-sm rounded-xl p-4 text-white shadow shadow-white flex flex-col md:flex-row gap-4">
        <div className="p-2 hidden md:block">
          <img src={loginVector} className="max-w-[250px] rounded-2xl" />
        </div>
        <div className="flex flex-col gap-4 justify-center items-center p-4">
          <img src={xymaLogo} className="max-w-[100px]" />
          <form
            className="flex flex-col gap-4"
            onSubmit={handleLoginFormSubmit}
          >
            <div className="border border-white flex justify-between items-center rounded-md p-2">
              <input
                type="text"
                name="Username"
                value={Username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter Username . . ."
                autoComplete="off"
                className="bg-transparent placeholder-gray-300 focus:outline-none"
                required
              />
              <FaUserCheck className="text-2xl" />
            </div>
            <div className="border border-white flex justify-between items-center rounded-md p-2">
              <input
                type="password"
                name="Password"
                value={Password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password . . ."
                className="bg-transparent placeholder-gray-300 focus:outline-none"
                required
              />
              <PiPasswordFill className="text-2xl" />
            </div>
            <button type="submit" className="login-button">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
