import uuid from 'react-native-uuid';

const defaultTokens = [
  {
    contractAddress: '0x5e6b6d9abad9093fdc861ea1600eba1b355cd940',
    decimals: 8,
    id: uuid.v4(),
    name: 'ITCCOIN',
    symbol: 'ITC',
  },
  {
    name: 'Ethereum',
    id: uuid.v4(),
    symbol: 'ETH',
  },
];

const erc20Abi = [
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_to",
        "type": "address"
      },
      {
        "name": "_value",
        "type": "uint256"
      }
    ],
    "name": "transfer",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },

];

export { defaultTokens, erc20Abi };
