import React, { useEffect, useState } from "react";
import axios from "axios";
import LatestUtxo from "./components/LatestUtxo";
import AddressBalances from "./components/AddressBalances";
import TotalBalance from "./components/TotalBalance";

function App() {
  const [utxos, setUtxos] = useState([]);
  const [balances, setBalances] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const API_BASE = process.env.REACT_APP_API_URL;

  const fetchData = async () => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 1800000);
    return () => clearInterval(interval);
  }, []);

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      <span className="ml-2 text-white">Loading...</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800 p-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-white mb-4 drop-shadow-lg">
            🪙 Bitcoin Dashboard
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto rounded-full"></div>
        </div>

        <div className="flex flex-col items-center justify-center space-y-8 max-w-4xl mx-auto">
          <section className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-2xl border border-white/20">
            <h2 className="text-2xl font-bold mb-6 text-center text-white flex items-center justify-center">
              <span className="mr-2">⚡</span> Latest UTXO
            </h2>
            {isLoading ? (
              <LoadingSpinner />
            ) : utxos.length > 0 ? (
              <LatestUtxo utxos={utxos} />
            ) : (
              <p className="text-white/70 text-center">No UTXOs found</p>
            )}
          </section>

          <section className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-2xl border border-white/20">
            <h2 className="text-2xl font-bold mb-6 text-center text-white flex items-center justify-center">
              <span className="mr-2">🏆</span> TOP Balances
            </h2>
            {isLoading ? (
              <LoadingSpinner />
            ) : balances.length > 0 ? (
              <AddressBalances balances={balances} />
            ) : (
              <p className="text-white/70 text-center">No balances found</p>
            )}
          </section>

          <section className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-2xl border border-white/20">
            <h2 className="text-2xl font-bold mb-6 text-center text-white flex items-center justify-center">
              <span className="mr-2">📊</span> Total Valid Address
            </h2>
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <TotalBalance total={totalBalance} />
            )}
          </section>
        </div>
      </div>
    </div>
  );

}

export default App;
