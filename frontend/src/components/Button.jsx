import React from "react";

export default function Button({ text, color, onClick, tcolor }) {
  return (
    <div className="flex justify-center my-2 ">
      <button
        className={`w-11/12 py-1 rounded-4xl border-2 border-transparent hover:border-black transition duration-300`}
        style={{ backgroundColor: color, color: tcolor }}
        onClick={onClick}
      >
        {text}
      </button>
    </div>
  );
}
