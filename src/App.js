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
    const interval = setInterval(fetchData, 1800000);
    return () => clearInterval(interval);
  }, []);

 return (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6 space-y-12">
    <h1 className="text-4xl font-extrabold text-center border-b-4 border-blue-500 pb-2 text-blue-700">
      Bitcoin Dashboard
    </h1>

    <section className="w-full max-w-4xl text-center">
      <h2 className="text-2xl font-semibold mb-4 border-b-2 border-gray-300 pb-2">
        Latest UTXO in Last Block
      </h2>
      {utxos.length > 0 ? (
        <LatestUtxo utxos={utxos} />
      ) : (
        <p className="text-gray-500">No UTXOs found</p>
      )}
    </section>

    <section className="w-full max-w-4xl text-center">
      <h2 className="text-2xl font-semibold mb-4 border-b-2 border-gray-300 pb-2">
        TOP Balances
      </h2>
      {balances.length > 0 ? (
        <AddressBalances balances={balances} />
      ) : (
        <p className="text-gray-500">No balances found</p>
      )}
    </section>

    <section className="w-full max-w-4xl text-center">
      <h2 className="text-2xl font-semibold mb-4 border-b-2 border-gray-300 pb-2">
        Total valid Balance
      </h2>
      <TotalBalance total={totalBalance} />
    </section>
  </div>
);

}

export default App;
