import React from "react";
import { useNavigate } from "react-router-dom";

export default function BackButton({backpath}) {
  const navigate = useNavigate();
  return (
    <div className="flex justify-center">
      <button
        onClick={() => navigate((`${backpath}`))}
        className="flex items-center justify-center gap-2  text-[#710AF1] hover:text-white border border-[#710AF1] hover:bg-[#710AF1] font-medium  px-4 rounded-full transition duration-300 shadow-md"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back
      </button>
    </div>
  );
}
