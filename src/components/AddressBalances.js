import React from "react";

export default function AddressBalances({ balances }) {
  const extractAddress = (fullAddress) => {
    const parts = fullAddress.split('_');
    return parts.length > 1 ? parts[1] : fullAddress;
  };

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
              <td className="table-cell mono">{extractAddress(b.address)}</td>
              <td className="table-cell highlight orange">{b.balance.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
