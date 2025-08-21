import React, { useEffect, useState } from "react";
import axios from "axios";
import LatestUtxo from "./components/LatestUtxo";
import AddressBalances from "./components/AddressBalances";
import TotalBalance from "./components/TotalBalance";

function App() {
  const [utxos, setUtxos] = useState([]);
  const [balances, setBalances] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);

  const API_BASE = process.env.REACT_APP_API_URL;

  const fetchData = async () => {
    try {
      const [utxoRes, balanceRes, totalRes] = await Promise.all([
        axios.get(`${API_BASE}/api/latest-utxo`),
        axios.get(`${API_BASE}/api/top-balances`),
        axios.get(`${API_BASE}/api/total-balances`)
      ]);

      setUtxos(utxoRes.data.result || []);
      setBalances(balanceRes.data.result || []);
      setTotalBalance(totalRes.data.result || "0");
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-start p-8 bg-gray-100 min-h-screen">
      {/* 页面主标题 */}
      <h1 className="text-4xl font-extrabold text-center mb-8 text-blue-800 border-b-4 border-blue-400 pb-2">
        Bitcoin Dashboard
      </h1>

      {/* 最新UTXO */}
      <section className="w-full max-w-3xl mb-8 text-center">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700 border-b-2 border-gray-300 pb-1 inline-block">
          Latest UTXO in Last Block
        </h2>
        {utxos.length > 0 ? (
          <LatestUtxo utxos={utxos} />
        ) : (
          <p className="text-gray-500 mt-4">No UTXOs found</p>
        )}
      </section>

      {/* TOP Balances */}
      <section className="w-full max-w-3xl mb-8 text-center">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700 border-b-2 border-gray-300 pb-1 inline-block">
          TOP Balances
        </h2>
        {balances.length > 0 ? (
          <AddressBalances balances={balances} />
        ) : (
          <p className="text-gray-500 mt-4">No balances found</p>
        )}
      </section>

      {/* 总余额 */}
      <section className="w-full max-w-3xl mb-8 text-center">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700 border-b-2 border-gray-300 pb-1 inline-block">
          Total Valid Balance
        </h2>
        <TotalBalance total={totalBalance} />
      </section>
    </div>
  );
}

export default App;
