import React from "react";
import { useNavigate } from "react-router-dom";

export default function SideBar() {
  const navigate = useNavigate();
  const admin = localStorage.getItem("admin") === "true";

  const getLinkStyle = (path) => {
    return window.location.pathname === path
      ? "text-black underline font-semibold"
      : "text-white text-lg hover:underline";
  };

  const handleLogout = () => {
    localStorage.clear(); // Clear all stored data (e.g., tokens, admin flag)
    navigate("/userLogin"); // Redirect to the login page
  };

  return (
    <div className="w-full h-full flex flex-col justify-between items-center py-8 bg-gradient-to-br from-[#69A2AD] to-[#7315E7]">
      {/* Links */}
      <div className="space-y-6 text-white">
        <h2
          className={getLinkStyle("/")}
          onClick={
            () =>
              admin
                ? navigate("/adminDashboard") // Navigate to Admin Dashboard if admin
                : navigate("/userProfile/" + localStorage.getItem("userId")) // Navigate to User Profile otherwise
          }
          style={{ cursor: "pointer" }}
        >
          Your Account
        </h2>
        <h2
          className={getLinkStyle("/ProjectsRules")}
          onClick={() => navigate("/ProjectsRules")}
          style={{ cursor: "pointer" }}
        >
          Your Projects
        </h2>
        {admin ? (
          <h2
            className={getLinkStyle("/AddUsers")}
            onClick={() => navigate("/AddUsers")}
            style={{ cursor: "pointer" }}
          >
            Add Users
          </h2>
        ) : (
          <h2
            className={getLinkStyle("/CommitHistory")}
            onClick={() => navigate("/CommitHistory")}
            style={{ cursor: "pointer" }}
          >
            Commit History
          </h2>
        )}
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="bg-purple-600 text-white py-2 px-6 rounded-full font-semibold hover:bg-purple-700 transition"
      >
        LogOut
      </button>
    </div>
  );
}
