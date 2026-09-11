/**
 * Token Ledger API Routes
 *
 * RESTful API endpoints for token operations:
 * - Minting tokens
 * - Transferring tokens
 * - Burning tokens
 * - Checking balances
 * - Viewing transaction history
 * - Approving allowances
 * - Contract management
 */

const express = require("express");
const tokenLedgerController = require("../controllers/tokenLedgerController");

const router = express.Router();

/**
 * @route   GET /api/token/balance/:address
 * @desc    Get token balance for a specific address
 * @access  Public
 */
router.get("/balance/:address", tokenLedgerController.getBalance);

/**
 * @route   POST /api/token/mint
 * @desc    Mint new tokens
 * @access  Public (in production, should be restricted to owner)
 * @body    { toAddress: string, amount: number }
 */
router.post("/mint", tokenLedgerController.mintTokens);

/**
 * @route   POST /api/token/transfer
 * @desc    Transfer tokens from one address to another
 * @access  Public
 * @body    { fromAddress: string, toAddress: string, amount: number }
 */
router.post("/transfer", tokenLedgerController.transferTokens);

/**
 * @route   POST /api/token/burn
 * @desc    Burn tokens (remove from circulation)
 * @access  Public
 * @body    { address: string, amount: number }
 */
router.post("/burn", tokenLedgerController.burnTokens);

/**
 * @route   GET /api/token/transactions
 * @desc    Get transaction history
 * @access  Public
 * @query   { address?: string, limit?: number }
 */
router.get("/transactions", tokenLedgerController.getTransactions);

/**
 * @route   GET /api/token/info
 * @desc    Get contract information (name, symbol, total supply, etc.)
 * @access  Public
 */
router.get("/info", tokenLedgerController.getContractInfo);

/**
 * @route   GET /api/token/balances
 * @desc    Get all non-zero balances
 * @access  Public
 */
router.get("/balances", tokenLedgerController.getAllBalances);

/**
 * @route   POST /api/token/approve
 * @desc    Approve allowance for a spender
 * @access  Public
 * @body    { owner: string, spender: string, amount: number }
 */
router.post("/approve", tokenLedgerController.approveAllowance);

/**
 * @route   GET /api/token/allowance/:owner/:spender
 * @desc    Check allowance for a spender
 * @access  Public
 */
router.get("/allowance/:owner/:spender", tokenLedgerController.checkAllowance);

/**
 * @route   POST /api/token/pause
 * @desc    Pause the contract (stop all operations)
 * @access  Protected (should require admin/owner role)
 */
router.post("/pause", tokenLedgerController.pauseContract);

/**
 * @route   POST /api/token/resume
 * @desc    Resume the contract
 * @access  Protected (should require admin/owner role)
 */
router.post("/resume", tokenLedgerController.resumeContract);

/**
 * @route   POST /api/token/reset
 * @desc    Reset ledger (for testing only)
 * @access  Protected (should be removed in production)
 */
router.post("/reset", tokenLedgerController.resetLedger);

module.exports = router;
