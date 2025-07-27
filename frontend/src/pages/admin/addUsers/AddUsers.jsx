import React, { useState, useEffect } from "react";
import SideBar from "../../../components/SideBar";
import arrow from "../../../images/arrow.svg";
import deleteicon from "../../../images/delete.svg";
import { useNavigate } from "react-router";
import Button from "../../../components/Button";
import { BackendURL } from "../../../utils/utils";
import ErrorAllert from "../../../components/ErrorAllert";

export default function Projectuserss() {
  const [arr, setArr] = useState([]);
  const [expandedProject, setExpandedProject] = useState(null);
  const navigate = useNavigate();
  const admin = localStorage.getItem("admin") === "true";
  const [useremail, setUseremail] = useState("");
  const [err, setErr] = useState("");

  // Fetch data logic
  const fetchData = () => {
    fetch(`${BackendURL}/get_projects_and_users`, {
      method: "GET",
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorData = await response.json().catch(() => null); // Handle non-JSON responses
          const errorMessage =
            errorData?.message ||
            (response.status === 401
              ? "Unauthorized: Please log in."
              : response.status === 404
              ? "No projects found."
              : response.status === 500
              ? "Server error. Try again later."
              : `Error: ${response.status}`);
          throw new Error(errorMessage);
        }
        return response.json();
      })
      .then((data) => {
        if (!data.projects || !Array.isArray(data.projects)) {
          throw new Error("Invalid data format received.");
        }
        setArr(data.projects); // Set the new projects data
      })
      .catch((error) => {
        setErr(error.message); // Set error state
      });
  };

  // Initial fetch when the component mounts
  useEffect(() => {
    fetchData();
  }, []);

  // Refresh data after successful add or delete operation
  function refreshData() {
    setArr([]); // Clear the data array temporarily
    setErr(""); // Reset any error state
    setUseremail("");
    fetchData(); // Re-fetch data after clearing

  }

  // Handle expand/collapse logic for projects
  function handleArrowClick(projectidx) {
    setExpandedProject(expandedProject === projectidx ? null : projectidx);
  }

  // Delete project
  function deleteProjectClicked(project_name) {
    fetch(`${BackendURL}/delete_project`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ project_name: project_name }),
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorData = await response.json().catch(() => null); // Handle non-JSON responses
          const errorMessage = errorData?.message;
          setErr("Failed to delete project.");
          throw new Error(errorMessage);
        }
        return response.json();
      })
      .then(() => refreshData()) // Refresh after successful delete
      .catch((err) => setErr(err.message));
  }

  // Add project clicked
  function addProjectclicked() {
    navigate("/AddProjects");
  }

  // Email validation
  function isValidEmail(email) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  }

  // Add user to project
  function addUserClicked(projectName, user) {
    if (!isValidEmail(useremail)) {
      setErr("Please enter a valid email address.");
      return;
    }
    fetch(`${BackendURL}/add_user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        project_name: projectName,
        user: user,
      }),
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorData = await response.json().catch(() => null); // Handle non-JSON responses
          const errorMessage = errorData?.message;
          throw new Error(errorMessage);
        }
        return response.json();
      })
      .then(() => refreshData()) // Refresh after successful add
      .catch((err) => setErr(err.message));
  }

  // Delete user from project
  function deleteUserClicked(projectName, user) {
    fetch(`${BackendURL}/delete_user`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        project_name: projectName,
        user: user,
      }),
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorData = await response.json().catch(() => null); // Handle non-JSON responses
          const errorMessage = errorData?.message;
          throw new Error(errorMessage);
        }
        return response.json();
      })
      .then(() => refreshData()) // Refresh after successful user deletion
      .catch((err) => setErr(err.message));
  }

  return (
    <div className="flex w-full min-h-screen">
      <div className="w-1/6 bg-gradient-to-br from-[#69A2AD] to-[#7315E7] border-r-3 border-[#858585] flex justify-center">
        <SideBar />
      </div>
      <div className="w-5/6 bg-gradient-to-br from-[#7315E7] to-[#69A2AD] border-black flex justify-center">
        <div className="p-6 w-5/6">
          <div className="flex justify-center mb-6">
            <h2 className="text-white text-3xl font-semibold">Add Users</h2>
          </div>
          {err && (
            <div>
              <ErrorAllert message={err} />
            </div>
          )}

          {arr.length === 0 ? (
            <p className="text-white text-center">Loading projects...</p>
          ) : (
            <ul>
              {arr.map((project, projectidx) => (
                <div
                  className="bg-[#D4B7FA] m-4 p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out justify-between items-center"
                  key={projectidx}
                >
                  <div className="flex items-center justify-between w-full">
                    <h1 className="text-xl font-semibold text-gray-800">
                      {projectidx + 1}
                    </h1>
                    <h1 className="ml-2 text-2xl font-semibold text-gray-800 text-center flex-1">
                      {project.project_name}
                    </h1>
                    {admin && (
                      <img
                        src={deleteicon}
                        alt="delete"
                        onClick={() =>
                          deleteProjectClicked(project.project_name)
                        }
                        className="cursor-pointer w-6 h-6 mr-5"
                      />
                    )}
                    <img
                      src={arrow}
                      alt="Arrow"
                      onClick={() => handleArrowClick(projectidx)}
                      className="cursor-pointer w-6 h-6 transition-transform duration-300 ease-in-out transform hover:rotate-180"
                    />
                  </div>

                  {expandedProject === projectidx && (
                    <div className="w-full mt-4">
                      <hr className="border-t-2 border-[#710AF1]" />
                      <div className="p-4 rounded-lg shadow-lg">
                        {project.users.map((users, usersidx) => (
                          <div
                            className="flex bg-white p-4 m-2 rounded-lg justify-between items-center shadow-sm hover:shadow-lg transition-shadow duration-300 ease-in-out"
                            key={usersidx}
                          >
                            <div className="flex items-center">
                              <h1 className="mr-4 text-lg font-semibold text-gray-600">
                                {usersidx + 1}
                              </h1>
                              <h1 className="text-lg text-gray-700">{users}</h1>
                            </div>
                            {admin && (
                              <img
                                src={deleteicon}
                                alt="delete"
                                onClick={() =>
                                  deleteUserClicked(project.project_name, users)
                                }
                                className="cursor-pointer w-6 h-6"
                              />
                            )}
                          </div>
                        ))}
                        <div className="flex bg-white p-4 m-2 rounded-lg justify-between items-center shadow-sm hover:shadow-lg ease-in-out">
                          <h1 className="mr-4 text-lg font-semibold text-gray-600">
                            1
                          </h1>
                          <div className="flex items-center justify-center w-full">
                            <input
                              type="text"
                              placeholder="Type users"
                              value={useremail}
                              onChange={(e) => {
                                setUseremail(e.target.value);
                              }}
                              className="flex-grow text-center text-lg bg-transparent border-none outline-none placeholder-gray-500 font-bold text-gray-800"
                              style={{
                                outline: "none",
                                boxShadow: "none",
                              }}
                            />
                          </div>
                          <button
                            className="px-4 py-2 bg-white  text-blue-500 rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
                            onClick={() => {
                              addUserClicked(project.project_name, useremail);
                            }}
                          >
                            ADD
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {admin && (
                <Button
                  text="AddProject"
                  color="#710AF1"
                  tcolor="black"
                  onClick={addProjectclicked}
                />
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
