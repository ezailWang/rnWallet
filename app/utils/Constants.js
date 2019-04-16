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
  {
    address: '0x5e6b6d9abad9093fdc861ea1600eba1b355cd940', // 主网
    decimal: 18,
    id: uuid.v4(),
    name: 'IOT on Chain',
    symbol: 'ITC',
  },
  // test net ERC20Token
  // {
  // address: '0x6e7d1b1bdE9A02b1F3ad2D5f81baD90eF68b7994',//测试网
  //     id: uuid.v4(),
  // iconLarge: 'http://47.75.16.97:9000/images/token/0x5e6b6d9abad9093fdc861ea1600eba1b355cd940@3x.png',
  //     iconLarge :'',
  //     symbol: 'ITC',
  //     name: 'IoT Chain',
  //     decimal: 18,
  //     address: '0x6e7d1b1bdE9A02b1F3ad2D5f81baD90eF68b7994',
  // },
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
];

export { defaultTokens, defaultTokensOfITC, erc20Abi, defaultSupportExchangeTokens };
