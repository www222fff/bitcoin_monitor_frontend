import React, { useEffect, useState } from "react";
import axios from "axios";
import LatestUtxo from "./components/LatestUtxo";
import AddressBalances from "./components/AddressBalances";
import TotalBalance from "./components/TotalBalance";
import "./App.css";

function App() {
  const [utxos, setUtxos] = useState([]);
  const [balances, setBalances] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const API_BASE = process.env.REACT_APP_API_URL;

  const fetchData = async () => {
    setIsLoading(true);

    if (!API_BASE) {
      console.error("REACT_APP_API_URL environment variable is not set");
      setIsLoading(false);
      return;
    }

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
      if (err.response?.status === 404) {
        console.error(`API endpoints not found. Check if your backend server is running at ${API_BASE}`);
      }
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
    <div className="loading-spinner">
      <div className="spinner"></div>
      <span>Loading...</span>
    </div>
  );

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1 className="dashboard-title">
            🪙 Bitcoin Dashboard
          </h1>
          <div className="title-divider"></div>
        </div>

        <div className="sections-container">
          <section className="dashboard-section">
            <h2 className="section-header">
              <span>⚡</span> Latest UTXO
            </h2>
            {isLoading ? (
              <LoadingSpinner />
            ) : utxos.length > 0 ? (
              <LatestUtxo utxos={utxos} />
            ) : (
              <p className="no-data">No UTXOs found</p>
            )}
          </section>

          <section className="dashboard-section">
            <h2 className="section-header">
              <span>🏆</span> TOP Balances
            </h2>
            {isLoading ? (
              <LoadingSpinner />
            ) : balances.length > 0 ? (
              <AddressBalances balances={balances} />
            ) : (
              <p className="no-data">No balances found</p>
            )}
          </section>

          <section className="dashboard-section">
            <h2 className="section-header">
              <span>📊</span> Total Valid Address
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
