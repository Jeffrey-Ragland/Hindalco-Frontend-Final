import React from 'react';
import Navbar from "./Navbar";

const Analytics = () => {
  return (
    <div className="h-screen text-gray-600 p-4 flex flex-col gap-2 ">
      {/* top bar - h-[10%] */}
      <div className="xl:h-[10%]">
        <Navbar />
      </div>
    </div>
  );
};

export default Analytics;
