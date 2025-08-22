import React from "react";

export default function TotalBalance({ total }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        fontSize: '2.5rem',
        fontWeight: '700',
        color: 'white',
        textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
      }}>
        {total}
      </div>
    </div>
  );
}
