import React, { useState } from "react";
import SideBar from "../../../components/SideBar";
import { Form, useNavigate } from "react-router";
import Button from "../../../components/Button";
import deleteIcon from "../../../images/delete.svg";
import { BackendURL } from "../../../utils/utils";
import ErrorAlert from "../../../components/ErrorAllert";

export default function AddProjects() {
  const [inputs, setInputs] = useState({ rule: "", user: "" });
  const [projectName, setProjectName] = useState("");
  const [rules, setRules] = useState([""]);
  const [users, setUsers] = useState([""]);
  const [err, setErr] = useState("");

  function addRulesclicked(id) {
    setRules((prevRules) =>
      prevRules.map((r, idx) => (idx === id ? inputs.rule : r))
    );
    setRules((prevRules) => [...prevRules, ""]);
    setInputs((prev) => ({
      ...prev,
      rule: "",
    }));
  }

  function addUserclicked(id) {
    setUsers((prevUsers) =>
      prevUsers.map((u, idx) => (idx === id ? inputs.user : u))
    );
    setUsers((prevUsers) => [...prevUsers, ""]);
    setInputs((prev) => ({
      ...prev,
      user: "",
    }));
  }
  function deleteClick(id, setfunc) {
    setfunc((prevValue) => prevValue.filter((_, idx) => idx !== id));
  }

  function isValidEmail(email) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  }
  function addUserclicked(id) {
    if (!isValidEmail(inputs.user)) {
      setErr("Please enter a valid email address.");
      return; // Prevent adding if invalid email
    }
    setUsers((prevUsers) =>
      prevUsers.map((u, idx) => (idx === id ? inputs.user : u))
    );
    setUsers((prevUsers) => [...prevUsers, ""]);
    setInputs((prev) => ({
      ...prev,
      user: "",
    }));
  }
  
  function SubmitFunction() {
    //   e.preventDefault();  // Prevents page refresh
    //   setForm({ projectName: projectName, rules: rules, users: users });
    console.log({ projectName, rules, users });
    fetch(`${BackendURL}/add_project`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        project_name: projectName,
        rules: rules.slice(0, -1), // Correct slicing
        users: users.slice(0, -1), // Correct slicing
      }),
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorData = await response.json().catch(() => null); // Handle non-JSON responses
          const errorMessage = errorData?.message;
          setErr("Failed to add project.");
          throw new Error(errorMessage);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Project added successfully:", data);
        // Optionally, update your state to reflect the new data
        setProjectName("");
        setRules([""]);
        setUsers([""]);
        setErr("");
      })
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
            <h2 className="text-white text-3xl font-semibold">Add Projects</h2>
          </div>
          {err && (
            <div>
              <ErrorAlert message={err} />
            </div>
          )}
          <div className="bg-[#D4B7FA] m-4 p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
            <div className="flex items-center w-full">
              {/* Left-aligned Project Name */}
              <h1 className="text-xl font-semibold mr-4 text-gray-800">
                Project Name:
              </h1>

              {/* Input Field (next to Project Name) */}
              <input
                type="text"
                placeholder="Project Name"
                value={projectName}
                onChange={(e) => {
                  setProjectName(e.target.value);
                }}
                className="flex-grow text-center text-lg bg-transparent border-none outline-none placeholder-gray-500 font-bold text-gray-800"
                style={{
                  outline: "none" /* Remove outline */,
                  boxShadow: "none" /* Remove focus box shadow */,
                }}
              />
            </div>
          </div>

          {/* <form onSubmit={SubmitFunction}> */}
          {rules.map((rule, ruleId) => (
            <div
              className="bg-[#D4B7FA] m-4 p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out text-gray-800"
              key={ruleId}
            >
              <div className="flex items-center w-full">
                <h1 className="text-xl font-semibold mr-4">
                  Rule {ruleId + 1}:
                </h1>
                <input
                  type="text"
                  placeholder="Type Rule"
                  value={rule === "" ? inputs.rule : rules[ruleId]}
                  onChange={(e) =>
                    rule === ""
                      ? setInputs((prev) => ({
                          ...prev,
                          rule: e.target.value,
                        }))
                      : setRules((prevRules) =>
                          prevRules.map((r, idx) =>
                            idx === ruleId ? e.target.value : r
                          )
                        )
                  }
                  className="flex-grow text-center text-lg bg-transparent border-none outline-none placeholder-gray-500 font-bold text-gray-800"
                  style={{
                    outline: "none" /* Remove outline */,
                    boxShadow: "none" /* Remove focus box shadow */,
                  }}
                />
                {rule === "" ? (
                  <button
                    className="px-4 py-2   text-blue-500 rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
                    onClick={() => addRulesclicked(rules.length - 1)}
                  >
                    ADD
                  </button>
                ) : (
                  <img
                    src={deleteIcon}
                    alt="delete"
                    onClick={() => deleteClick(ruleId, setRules)}
                    className="cursor-pointer w-6 h-6"
                  />
                )}
              </div>
            </div>
          ))}

          {users.map((user, userId) => (
            <div
              className="bg-[#D4B7FA] m-4 p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out text-gray-800"
              key={userId}
            >
              <div className="flex items-center w-full">
                <h1 className="text-xl font-semibold mr-4">
                  User {userId + 1}:
                </h1>
                <input
                  type="text"
                  placeholder="Type user"
                  value={user === "" ? inputs.user : users[userId]}
                  onChange={(e) =>
                    user === ""
                      ? setInputs((prev) => ({
                          ...prev,
                          user: e.target.value,
                        }))
                      : setUsers((prevusers) =>
                          prevusers.map((r, idx) =>
                            idx === userId ? e.target.value : r
                          )
                        )
                  }
                  className="flex-grow text-center text-lg bg-transparent border-none outline-none placeholder-gray-500 font-bold text-gray-800"
                  style={{
                    outline: "none" /* Remove outline */,
                    boxShadow: "none" /* Remove focus box shadow */,
                  }}
                />
                {user === "" ? (
                  <button
                    className="px-4 py-2   text-blue-500 rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
                    onClick={() => addUserclicked(users.length - 1)}
                  >
                    ADD
                  </button>
                ) : (
                  <img
                    src={deleteIcon}
                    alt="delete"
                    onClick={() => deleteClick(userId, setUsers)}
                    className="cursor-pointer w-6 h-6"
                  />
                )}
              </div>
            </div>
          ))}
          <Button
            text="save"
            color="#710AF1"
            tcolor="black"
            onClick={SubmitFunction}
          />
          {/* </form> */}
        </div>
      </div>
    </div>
  );
}
