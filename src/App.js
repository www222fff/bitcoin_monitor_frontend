import React, { useEffect, useState } from "react";
import axios from "axios";
import LatestUtxo from "./components/LatestUtxo";
import AddressBalances from "./components/AddressBalances";
import TotalBalance from "./components/TotalBalance";
import { FaBitcoin, FaDiscord } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { IoFlash } from "react-icons/io5";
import { FaTrophy, FaChartBar } from "react-icons/fa";
import "./App.css";

function App() {
  const [utxos, setUtxos] = useState([]);
  const [blockHeight, setBlockHeight] = useState(null);
  const [balances, setBalances] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [loadingStates, setLoadingStates] = useState({
    utxos: true,
    balances: true,
    total: true
  });
  const [hasError, setHasError] = useState(false);

  const API_BASE = process.env.REACT_APP_API_URL;

  // Retry utility function
  const retryRequest = async (requestFn, maxRetries = 3, delayMs = 5000) => {
    let lastError;

    for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
      try {
        return await requestFn();
      } catch (error) {
        lastError = error;
        console.warn(`API request failed (attempt ${attempt}/${maxRetries + 1}):`, error.message);

        if (attempt <= maxRetries) {
          console.log(`Retrying in ${delayMs/1000} seconds...`);
          await new Promise(resolve => setTimeout(resolve, delayMs));
        }
      }
    }

    throw lastError;
  };

  const fetchData = async () => {
    setLoadingStates({
      utxos: true,
      balances: true,
      total: true
    });
    setHasError(false);

    if (!API_BASE) {
      console.error("REACT_APP_API_URL environment variable is not set");
      setHasError(true);
      setLoadingStates({
        utxos: false,
        balances: false,
        total: false
      });
      return;
    }

    // Fetch UTXO data
    fetchUtxos();

    // Fetch balance data
    fetchBalances();

    // Fetch total balance data
    fetchTotalBalance();
  };

  const fetchUtxos = async () => {
    try {
      const response = await retryRequest(
        () => axios.get(`${API_BASE}/api/latest-utxo`)
      );
      const result = response.data.result || [];

      // Extract blockHeight from first item if present
      let processedUtxos = [];
      let extractedBlockHeight = null;

      if (result.length > 0) {
        const firstItem = result[0];
        if (firstItem.blockHeight !== undefined) {
          extractedBlockHeight = firstItem.blockHeight;
          // Process remaining items as address-value pairs
          processedUtxos = result.slice(1).map(item => {
            const address = Object.keys(item)[0];
            const utxo = item[address];
            return { address, utxo };
          });
        } else {
          // Fallback to old structure if no blockHeight
          processedUtxos = result;
        }
      }

      setUtxos(processedUtxos);
      setBlockHeight(extractedBlockHeight);
    } catch (err) {
      console.error("Error fetching UTXOs after all retries:", err);
    } finally {
      setLoadingStates(prev => ({ ...prev, utxos: false }));
    }
  };

  const fetchBalances = async () => {
    try {
      const response = await retryRequest(
        () => axios.get(`${API_BASE}/api/top-balances`)
      );
      const result = response.data.result || [];

      // Process new structure: convert object key-value pairs to array
      const processedBalances = result.map(item => {
        if (item.address && item.balance !== undefined) {
          // Old structure - keep as is
          return item;
        } else {
          // New structure - extract address and balance from key-value
          const address = Object.keys(item)[0];
          const balance = item[address];
          return { address, balance };
        }
      });

      setBalances(processedBalances);
    } catch (err) {
      console.error("Error fetching balances after all retries:", err);
    } finally {
      setLoadingStates(prev => ({ ...prev, balances: false }));
    }
  };

  const fetchTotalBalance = async () => {
    try {
      const response = await retryRequest(
        () => axios.get(`${API_BASE}/api/total-balances`)
      );
      setTotalBalance(response.data.result || "0");
    } catch (err) {
      console.error("Error fetching total balance after all retries:", err);
    } finally {
      setLoadingStates(prev => ({ ...prev, total: false }));
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

  const ErrorMessage = () => (
    <div className="error-message">
      <h3>⚠️ Configuration Error</h3>
      <p>API URL is not configured. Please set the REACT_APP_API_URL environment variable.</p>
      <p>Current API_BASE: {API_BASE || 'undefined'}</p>
    </div>
  );

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
    <div className="dashboard-header">
      <h1 className="dashboard-title">
      <FaBitcoin /> Dashboard
      </h1>
      {blockHeight && <div className="block-height" style={{marginTop: 8, fontWeight: 'bold'}}>[blockHeight={blockHeight}]</div>}
    </div>

        {hasError ? (
          <ErrorMessage />
        ) : (
          <div className="sections-container">
            <section className="dashboard-section">
              <h2 className="section-header">
                <span><IoFlash /></span> Latest Top 10 UTXO Ranking 
              </h2>
              {loadingStates.utxos ? (
                <LoadingSpinner />
              ) : utxos.length > 0 ? (
                <LatestUtxo utxos={utxos} />
              ) : (
                <p className="no-data">No UTXOs found</p>
              )}
            </section>

            <section className="dashboard-section">
              <h2 className="section-header">
                <span><FaTrophy /></span> TOP 100 Balance Ranking
              </h2>
              {loadingStates.balances ? (
                <LoadingSpinner />
              ) : balances.length > 0 ? (
                <AddressBalances balances={balances} />
              ) : (
                <p className="no-data">No balances found</p>
              )}
            </section>

            <section className="dashboard-section">
              <h2 className="section-header">
                <span><FaChartBar /></span> Total Valid Address
              </h2>
              {loadingStates.total ? (
                <LoadingSpinner />
              ) : (
                <TotalBalance total={totalBalance} />
              )}
            </section>
          </div>
        )}

        <footer className="dashboard-footer">
          <div className="contact-info">
            <div className="contact-links">
              <a
                href="https://x.com/BalanceBit0214"
                className="contact-link twitter-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="contact-icon"><FaXTwitter /></span>
                Twitter
              </a>
              <a
                href="#"
                className="contact-link discord-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="contact-icon"><FaDiscord /></span>
                Discord
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );

}

export default App;
