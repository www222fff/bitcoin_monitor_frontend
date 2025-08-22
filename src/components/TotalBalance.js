import React from "react";

export default function TotalBalance({ total }) {
  return (
    <div className="total-balance-card">
      <div className="balance-container">
        <div className="balance-label">Total Addresses</div>
        <div className="balance-value">{total}</div>
      </div>
    </div>
  );
}
