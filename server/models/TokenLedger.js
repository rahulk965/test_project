/**
 * TokenLedger Model
 *
 * Simulates a blockchain token ledger without direct blockchain dependencies.
 * Tracks token balances, transactions, and contract state.
 *
 * This is an in-memory simulation that can be replaced with actual
 * blockchain calls or persisted to a database.
 */

class TokenLedger {
  constructor() {
    // Token balances mapping: address => balance
    this.balances = {};

    // Transaction history
    this.transactions = [];

    // Contract owner
    this.owner = "0x1111111111111111111111111111111111111111";

    // Total supply
    this.totalSupply = 0;

    // Token metadata
    this.tokenName = "RentVerse Token";
    this.tokenSymbol = "RENT";
    this.decimals = 18;

    // Contract state
    this.contractPaused = false;
    this.allowances = {}; // address => { spender => amount }

    // Initialize owner with some tokens
    this.balances[this.owner] = 1000000 * Math.pow(10, this.decimals);
    this.totalSupply = this.balances[this.owner];
  }

  /**
   * Get balance of an address
   * @param {string} address - Wallet address
   * @returns {number} Balance in tokens
   */
  balanceOf(address) {
    if (!this._isValidAddress(address)) {
      throw new Error("Invalid address format");
    }
    return this.balances[address] || 0;
  }

  /**
   * Mint new tokens (only owner can mint)
   * @param {string} toAddress - Recipient address
   * @param {number} amount - Amount to mint
   * @returns {object} Transaction result
   */
  mint(toAddress, amount) {
    if (this.contractPaused) {
      throw new Error("Contract is paused. Cannot mint tokens.");
    }

    if (!this._isValidAddress(toAddress)) {
      throw new Error("Invalid recipient address");
    }

    if (amount <= 0) {
      throw new Error("Mint amount must be greater than 0");
    }

    const mintAmount = amount * Math.pow(10, this.decimals);

    // Add balance
    this.balances[toAddress] = (this.balances[toAddress] || 0) + mintAmount;
    this.totalSupply += mintAmount;

    // Record transaction
    const transaction = {
      id: this._generateTransactionId(),
      type: "MINT",
      from: "CONTRACT",
      to: toAddress,
      amount: mintAmount,
      timestamp: new Date(),
      status: "SUCCESS",
      gasUsed: Math.floor(Math.random() * 50000) + 21000, // Simulated gas
    };

    this.transactions.push(transaction);

    return {
      success: true,
      message: `Minted ${amount} ${this.tokenSymbol} to ${toAddress}`,
      transaction: transaction,
      newBalance: this.balances[toAddress],
      totalSupply: this.totalSupply,
    };
  }

  /**
   * Transfer tokens from one address to another
   * @param {string} fromAddress - Sender address
   * @param {string} toAddress - Recipient address
   * @param {number} amount - Amount to transfer
   * @returns {object} Transaction result
   */
  transfer(fromAddress, toAddress, amount) {
    if (this.contractPaused) {
      throw new Error("Contract is paused. Cannot transfer tokens.");
    }

    if (!this._isValidAddress(fromAddress)) {
      throw new Error("Invalid sender address");
    }

    if (!this._isValidAddress(toAddress)) {
      throw new Error("Invalid recipient address");
    }

    if (fromAddress === toAddress) {
      throw new Error("Cannot transfer to the same address");
    }

    if (amount <= 0) {
      throw new Error("Transfer amount must be greater than 0");
    }

    const transferAmount = amount * Math.pow(10, this.decimals);
    const senderBalance = this.balanceOf(fromAddress);

    if (senderBalance < transferAmount) {
      throw new Error(
        `Insufficient balance. Required: ${amount}, Available: ${senderBalance / Math.pow(10, this.decimals)}`
      );
    }

    // Perform transfer
    this.balances[fromAddress] -= transferAmount;
    this.balances[toAddress] = (this.balances[toAddress] || 0) + transferAmount;

    // Record transaction
    const transaction = {
      id: this._generateTransactionId(),
      type: "TRANSFER",
      from: fromAddress,
      to: toAddress,
      amount: transferAmount,
      timestamp: new Date(),
      status: "SUCCESS",
      gasUsed: Math.floor(Math.random() * 60000) + 21000, // Simulated gas
    };

    this.transactions.push(transaction);

    return {
      success: true,
      message: `Transferred ${amount} ${this.tokenSymbol} from ${fromAddress} to ${toAddress}`,
      transaction: transaction,
      senderBalance: this.balances[fromAddress],
      recipientBalance: this.balances[toAddress],
    };
  }

