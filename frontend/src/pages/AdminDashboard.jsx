import React from "react";
import SideBar from "../components/SideBar";
import { FaUserCircle } from "react-icons/fa";

const AdminDashboard = () => {
  return (
    <div className="flex w-full min-h-screen">
      {/* Sidebar */}
      <div className="w-1/6 bg-gradient-to-br from-[#69A2AD] to-[#7315E7] border-r-3 border-[#858585]">
        <SideBar />
      </div>

      {/* Main Content */}
      <div className="w-5/6 bg-gradient-to-br from-[#7315E7] to-[#69A2AD] flex flex-col items-center justify-center">
      {/* Title */}
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Admin</h2>

        <div className="bg-white p-8 rounded-2xl shadow-2xl w-3/5">
          <div className="flex justify-center mb-6">
            <FaUserCircle className="text-6xl text-purple-500" />
          </div>

          
          {/* User Details */}
          <div className="space-y-6">
            {/* Username */}
            <div className="flex items-center">
              <label className="w-1/3 text-gray-700 font-semibold">
                User Name:
              </label>
              <input
                type="text"
                value="admin"
                readOnly
                className="w-2/3 bg-purple-100 text-gray-700 py-2 px-4 rounded-full focus:outline-none"
              />
            </div>

            {/* Email */}
            <div className="flex items-center">
              <label className="w-1/3 text-gray-700 font-semibold">
                E-mail:
              </label>
              <input
                type="email"
                value="admin@gmail.com"
                readOnly
                className="w-2/3 bg-purple-100 text-gray-700 py-2 px-4 rounded-full focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
