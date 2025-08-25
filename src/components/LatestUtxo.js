import React from "react";

export default function LatestUtxo({ utxos }) {
  const extractAddress = (fullAddress) => {
    const parts = fullAddress.split('_');
    return parts.length > 1 ? parts[1] : fullAddress;
  };

  return (
    <div className="data-table">
      <table className="table">
        <thead className="table-header">
          <tr>
            <th>Address</th>
            <th>UTXO</th>
          </tr>
        </thead>
        <tbody>
          {utxos.map((u, idx) => (
            <tr key={idx} className="table-row">
              <td className="table-cell mono">{extractAddress(u.address)}</td>
              <td className="table-cell highlight">{u.utxo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
