import React from "react";

export default function LatestUtxo({ utxos }) {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-xl overflow-hidden">
      <div className="max-h-80 overflow-y-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white sticky top-0">
            <tr>
              <th className="text-center p-3 font-semibold">Address</th>
              <th className="text-center p-3 font-semibold">UTXO</th>
            </tr>
          </thead>
          <tbody>
            {utxos.slice(0, 20).map((u, idx) => (
              <tr key={idx} className="border-b border-gray-200 hover:bg-blue-50 transition-colors">
                <td className="p-3 text-center text-sm font-mono text-gray-700 break-all">{u.address}</td>
                <td className="p-3 text-center text-sm font-medium text-indigo-600">{u.utxo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
