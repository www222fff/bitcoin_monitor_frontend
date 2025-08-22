import React from "react";

export default function TotalBalance({ total }) {
  return (
    <div className="text-center">
      <div className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl p-6 shadow-lg">
        <div className="text-white text-sm font-medium mb-2">Total Addresses</div>
        <div className="text-4xl font-bold text-white drop-shadow-md">{total}</div>
      </div>
    </div>
  );
}
