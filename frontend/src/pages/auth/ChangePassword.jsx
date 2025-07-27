import React, { useState } from "react";
import ContentImage from "../../components/ContentImage";
import Button from "../../components/Button";
import InputField from "../../components/InputField";
import { useNavigate } from "react-router";
import BackButton from "../../components/BackButton";

export default function ChangePassword() {
  const navigate = useNavigate();
  const [passwords, setPasswords] = useState({
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  async function submitClicked(e) {
    e.preventDefault();

    // Validation
    if (passwords.password !== passwords.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    const email = localStorage.getItem("email"); // Retrieve email from localStorage

    if (!email) {
      setError("Email not found in local storage!");
      return;
    }

    try {
      const response = await fetch(
        "http://192.168.8.105:8000/change-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email, // Add email to the request body
            new_password: passwords.password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        navigate("/userLogin");
      } else {
        setError(data.detail || "Failed to change password.");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Server error. Please try again later.");
    }
  }

  return (
    <div className="w-full h-screen bg-gradient-to-br from-[#69A2AD] to-[#7315E7] flex justify-center items-center">
      <div className="bg-white w-72 h-fit rounded-xl p-4 shadow-lg">
        <ContentImage
          image="https://res.cloudinary.com/dkyv6zp0a/image/upload/v1743067731/login.svg"
          title="Change Password"
        />
        <div className="flex justify-center">
          <form className="w-full my-2">
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

            <InputField
              placeholder="Password"
              value={passwords.password}
              onChange={(e) =>
                setPasswords({ ...passwords, password: e.target.value })
              }
              icon="https://res.cloudinary.com/dkyv6zp0a/image/upload/v1743068372/password.svg"
              type="password"
              isPassword={true}
            />
            <InputField
              placeholder="Confirm Password"
              value={passwords.confirmPassword}
              onChange={(e) =>
                setPasswords({ ...passwords, confirmPassword: e.target.value })
              }
              icon="https://res.cloudinary.com/dkyv6zp0a/image/upload/v1743068372/password.svg"
              type="password"
              isPassword={true}
            />

            <Button
              text="Submit"
              color="#710AF1"
              tcolor="#D4B7FA"
              onClick={submitClicked}
            />
          </form>
        </div>
        <BackButton backpath="/OTP" />
      </div>
    </div>
  );
}
