import React, { useState } from "react";
import ContentImage from "../../components/ContentImage";
import Button from "../../components/Button";
import InputField from "../../components/InputField";
import { useNavigate } from "react-router";
import BackButton from "../../components/BackButton";

export default function ForgetPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  async function sendOTPClicked(e) {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://192.168.8.105:8000/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }), // Sending only email
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to send OTP");
      }

      console.log("OTP sent successfully!");

      // Store email in localStorage
      localStorage.setItem("email", email);

      navigate("/OTP"); // Navigate to OTP page after successful request
    } catch (error) {
      console.error("Error:", error.message);
      setError("Failed to send OTP. Please try again.");
    }
  }

  return (
    <div className="w-full h-screen bg-gradient-to-br from-[#69A2AD] to-[#7315E7] flex justify-center items-center">
      <div className="bg-white w-72 h-fit rounded-xl p-4 shadow-lg">
        <ContentImage
          image="https://res.cloudinary.com/dkyv6zp0a/image/upload/v1743067731/login.svg"
          title="Forget Password"
        />
        <div className="flex justify-center">
          <form className="w-full my-2">
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            <InputField
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon="https://res.cloudinary.com/dkyv6zp0a/image/upload/v1743067852/email.svg"
            />

            <Button
              text="Send OTP"
              color="#710AF1"
              tcolor="#D4B7FA"
              onClick={sendOTPClicked}
            />
          </form>
        </div>
        <BackButton backpath="/userLogin" />
      </div>
    </div>
  );
}
