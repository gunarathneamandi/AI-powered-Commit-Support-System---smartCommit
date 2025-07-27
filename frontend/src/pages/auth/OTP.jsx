import React, { useState } from "react";
import ContentImage from "../../components/ContentImage";
import Button from "../../components/Button";
import InputField from "../../components/InputField";
import { useNavigate } from "react-router";
import BackButton from "../../components/BackButton";


export default function OTP() {
  const navigate = useNavigate();
  const [OTP, setOTP] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [resending, setResending] = useState(false); // To handle resend button loading

  // Retrieve email from localStorage
  const storedEmail = localStorage.getItem("email");

  async function submitClicked(e) {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(
        "http://192.168.8.105:8000/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: storedEmail, otp: OTP }), // Send email + OTP
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "OTP verification failed");
      }

      const data = await response.json();
      console.log("OTP Verified:", data.message);

      navigate("/ChangePassword"); // Redirect on success
    } catch (error) {
      setErrorMessage(error.message);
      console.error("OTP Verification Failed:", error.message);
    } finally {
      setLoading(false);
    }
  }

  async function resendOTPClicked(e) {
    e.preventDefault();
    setResending(true);
    setErrorMessage("");

    try {
      const response = await fetch("http://192.168.8.105:8000/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: storedEmail }), // Send email to resend OTP
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to resend OTP");
      }

      const data = await response.json();
      console.log("OTP Resent:", data.message);

      // Optionally show a success message to the user
      alert("OTP has been resent. Please check your email.");
    } catch (error) {
      setErrorMessage(error.message);
      console.error("Failed to resend OTP:", error.message);
    } finally {
      setResending(false);
    }
  }

  function RSClicked(e) {
    e.preventDefault();
    setOTP("");
    setErrorMessage("");
  }

  return (
    <div className="w-full h-screen bg-gradient-to-br from-[#69A2AD] to-[#7315E7] flex justify-center items-center">
      <div className="bg-white w-72 h-fit rounded-xl p-4 shadow-lg">
        <ContentImage
          image="https://res.cloudinary.com/dkyv6zp0a/image/upload/v1743067731/login.svg"
          title="Type OTP"
        />
        <div className="flex justify-center">
          <form className="w-full my-2">
            <InputField
              placeholder="OTP"
              value={OTP}
              onChange={(e) => setOTP(e.target.value)}
              icon="https://res.cloudinary.com/dkyv6zp0a/image/upload/v1743068293/otp.svg"
            />

            {errorMessage && (
              <p className="text-red-500 text-center">{errorMessage}</p>
            )}

            <Button
              text={loading ? "Verifying..." : "Submit"}
              color="#710AF1"
              tcolor="#D4B7FA"
              onClick={submitClicked}
              disabled={loading}
            />
            <Button
              text={resending ? "Resending..." : "Resend OTP"}
              color="#D4B7FA"
              tcolor="#710AF1"
              onClick={resendOTPClicked}
              disabled={resending}
            />
          </form>
        </div>
        <BackButton backpath="/forgetpassword" />
      </div>
    </div>
  );
}
