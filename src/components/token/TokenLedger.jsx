/**
 * Token Ledger Component
 *
 * React component for interacting with the token ledger API.
 * Allows users to:
 * - Check token balances
 * - Transfer tokens
 * - Mint tokens
 * - Burn tokens
 * - View transaction history
 * - Manage approvals
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TokenLedger.css';

const API_BASE_URL = 'http://localhost:3099/api/token';

const TokenLedger = () => {
  // State for contract info
  const [contractInfo, setContractInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // State for balance check
  const [addressInput, setAddressInput] = useState('');
  const [balance, setBalance] = useState(null);

  // State for transfer
  const [transferData, setTransferData] = useState({
    fromAddress: '',
    toAddress: '',
    amount: '',
  });

  // State for mint
  const [mintData, setMintData] = useState({
    toAddress: '',
    amount: '',
  });

  // State for burn
  const [burnData, setBurnData] = useState({
    address: '',
    amount: '',
  });

  // State for transactions
  const [transactions, setTransactions] = useState([]);
  const [showTransactions, setShowTransactions] = useState(false);

  // Fetch contract info on component mount
  useEffect(() => {
    fetchContractInfo();
  }, []);

  // Fetch contract information
  const fetchContractInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/info`);
      setContractInfo(response.data.contract);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch contract info');
    } finally {
      setLoading(false);
    }
  };

  // Check balance
  const handleCheckBalance = async () => {
    if (!addressInput.trim()) {
      setError('Please enter a valid address');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/balance/${addressInput}`);
      setBalance(response.data);
      setSuccess('Balance retrieved successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch balance');
    } finally {
      setLoading(false);
    }
  };

  // Handle transfer
  const handleTransfer = async (e) => {
    e.preventDefault();

    if (!transferData.fromAddress || !transferData.toAddress || !transferData.amount) {
      setError('Please fill all transfer fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await axios.post(`${API_BASE_URL}/transfer`, {
        fromAddress: transferData.fromAddress,
        toAddress: transferData.toAddress,
        amount: parseFloat(transferData.amount),
      });

      setSuccess(response.data.data.message);
      setTransferData({ fromAddress: '', toAddress: '', amount: '' });
      fetchContractInfo();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Transfer failed');
    } finally {
      setLoading(false);
    }
  };

  // Handle mint
  const handleMint = async (e) => {
    e.preventDefault();

    if (!mintData.toAddress || !mintData.amount) {
      setError('Please fill all mint fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await axios.post(`${API_BASE_URL}/mint`, {
        toAddress: mintData.toAddress,
        amount: parseFloat(mintData.amount),
      });

      setSuccess(response.data.data.message);
      setMintData({ toAddress: '', amount: '' });
      fetchContractInfo();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Mint failed');
    } finally {
      setLoading(false);
    }
  };

  // Handle burn
  const handleBurn = async (e) => {
    e.preventDefault();

    if (!burnData.address || !burnData.amount) {
      setError('Please fill all burn fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await axios.post(`${API_BASE_URL}/burn`, {
        address: burnData.address,
        amount: parseFloat(burnData.amount),
      });

      setSuccess(response.data.data.message);
      setBurnData({ address: '', amount: '' });
      fetchContractInfo();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Burn failed');
    } finally {
      setLoading(false);
    }
  };

  // Fetch transactions
  const fetchTransactions = async (address = null) => {
    try {
      setLoading(true);
      setError(null);
      const url = address
        ? `${API_BASE_URL}/transactions?address=${address}`
        : `${API_BASE_URL}/transactions`;
      const response = await axios.get(url);
      setTransactions(response.data.transactions);
      setShowTransactions(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="token-ledger-container">
      <div className="token-header">
        <h1>🪙 Token Ledger</h1>
        <p>Manage RentVerse Tokens (RENT)</p>
      </div>

      {/* Error and Success Messages */}
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Contract Info Section */}
      {contractInfo && (
        <div className="contract-info-section">
          <h2>📊 Contract Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="label">Token Name:</span>
              <span className="value">{contractInfo.name}</span>
            </div>
            <div className="info-item">
              <span className="label">Symbol:</span>
              <span className="value">{contractInfo.symbol}</span>
            </div>
            <div className="info-item">
              <span className="label">Total Supply:</span>
              <span className="value">{contractInfo.totalSupplyFormatted.toLocaleString()}</span>
            </div>
            <div className="info-item">
              <span className="label">Decimals:</span>
              <span className="value">{contractInfo.decimals}</span>
            </div>
            <div className="info-item">
              <span className="label">Total Transactions:</span>
              <span className="value">{contractInfo.totalTransactions}</span>
            </div>
            <div className="info-item">
              <span className="label">Contract Status:</span>
              <span className={`value ${contractInfo.contractPaused ? 'paused' : 'active'}`}>
                {contractInfo.contractPaused ? '⏸ Paused' : '✅ Active'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Balance Check Section */}
      <div className="section balance-section">
        <h2>💰 Check Balance</h2>
        <div className="form-group">
          <input
            type="text"
            placeholder="Enter wallet address (0x...)"
            value={addressInput}
            onChange={(e) => setAddressInput(e.target.value)}
            className="form-control"
          />
          <button
            onClick={handleCheckBalance}
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? 'Checking...' : 'Check Balance'}
          </button>
        </div>

        {balance && (
          <div className="balance-result">
            <p><strong>Address:</strong> {balance.address}</p>
            <p><strong>Balance:</strong> {balance.balance} {balance.symbol}</p>
            <p><strong>Raw Balance:</strong> {balance.balanceRaw}</p>
          </div>
        )}
      </div>

      {/* Transfer Section */}
      <div className="section transfer-section">
        <h2>↔️ Transfer Tokens</h2>
        <form onSubmit={handleTransfer}>
          <div className="form-group">
            <input
              type="text"
              placeholder="From Address (0x...)"
              value={transferData.fromAddress}
              onChange={(e) =>
                setTransferData({ ...transferData, fromAddress: e.target.value })
              }
              className="form-control"
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="To Address (0x...)"
              value={transferData.toAddress}
              onChange={(e) =>
                setTransferData({ ...transferData, toAddress: e.target.value })
              }
              className="form-control"
            />
          </div>
          <div className="form-group">
            <input
              type="number"
              placeholder="Amount"
              value={transferData.amount}
              onChange={(e) =>
                setTransferData({ ...transferData, amount: e.target.value })
              }
              className="form-control"
              step="0.01"
            />
          </div>
          <button type="submit" disabled={loading} className="btn btn-success">
            {loading ? 'Processing...' : 'Transfer'}
          </button>
        </form>
      </div>

      {/* Mint Section */}
      <div className="section mint-section">
        <h2>🪣 Mint Tokens</h2>
        <form onSubmit={handleMint}>
          <div className="form-group">
            <input
              type="text"
              placeholder="To Address (0x...)"
              value={mintData.toAddress}
              onChange={(e) => setMintData({ ...mintData, toAddress: e.target.value })}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <input
              type="number"
              placeholder="Amount to Mint"
              value={mintData.amount}
              onChange={(e) => setMintData({ ...mintData, amount: e.target.value })}
              className="form-control"
              step="0.01"
            />
          </div>
          <button type="submit" disabled={loading} className="btn btn-info">
            {loading ? 'Processing...' : 'Mint'}
          </button>
        </form>
      </div>

      {/* Burn Section */}
      <div className="section burn-section">
        <h2>🔥 Burn Tokens</h2>
        <form onSubmit={handleBurn}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Address (0x...)"
              value={burnData.address}
              onChange={(e) => setBurnData({ ...burnData, address: e.target.value })}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <input
              type="number"
              placeholder="Amount to Burn"
              value={burnData.amount}
              onChange={(e) => setBurnData({ ...burnData, amount: e.target.value })}
              className="form-control"
              step="0.01"
            />
          </div>
          <button type="submit" disabled={loading} className="btn btn-danger">
            {loading ? 'Processing...' : 'Burn'}
          </button>
        </form>
      </div>

      {/* Transactions Section */}
      <div className="section transactions-section">
        <h2>📜 Transaction History</h2>
        <button
          onClick={() => fetchTransactions()}
          className="btn btn-secondary"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'View Transactions'}
        </button>

        {showTransactions && transactions.length > 0 && (
          <div className="transactions-table">
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx, index) => (
                  <tr key={index}>
                    <td className={`type ${tx.type.toLowerCase()}`}>{tx.type}</td>
                    <td className="address">{tx.from.substring(0, 10)}...</td>
                    <td className="address">{tx.to.substring(0, 10)}...</td>
                    <td>{(tx.amount / 1e18).toFixed(2)}</td>
                    <td>{new Date(tx.timestamp).toLocaleDateString()}</td>
                    <td className={`status ${tx.status.toLowerCase()}`}>{tx.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TokenLedger;
