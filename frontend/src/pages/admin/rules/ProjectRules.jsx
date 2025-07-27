import React, { useState, useEffect } from "react";
import SideBar from "../../../components/SideBar";
import arrow from "../../../images/arrow.svg";
import deleteicon from "../../../images/delete.svg";
import { useNavigate } from "react-router";
import Button from "../../../components/Button";
import { BackendURL } from "../../../utils/utils";
import ErrorAlert from "../../../components/ErrorAllert";

export default function ProjectRules() {
  const [arr, setArr] = useState([]);
  const [expandedProject, setExpandedProject] = useState(null);
  const navigate = useNavigate();
  const admin = localStorage.getItem("admin") === "true";
  const stored_mail = localStorage.getItem("email");
  const [rule, setRule] = useState("");
  const [err, setErr] = useState("");
  const [uri, setUri] = useState("");

  useEffect(() => {
    if (admin) {
      setUri(`${BackendURL}/admin/get_projects_and_rules`);
    } else {
      setUri(`${BackendURL}/get_projects_and_rules`);
    }
  }, []); // Dependency array ensures uri is updated when 'admin' changes

  const fetchData = () => {
    fetch(uri, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Added content type for JSON body
      },
      body: JSON.stringify({
        email: stored_mail,
        
      }),
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorData = await response.json().catch(() => null); // Handle non-JSON responses
          const errorMessage = errorData?.message;
          setErr("Failed to fetch projects.");
          throw new Error(errorMessage);
        }
        return response.json();
      })
      .then((data) => {
        if (!data.projects || !Array.isArray(data.projects)) {
          throw new Error("Invalid data format received.");
        }
        setArr(data.projects);
      })
      .catch((error) => {
        setErr(error.message);
      });
  };

  useEffect(() => {
    if (uri) fetchData();
  }, [uri]); // Fetch data when the URI changes

  const refreshData = () => {
    setArr([]); // Clear the data array temporarily
    setErr(""); // Reset any error state
    setRule("");
    fetchData(); // Re-fetch data after clearing
  };

  function handleArrowClick(projectidx) {
    setExpandedProject(expandedProject === projectidx ? null : projectidx);
  }

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
      .then(() => refreshData()) // Refresh data after successful deletion
      .catch((err) => setErr(err.message));
  }

  function deleteRuleClicked(projectName, rule) {
    fetch(`${BackendURL}/delete_rule`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        project_name: projectName,
        rule: rule,
      }),
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorData = await response.json().catch(() => null); // Handle non-JSON responses
          const errorMessage = errorData?.message;
          setErr("Failed to delete rule.");
          throw new Error(errorMessage);
        }
        return response.json();
      })
      .then(() => refreshData()) // Refresh data after successful deletion
      .catch((err) => setErr(err.message));
  }

  function addProjectclicked() {
    navigate("/AddProjects");
  }

  function addRuleClicked(projectName, rule) {
    fetch(`${BackendURL}/add_rule`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        project_name: projectName,
        rule: rule,
      }),
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorData = await response.json().catch(() => null); // Handle non-JSON responses
          const errorMessage = errorData?.message;
          setErr("Failed to add rule.");
          throw new Error(errorMessage);
        }
        return response.json();
      })
      .then(() => refreshData()) // Refresh data after adding rule
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
            <h2 className="text-white text-3xl font-semibold">
              Your Projects & Rules
            </h2>
          </div>
          {err && (
            <div>
              <ErrorAlert message={err} />
            </div>
          )}

          {arr.length === 0 ? (
            <p className="text-white text-center">Loading projects...</p>
          ) : (
            <ul>
              {arr.map((project, projectidx) => (
                <div
                  className="bg-[#D4B7FA] m-4 p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out justify-between items-center text-gray-800"
                  key={projectidx}
                >
                  <div className="flex items-center justify-between w-full">
                    <h1 className="text-xl font-semibold">{projectidx + 1}</h1>
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
                        {project.rules.map((rule, ruleidx) => (
                          <div
                            className="flex bg-white p-4 m-2 rounded-lg justify-between items-center shadow-sm hover:shadow-lg transition-shadow duration-300 ease-in-out"
                            key={ruleidx}
                          >
                            <div className="flex items-center">
                              <h1 className="mr-4 text-lg font-semibold text-gray-600">
                                {ruleidx + 1}
                              </h1>
                              <h1 className="text-lg text-gray-700">{rule}</h1>
                            </div>
                            {admin && (
                              <img
                                src={deleteicon}
                                alt="delete"
                                onClick={() =>
                                  deleteRuleClicked(project.project_name, rule)
                                }
                                className="cursor-pointer w-6 h-6"
                              />
                            )}
                          </div>
                        ))}
                        {admin && (
                        <div className="flex bg-white p-4 m-2 rounded-lg justify-between items-center shadow-sm hover:shadow-lg ease-in-out">
                          <h1 className="mr-4 text-lg font-semibold text-gray-600">
                            1
                          </h1>
                          <div className="flex items-center justify-center w-full">
                            <input
                              type="text"
                              placeholder="Type Rule"
                              className="flex-grow text-center text-lg bg-transparent border-none outline-none placeholder-gray-500 font-bold text-gray-800"
                              style={{
                                outline: "none" /* Remove outline */,
                                boxShadow: "none" /* Remove focus box shadow */,
                              }}
                              value={rule}
                              onChange={(e) => setRule(e.target.value)}
                            />
                          </div>
                          <button
                            className="px-4 py-2 bg-white  text-blue-500 rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
                            onClick={() =>
                              addRuleClicked(project.project_name, rule)
                            }
                          >
                            ADD
                          </button>
                        </div>)}
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
