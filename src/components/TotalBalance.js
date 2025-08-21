import React from "react";

export default function TotalBalance({ total }) {
  return (
    <div className="bg-white shadow rounded-lg p-6 mx-auto w-full max-w-md text-center">
      <span className="text-4xl font-bold text-green-600 mt-4 block">{total}</span>
    </div>
  );
}
