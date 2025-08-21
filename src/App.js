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
      setTotalBalance(totalRes.data || "0");
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
  <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
    <h1 className="text-3xl font-bold text-center mb-6">Bitcoin Dashboard</h1>

    <section>
      <h2 className="text-2xl font-semibold mb-4">Latest UTXO in Last Block</h2>
      {utxos.length > 0 ? (
        <LatestUtxo utxos={utxos} />
      ) : (
        <p className="text-gray-500">No UTXOs found</p>
      )}
    </section>

    <section>
      <h2 className="text-2xl font-semibold mb-4">TOP Balances</h2>
      {balances.length > 0 ? (
        <AddressBalances balances={balances} />
      ) : (
        <p className="text-gray-500">No balances found</p>
      )}
    </section>

    <section>
      <h2 className="text-2xl font-semibold mb-4">Total valid Balance</h2>
      <TotalBalance total={totalBalance} />
    </section>
  </div>
);

}

export default App;

