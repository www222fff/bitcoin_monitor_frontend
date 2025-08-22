import React from "react";

export default function AddressBalances({ balances }) {
  return (
    <div className="data-table">
      <table className="table">
        <thead className="table-header orange">
          <tr>
            <th>Address</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          {balances.map((b, idx) => (
            <tr key={idx} className="table-row orange">
              <td className="table-cell mono">{b.address}</td>
              <td className="table-cell highlight orange">{b.balance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
