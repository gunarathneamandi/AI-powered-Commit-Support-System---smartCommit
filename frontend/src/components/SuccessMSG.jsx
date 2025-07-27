import React from "react";
import { CheckCircle } from "lucide-react";

export default function SuccessMSG({ message }) {
  return (
    <div className="flex items-center gap-3 m-3 p-4 bg-green-100 text-green-700 rounded-lg shadow-md border border-green-400">
      <CheckCircle className="text-green-700 w-6 h-6" />
      <h2 className="font-medium text-md">{message}</h2>
    </div>
  );
}
