import uuid from 'react-native-uuid';

const defaultSupportExchangeTokens = [
  {
    id: uuid.v4(),
    symbol: 'ETH',
    decimal: 18,
    address: '0x0000000000000000000000000000000000000000',
    coinIcon: require('../assets/home/ETH.png'),
    balance: 0,
    isSelect: false,
  },
  {
    id: uuid.v4(),
    symbol: 'ITC',
    decimal: 18,
    address: '0x5e6b6d9abad9093fdc861ea1600eba1b355cd940',
    coinIcon: require('../assets/home/ITC.png'),
    balance: 0,
    isSelect: false,
  },
  {
    id: uuid.v4(),
    symbol: 'SWFTC',
    decimal: 8,
    address: '0x0bb217e40f8a5cb79adf04e1aab60e5abd0dfc1e',
    coinIcon: require('../assets/exchange/swftc_icon.png'),
    balance: 0,
    isSelect: false,
  },
  {
    id: uuid.v4(),
    symbol: 'BIX',
    decimal: 18,
    address: '0xb3104b4b9da82025e8b9f8fb28b3553ce2f67069',
    coinIcon: require('../assets/exchange/bix_icon.png'),
    balance: 0,
    isSelect: false,
  },
  {
    id: uuid.v4(),
    symbol: 'HT ',
    decimal: 18,
    address: '0x6f259637dcd74c767781e37bc6133cd6a68aa161',
    coinIcon: require('../assets/exchange/ht_icon.png'),
    balance: 0,
    isSelect: false,
  },
];

const defaultTokensOfITC = [
  {
    id: uuid.v4(),
    symbol: 'ITC',
    iconLarge: '',
    name: 'IOT on Chain',
    decimal: 18,
    address: '0x0000000000000000000000000000000000000000',
  },
];

const defaultTokens = [
  {
    id: uuid.v4(),
    symbol: 'ETH',
    iconLarge: '',
    name: 'Ethereum',
    decimal: 18,
    address: '0x0000000000000000000000000000000000000000',
  },
  // {
  //   address: '0x5e6b6d9abad9093fdc861ea1600eba1b355cd940', // 主网
  //   decimal: 18,
  //   id: uuid.v4(),
  //   name: 'IOT on Chain',
  //   symbol: 'ITC',
  // },
  // test net ERC20Token
  {
    address: '0x6e7d1b1bdE9A02b1F3ad2D5f81baD90eF68b7994', // 测试网
    id: uuid.v4(),
    symbol: 'ITC',
    name: 'IoT Chain',
    decimal: 18,
  },
  // {
  //     address: '0xb4f8192668d8f2ee3b5b82bdb98f68848ba39ece',
  //     decimal: 18,
  //     id: uuid.v4(),
  //     name: 'wsdtest',
  //     symbol: 'DSW',
  // }
];

const erc20Abi = [
  {
    name: 'balanceOf',
    type: 'function',
    constant: true,
    payable: false,
    inputs: [
      {
        name: '_owner',
        type: 'address',
      },
    ],
    outputs: [
      {
        name: 'balance',
        type: 'uint256',
      },
    ],
  },
  {
    name: 'transfer',
    type: 'function',
    constant: false,
    payable: false,
    inputs: [
      {
        name: '_to',
        type: 'address',
      },
      {
        name: '_value',
        type: 'uint256',
      },
    ],
    outputs: [
      {
        name: 'success',
        type: 'bool',
      },
    ],
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [
      {
        name: '',
        type: 'string',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
		constant: true,
		inputs: [
			{
				name: "",
				type: "address"
			},
			{
				name: "",
				type: "address"
			}
		],
		name: "allowance",
		outputs: [
			{
				name: "",
				type: "uint256"
			}
		],
		payable: false,
		stateMutability: "view",
		type: "function"
  },
  {
		"constant": false,
		"inputs": [
			{
				"name": "_spender",
				"type": "address"
			},
			{
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [
			{
				"name": "success",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	}
];

const nodeBallotAbi = [
	{
		"constant": true,
		"inputs": [],
		"name": "startDate",
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
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"name": "nodes",
		"outputs": [
			{
				"name": "originalAmount",
				"type": "uint256"
			},
			{
				"name": "totalBallotAmount",
				"type": "uint256"
			},
			{
				"name": "date",
				"type": "uint256"
			},
			{
				"name": "valid",
				"type": "bool"
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
				"name": "enable",
				"type": "bool"
			}
		],
		"name": "openWithdraw",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "destruct",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "decimals",
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
		"constant": true,
		"inputs": [],
		"name": "totalLockToken",
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
				"name": "ballotAddress",
				"type": "address"
			}
		],
		"name": "withdrawTokenToAddress",
		"outputs": [
			{
				"name": "res",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "minimumBallotAmount",
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
		"constant": true,
		"inputs": [],
		"name": "totalWithdrawToken",
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
		"inputs": [],
		"name": "transferToken",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "isOwner",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "activityEnable",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"name": "userBallotInfoMap",
		"outputs": [
			{
				"name": "nodeAddress",
				"type": "address"
			},
			{
				"name": "amount",
				"type": "uint256"
			},
			{
				"name": "date",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "_owner",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "withdrawEnable",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "withdrawToken",
		"outputs": [
			{
				"name": "res",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "enable",
				"type": "bool"
			}
		],
		"name": "motifyActivityEnable",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "lockLimitTime",
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
				"name": "nodeAddress",
				"type": "address"
			},
			{
				"name": "ballotAmount",
				"type": "uint256"
			}
		],
		"name": "ballot",
		"outputs": [
			{
				"name": "result",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "originalAmount",
				"type": "uint256"
			}
		],
		"name": "generalSuperNode",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "token",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"name": "tokenAddr",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "_ballotAddress",
				"type": "address"
			},
			{
				"indexed": true,
				"name": "_nodeAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "_ballotAmount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "_date",
				"type": "uint256"
			}
		],
		"name": "Ballot",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "_nodeAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "_oringinalAmount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "_date",
				"type": "uint256"
			}
		],
		"name": "GeneralNode",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "_ballotAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "Withdraw",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	}
]

//rinkeby网络
const contractInfo = {
  nodeBallot:{
    address:'0x3d1b62a595feb18160d5bf721b0b0cf59d94eef5'
  }
}

export { defaultTokens, defaultTokensOfITC, erc20Abi, defaultSupportExchangeTokens , nodeBallotAbi, contractInfo};
