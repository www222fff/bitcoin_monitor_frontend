import React from "react";

export default function AddressBalances({ balances }) {
  return (
    <div className="bg-white shadow rounded-lg p-4 mx-auto w-full max-w-2xl text-center">
      <table className="w-full border-collapse text-center mx-auto">
        <thead>
          <tr className="border-b">
            <th className="p-2">Address</th>
            <th className="p-2">Balance</th>
          </tr>
        </thead>
        <tbody>
          {balances.map((b, idx) => (
            <tr key={idx} className="border-b hover:bg-gray-100">
              <td className="p-2">{b.address}</td>
              <td className="p-2">{b.balance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
