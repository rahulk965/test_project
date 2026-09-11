/**
 * Token Ledger Controller
 *
 * Handles all API requests related to token operations.
 * Manages minting, transfers, balance checks, and transaction history.
 */

const tokenLedger = require("../models/TokenLedger");

/**
 * Get token balance for an address
 * @route GET /api/token/balance/:address
 */
exports.getBalance = (req, res) => {
  try {
    const { address } = req.params;

    if (!address) {
      return res.status(400).json({
        success: false,
        message: "Address parameter is required",
      });
    }

    const balance = tokenLedger.balanceOf(address);
    const formattedBalance = balance / Math.pow(10, tokenLedger.decimals);

    return res.status(200).json({
      success: true,
      address,
      balance: formattedBalance,
      balanceRaw: balance,
      symbol: tokenLedger.tokenSymbol,
      decimals: tokenLedger.decimals,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Mint new tokens
 * @route POST /api/token/mint
 */
exports.mintTokens = (req, res) => {
  try {
    const { toAddress, amount } = req.body;

    // Validation
    if (!toAddress || amount === undefined) {
      return res.status(400).json({
        success: false,
        message: "toAddress and amount are required",
      });
    }

    // Call token ledger mint function
    const result = tokenLedger.mint(toAddress, amount);

    return res.status(201).json({
      success: true,
      data: result,
      timestamp: new Date(),
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Transfer tokens between addresses
 * @route POST /api/token/transfer
 */
exports.transferTokens = (req, res) => {
  try {
    const { fromAddress, toAddress, amount } = req.body;

    // Validation
    if (!fromAddress || !toAddress || amount === undefined) {
      return res.status(400).json({
        success: false,
        message: "fromAddress, toAddress, and amount are required",
      });
    }

    // Call token ledger transfer function
    const result = tokenLedger.transfer(fromAddress, toAddress, amount);

    return res.status(200).json({
      success: true,
      data: result,
      timestamp: new Date(),
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Burn tokens
 * @route POST /api/token/burn
 */
exports.burnTokens = (req, res) => {
  try {
    const { address, amount } = req.body;

    // Validation
    if (!address || amount === undefined) {
      return res.status(400).json({
        success: false,
        message: "address and amount are required",
      });
    }

    // Call token ledger burn function
    const result = tokenLedger.burn(address, amount);

    return res.status(200).json({
      success: true,
      data: result,
      timestamp: new Date(),
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get transaction history
 * @route GET /api/token/transactions
 */
exports.getTransactions = (req, res) => {
  try {
    const { address, limit } = req.query;
    const transactionLimit = limit ? parseInt(limit) : 50;

    if (transactionLimit < 1 || transactionLimit > 1000) {
      return res.status(400).json({
        success: false,
        message: "Limit must be between 1 and 1000",
      });
    }

    const transactions = tokenLedger.getTransactionHistory(address, transactionLimit);

    return res.status(200).json({
      success: true,
      count: transactions.length,
      transactions,
      filterAddress: address || "ALL",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get contract information
 * @route GET /api/token/info
 */
exports.getContractInfo = (req, res) => {
  try {
    const info = tokenLedger.getContractInfo();

    return res.status(200).json({
      success: true,
      contract: info,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Get all balances
 * @route GET /api/token/balances
 */
exports.getAllBalances = (req, res) => {
  try {
    const balances = tokenLedger.getAllBalances();

    return res.status(200).json({
      success: true,
      count: Object.keys(balances).length,
      balances,
      symbol: tokenLedger.tokenSymbol,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Approve allowance for spender
 * @route POST /api/token/approve
 */
exports.approveAllowance = (req, res) => {
  try {
    const { owner, spender, amount } = req.body;

    // Validation
    if (!owner || !spender || amount === undefined) {
      return res.status(400).json({
        success: false,
        message: "owner, spender, and amount are required",
      });
    }

    const result = tokenLedger.approve(owner, spender, amount);

    return res.status(200).json({
      success: true,
      data: result,
      timestamp: new Date(),
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Check allowance
 * @route GET /api/token/allowance/:owner/:spender
 */
exports.checkAllowance = (req, res) => {
  try {
    const { owner, spender } = req.params;

    if (!owner || !spender) {
      return res.status(400).json({
        success: false,
        message: "owner and spender parameters are required",
      });
    }

    const allowanceAmount = tokenLedger.allowance(owner, spender);
    const formattedAllowance = allowanceAmount / Math.pow(10, tokenLedger.decimals);

    return res.status(200).json({
      success: true,
      owner,
      spender,
      allowance: formattedAllowance,
      allowanceRaw: allowanceAmount,
      symbol: tokenLedger.tokenSymbol,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Pause contract
 * @route POST /api/token/pause
 */
exports.pauseContract = (req, res) => {
  try {
    const result = tokenLedger.pauseContract();

    return res.status(200).json({
      success: true,
      data: result,
      timestamp: new Date(),
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Resume contract
 * @route POST /api/token/resume
 */
exports.resumeContract = (req, res) => {
  try {
    const result = tokenLedger.resumeContract();

    return res.status(200).json({
      success: true,
      data: result,
      timestamp: new Date(),
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Reset ledger (for testing only)
 * @route POST /api/token/reset
 */
exports.resetLedger = (req, res) => {
  try {
    // In production, this should be protected with authentication
    tokenLedger.reset();

    return res.status(200).json({
      success: true,
      message: "Token ledger reset successfully",
      data: tokenLedger.getContractInfo(),
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
