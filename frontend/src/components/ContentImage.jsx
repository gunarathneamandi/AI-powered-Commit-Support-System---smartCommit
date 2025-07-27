import React from "react";

export default function ContentImage({ image,title }) {
  return (
    <div>
      <div className="flex justify-center">
        <h2 className="text-black font-bold text-2xl">{title}</h2>
      </div>
      <div className="flex justify-center">
        <img src={image} className="w-40" />
      </div>
    </div>
  );
}
