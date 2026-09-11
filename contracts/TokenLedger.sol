// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title TokenLedger
 * @dev RentVerse Token (RENT) - ERC-20 Compatible Token Contract
 *
 * This contract implements a token ledger with standard ERC-20 functionality.
 * It manages token minting, transfers, burning, and approval mechanisms.
 *
 * Features:
 * - Mint new tokens
 * - Transfer tokens between addresses
 * - Burn tokens
 * - Approve allowances
 * - Pause/Resume contract
 * - Transaction tracking
 */

contract TokenLedger {
    // ============ State Variables ============

    string public name = "RentVerse Token";
    string public symbol = "RENT";
    uint8 public decimals = 18;
    uint256 public totalSupply;

    address public owner;
    bool public paused;

    // Balances mapping
    mapping(address => uint256) public balances;

    // Allowances mapping
    mapping(address => mapping(address => uint256)) public allowances;

    // Transaction counter
    uint256 public transactionCount;

    // ============ Events ============

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event Mint(address indexed to, uint256 value);
    event Burn(address indexed from, uint256 value);
    event ContractPaused();
    event ContractResumed();

    // ============ Modifiers ============

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier whenNotPaused() {
        require(!paused, "Contract is paused");
        _;
    }

    modifier validAddress(address _address) {
        require(_address != address(0), "Invalid address");
        _;
    }

    // ============ Constructor ============

    constructor() {
        owner = msg.sender;
        paused = false;
        totalSupply = 1000000 * 10 ** uint256(decimals);
        balances[owner] = totalSupply;
    }

    // ============ Token Operations ============

    /**
     * @dev Get balance of an address
     * @param _owner Address to check balance for
     * @return Balance of the address
     */
    function balanceOf(address _owner) public view returns (uint256) {
        return balances[_owner];
    }

    /**
     * @dev Transfer tokens to another address
     * @param _to Recipient address
     * @param _value Amount to transfer
     * @return Success boolean
     */
    function transfer(address _to, uint256 _value)
        public
        validAddress(_to)
        whenNotPaused
        returns (bool)
    {
        require(_to != msg.sender, "Cannot transfer to yourself");
        require(balances[msg.sender] >= _value, "Insufficient balance");

        balances[msg.sender] -= _value;
        balances[_to] += _value;
        transactionCount++;

        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    /**
     * @dev Approve a spender to use tokens on behalf of owner
     * @param _spender Spender address
     * @param _value Amount to approve
     * @return Success boolean
     */
    function approve(address _spender, uint256 _value)
        public
        validAddress(_spender)
        returns (bool)
    {
        allowances[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    /**
     * @dev Check remaining allowance for a spender
     * @param _owner Token owner
     * @param _spender Spender address
     * @return Remaining allowance
     */
    function allowance(address _owner, address _spender)
        public
        view
        returns (uint256)
    {
        return allowances[_owner][_spender];
    }

    /**
     * @dev Transfer tokens from one address to another using allowance
     * @param _from Source address
     * @param _to Destination address
     * @param _value Amount to transfer
     * @return Success boolean
     */
    function transferFrom(address _from, address _to, uint256 _value)
        public
        validAddress(_from)
        validAddress(_to)
        whenNotPaused
        returns (bool)
    {
        require(_to != _from, "Cannot transfer to yourself");
        require(balances[_from] >= _value, "Insufficient balance");
        require(allowances[_from][msg.sender] >= _value, "Insufficient allowance");

        balances[_from] -= _value;
        balances[_to] += _value;
        allowances[_from][msg.sender] -= _value;
        transactionCount++;

        emit Transfer(_from, _to, _value);
        return true;
    }

    // ============ Minting & Burning ============

    /**
     * @dev Mint new tokens (only owner)
     * @param _to Recipient address
     * @param _value Amount to mint
     * @return Success boolean
     */
    function mint(address _to, uint256 _value)
        public
        onlyOwner
        validAddress(_to)
        whenNotPaused
        returns (bool)
    {
        require(_value > 0, "Mint amount must be greater than 0");

        balances[_to] += _value;
        totalSupply += _value;
        transactionCount++;

        emit Mint(_to, _value);
        emit Transfer(address(0), _to, _value);
        return true;
    }

    /**
     * @dev Burn tokens
     * @param _value Amount to burn
     * @return Success boolean
     */
    function burn(uint256 _value)
        public
        whenNotPaused
        returns (bool)
    {
        require(balances[msg.sender] >= _value, "Insufficient balance to burn");
        require(_value > 0, "Burn amount must be greater than 0");

        balances[msg.sender] -= _value;
        totalSupply -= _value;
        transactionCount++;

        emit Burn(msg.sender, _value);
        emit Transfer(msg.sender, address(0), _value);
        return true;
    }

    /**
     * @dev Burn tokens from another address (requires allowance)
     * @param _from Address to burn from
     * @param _value Amount to burn
     * @return Success boolean
     */
    function burnFrom(address _from, uint256 _value)
        public
        validAddress(_from)
        whenNotPaused
        returns (bool)
    {
        require(balances[_from] >= _value, "Insufficient balance");
        require(allowances[_from][msg.sender] >= _value, "Insufficient allowance");
        require(_value > 0, "Burn amount must be greater than 0");

        balances[_from] -= _value;
        totalSupply -= _value;
        allowances[_from][msg.sender] -= _value;
        transactionCount++;

        emit Burn(_from, _value);
        emit Transfer(_from, address(0), _value);
        return true;
    }

    // ============ Contract Control ============

    /**
     * @dev Pause contract (only owner)
     */
    function pause() public onlyOwner {
        require(!paused, "Contract is already paused");
        paused = true;
        emit ContractPaused();
    }

    /**
     * @dev Resume contract (only owner)
     */
    function resume() public onlyOwner {
        require(paused, "Contract is not paused");
        paused = false;
        emit ContractResumed();
    }

    /**
     * @dev Get contract status
     * @return Contract information
     */
    function getContractInfo() public view returns (
        string memory _name,
        string memory _symbol,
        uint8 _decimals,
        uint256 _totalSupply,
        bool _paused,
        uint256 _transactionCount
    ) {
        return (name, symbol, decimals, totalSupply, paused, transactionCount);
    }
}
