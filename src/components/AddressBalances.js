import React from "react";

export default function AddressBalances({ balances }) {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-xl overflow-hidden">
      <div className="max-h-80 overflow-y-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gradient-to-r from-orange-500 to-red-500 text-white sticky top-0">
            <tr>
              <th className="text-center p-3 font-semibold">Address</th>
              <th className="text-center p-3 font-semibold">Balance</th>
            </tr>
          </thead>
          <tbody>
            {balances.map((b, idx) => (
              <tr key={idx} className="border-b border-gray-200 hover:bg-orange-50 transition-colors">
                <td className="p-3 text-center text-sm font-mono text-gray-700 break-all">{b.address}</td>
                <td className="p-3 text-center text-sm font-bold text-orange-600">{b.balance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
