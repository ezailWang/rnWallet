import uuid from 'react-native-uuid';

const defaultTokens = [
    {
        name: 'Ethereum',
        id: uuid.v4(),
        symbol: 'ETH',
    },
    // {
    //     contractAddress: '0x5e6b6d9abad9093fdc861ea1600eba1b355cd940',
    //     decimals: 18,
    //     id: uuid.v4(),
    //     name: 'IOT on Chain',
    //     symbol: 'ITC',
    // },
    //test net ERC20Token
    {
        contractAddress: '0x6e7d1b1bdE9A02b1F3ad2D5f81baD90eF68b7994',
        decimals: 18,
        id: uuid.v4(),
        name: 'IotChain',
        symbol: 'ITC',
    },
    // {
    //     contractAddress: '0xb4f8192668d8f2ee3b5b82bdb98f68848ba39ece',
    //     decimals: 18,
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
];

export { defaultTokens, erc20Abi };