  /**
   * Burn tokens (remove from circulation)
   * @param {string} fromAddress - Address to burn from
   * @param {number} amount - Amount to burn
   * @returns {object} Transaction result
   */
  burn(fromAddress, amount) {
    if (this.contractPaused) {
      throw new Error("Contract is paused. Cannot burn tokens.");
    }

    if (!this._isValidAddress(fromAddress)) {
      throw new Error("Invalid address");
    }

    if (amount <= 0) {
      throw new Error("Burn amount must be greater than 0");
    }

    const burnAmount = amount * Math.pow(10, this.decimals);
    const senderBalance = this.balanceOf(fromAddress);

    if (senderBalance < burnAmount) {
      throw new Error(`Insufficient balance to burn. Available: ${senderBalance / Math.pow(10, this.decimals)}`);
    }

    // Perform burn
    this.balances[fromAddress] -= burnAmount;
    this.totalSupply -= burnAmount;

    // Record transaction
    const transaction = {
      id: this._generateTransactionId(),
      type: "BURN",
      from: fromAddress,
      to: "0x0000000000000000000000000000000000000000",
      amount: burnAmount,
      timestamp: new Date(),
      status: "SUCCESS",
      gasUsed: Math.floor(Math.random() * 40000) + 21000, // Simulated gas
    };

    this.transactions.push(transaction);

    return {
      success: true,
      message: `Burned ${amount} ${this.tokenSymbol} from ${fromAddress}`,
      transaction: transaction,
      burnedAmount: burnAmount,
      newBalance: this.balances[fromAddress],
      totalSupply: this.totalSupply,
    };
  }

  /**
   * Get transaction history
   * @param {string} address - Optional: filter by address
   * @param {number} limit - Number of transactions to return
   * @returns {array} Transaction history
   */
  getTransactionHistory(address = null, limit = 50) {
    let history = this.transactions;

    if (address) {
      if (!this._isValidAddress(address)) {
        throw new Error("Invalid address format");
      }
      history = history.filter(
        (tx) => tx.from === address || tx.to === address
      );
    }

    // Return most recent transactions first
    return history.reverse().slice(0, limit);
  }

  /**
   * Get contract information
   * @returns {object} Contract details
   */
  getContractInfo() {
    return {
      owner: this.owner,
      name: this.tokenName,
      symbol: this.tokenSymbol,
      decimals: this.decimals,
      totalSupply: this.totalSupply,
      totalSupplyFormatted: this.totalSupply / Math.pow(10, this.decimals),
      contractPaused: this.contractPaused,
      totalTransactions: this.transactions.length,
      createdAt: this.transactions[0]?.timestamp ? new Date(this.transactions[0].timestamp).toISOString() : new Date().toISOString(),
    };
  }

  /**
   * Get all balances (excluding empty addresses)
   * @returns {object} Balances
   */
  getAllBalances() {
    return Object.entries(this.balances)
      .filter(([_, balance]) => balance > 0)
      .reduce((acc, [address, balance]) => {
        acc[address] = balance / Math.pow(10, this.decimals);
        return acc;
      }, {});
  }

  /**
   * Approve allowance for spender
   * @param {string} owner - Token owner
   * @param {string} spender - Spender address
   * @param {number} amount - Amount to approve
   * @returns {object} Approval result
   */
  approve(owner, spender, amount) {
    if (!this._isValidAddress(owner)) {
      throw new Error("Invalid owner address");
    }

    if (!this._isValidAddress(spender)) {
      throw new Error("Invalid spender address");
    }

    if (amount < 0) {
      throw new Error("Approval amount cannot be negative");
    }

    const approvalAmount = amount * Math.pow(10, this.decimals);

    if (!this.allowances[owner]) {
      this.allowances[owner] = {};
    }

    this.allowances[owner][spender] = approvalAmount;

    return {
      success: true,
      message: `Approved ${amount} ${this.tokenSymbol} for ${spender}`,
      owner,
      spender,
      amount: approvalAmount,
    };
  }

  /**
   * Check allowance
   * @param {string} owner - Token owner
   * @param {string} spender - Spender address
   * @returns {number} Approved amount
   */
  allowance(owner, spender) {
    if (!this._isValidAddress(owner) || !this._isValidAddress(spender)) {
      throw new Error("Invalid address format");
    }

    return this.allowances[owner]?.[spender] || 0;
  }

  /**
   * Pause contract
   * @returns {object} Pause result
   */
  pauseContract() {
    this.contractPaused = true;
    return {
      success: true,
      message: "Contract paused successfully",
      contractPaused: true,
    };
  }

  /**
   * Resume contract
   * @returns {object} Resume result
   */
  resumeContract() {
    this.contractPaused = false;
    return {
      success: true,
      message: "Contract resumed successfully",
      contractPaused: false,
    };
  }

  /**
   * Validate address format
   * @private
   * @param {string} address - Address to validate
   * @returns {boolean} True if valid
   */
  _isValidAddress(address) {
    // Check if it's a valid Ethereum-like address (0x + 40 hex characters)
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }

  /**
   * Generate transaction ID
   * @private
   * @returns {string} Transaction hash
   */
  _generateTransactionId() {
    return "0x" + Math.random().toString(16).substring(2) + Date.now().toString(16);
  }

  /**
   * Reset ledger (for testing)
   */
  reset() {
    this.balances = {};
    this.transactions = [];
    this.balances[this.owner] = 1000000 * Math.pow(10, this.decimals);
    this.totalSupply = this.balances[this.owner];
  }
}

// Create singleton instance
const tokenLedger = new TokenLedger();

module.exports = tokenLedger;
