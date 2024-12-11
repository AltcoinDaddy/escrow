export const ESCROW_ABI = [
  {
    "inputs": [
      {"internalType": "address", "name": "_seller", "type": "address"},
      {"internalType": "uint256", "name": "_deadline", "type": "uint256"}
    ],
    "name": "createDeal",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "dealCount",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_dealId", "type": "uint256"}],
    "name": "getDeal",
    "outputs": [
      {
        "components": [
          {"internalType": "address", "name": "buyer", "type": "address"},
          {"internalType": "address", "name": "seller", "type": "address"},
          {"internalType": "uint256", "name": "amount", "type": "uint256"},
          {"internalType": "uint256", "name": "deadline", "type": "uint256"},
          {"internalType": "bool", "name": "isCompleted", "type": "bool"},
          {"internalType": "bool", "name": "isRefunded", "type": "bool"}
        ],
        "internalType": "struct Escrow.Deal",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_dealId", "type": "uint256"}],
    "name": "completeDeal",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_dealId", "type": "uint256"}],
    "name": "refundDeal",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const; 