import React, { useState } from 'react';
import { Link, useLocation } from "react-router-dom";
import xymaLogoWhite from "../Assets/xymaLogoWhite.png";
import hindalcoLogo from "../Assets/hindalcoLogo.png";
import { ImExit } from "react-icons/im";
import { IoCloseSharp, IoMenu, IoAnalyticsSharp } from "react-icons/io5";
import { LuLayoutDashboard } from "react-icons/lu";
import { LiaFileExcelSolid } from "react-icons/lia";
import { AiOutlineLogout } from "react-icons/ai";


const Navbar = () => {

    const [hamburgerPopup, setHamburgerPopup] = useState(false);
    const location = useLocation();

  return (
    <>
      <div className="relative flex justify-between items-center text-white 2xl:text-xl">
        <div className="flex items-center gap-2">
          <div>
            <img
              src={xymaLogoWhite}
              alt="xymaLogo"
              className="max-h-8 md:max-h-12 2xl:max-h-14"
            />
          </div>
          <div className="md:hidden">
            <img
              src={hindalcoLogo}
              alt="hindalcoLogo"
              className="h-10 md:h-14 2xl:h-16"
            />
          </div>
        </div>
        {/* title */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs md:text-2xl text-center font-bold">
          Data Logger
        </div>

        {/* hindalco logo , logout */}
        <div className="hidden xl:flex gap-4 items-center">
          {/* navbar */}
          <div className="flex items-center gap-4 mr-4">
            <Link to="/">
              <div
                className={`flex flex-col items-center ${
                  location.pathname === "/"
                    ? "text-[#9cb3d6] font-semibold text-xl"
                    : "hover:scale-110 duration-200 hover:text-[#9cb3d6] "
                } `}
              >
                Dashboard
                {location.pathname === "/" && (
                  <div className="relative w-full h-[6px] overflow-hidden flex justify-center items-center">
                    <div className="absolute bottom-0 w-4 h-8 rounded-full bg-[#9cb3d6]"></div>
                  </div>
                )}
              </div>
            </Link>

            <div>/</div>

            <Link to="/Reports">
              <div
                className={`flex flex-col items-center ${
                  location.pathname === "/Reports"
                    ? "text-[#9cb3d6] font-semibold text-xl"
                    : "hover:scale-110 duration-200 hover:text-[#9cb3d6] "
                }`}
              >
                Reports
                {location.pathname === "/Reports" && (
                  <div className="relative w-full h-[6px] overflow-hidden flex justify-center items-center">
                    <div className="absolute bottom-0 w-4 h-8 rounded-full bg-[#9cb3d6]"></div>
                  </div>
                )}
              </div>
            </Link>

            <div>/</div>

            <Link to="/Analytics">
              <div
                className={`flex flex-col items-center ${
                  location.pathname === "/Analytics"
                    ? "text-[#9cb3d6] font-semibold text-xl"
                    : "hover:scale-110 duration-200 hover:text-[#9cb3d6] "
                }`}
              >
                Analytics
                {location.pathname === "/Analytics" && (
                  <div className="relative w-full h-[6px] overflow-hidden flex justify-center items-center">
                    <div className="absolute bottom-0 w-4 h-8 rounded-full bg-[#9cb3d6]"></div>
                  </div>
                )}
              </div>
            </Link>
          </div>

          <div>
            <img
              src={hindalcoLogo}
              alt="hindalcoLogo"
              className="h-10 md:h-14 2xl:h-16"
            />
          </div>
          <Link to="/login">
            <button
              className="logout-button"
              onClick={() => localStorage.clear()}
            >
              <div className="logout-logo text-white">
                <ImExit className="text-xl 2xl:text-[22px]" />
              </div>
              <div className="logout-text text-lg ">Logout</div>
            </button>
          </Link>
        </div>

        {/* hamburger menu */}
        <div
          className="xl:hidden relative z-10"
          onClick={() => setHamburgerPopup(!hamburgerPopup)}
        >
          {hamburgerPopup === false ? (
            <IoMenu className="text-3xl" />
          ) : (
            <IoCloseSharp className="text-3xl" />
          )}

          {hamburgerPopup && (
            <div className="rounded-sm border border-gray-300 absolute right-0 flex flex-col gap-4 bg-stone-200 p-2 text-gray-600 text-sm font-medium">
              <Link to="/">
                <div className="border border-b-gray-400 flex items-center gap-1">
                  <LuLayoutDashboard className="text-lg" />
                  Dashboard
                </div>
              </Link>

              <Link to="/Reports">
                <div className="border border-b-gray-400 flex items-center gap-1">
                  <LiaFileExcelSolid className="text-lg" />
                  Reports
                </div>
              </Link>

              <Link to="/Analytics">
                <div className="border border-b-gray-400 flex items-center gap-1">
                  <IoAnalyticsSharp className="text-lg" />
                  Analytics
                </div>
              </Link>

              <Link to="/login">
                <div
                  className="border border-b-gray-400 flex items-center gap-1"
                  onClick={() => localStorage.clear()}
                >
                  <AiOutlineLogout className="text-lg" />
                  Logout
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Navbar
