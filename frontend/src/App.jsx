import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Welcome from "./pages/auth/Welcome";
import ForgetPassword from "./pages/auth/FogetPassword";
import OTP from "./pages/auth/OTP";
import ChangePassword from "./pages/auth/ChangePassword";
import CommitHistory from "./pages/commitHistory/ComitHistory";
import ExplainingCommits from "./pages/commitHistory/ExplainingCommits";
import ProjectRules from "./pages/admin/rules/ProjectRules";
import AddProjects from "./pages/admin/rules/AddProjects";
import AddUsers from "./pages/admin/addUsers/AddUsers";

import UserRegister from "./pages/UserRegister";
import UserProfile from "./pages/UserProfile";
import UserLogin from "./pages/UserLogin";
import AdminDashboard from "./pages/AdminDashboard";
import { Navigate } from "react-router-dom";

export default function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/forgetpassword" element={<ForgetPassword />} />
          <Route path="/OTP" element={<OTP />} />
          <Route path="/ChangePassword" element={<ChangePassword />} />
          <Route path="/CommitHistory" element={<CommitHistory />} />
          <Route path="/ProjectsRules" element={<ProjectRules />} />
          <Route path="/ExplainingCommits" element={<ExplainingCommits />} />
          <Route path="/AddProjects" element={<AddProjects />} />
          <Route path="/AddUsers" element={<AddUsers />} />
          <Route path="*" element={<Welcome />} />
          <Route path="/userRegister" element={<UserRegister />} />
          <Route path="/userProfile/:userId" element={<UserProfile />} />
          <Route path="/userLogin" element={<UserLogin />} />
          <Route path="/adminDashboard" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
