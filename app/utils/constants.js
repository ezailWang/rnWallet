import uuid from 'react-native-uuid';

const defaultTokens = [
    // {
    //     contractAddress: '0xb4f8192668d8f2ee3b5b82bdb98f68848ba39ece',
    //     decimals: 18,
    //     id: uuid.v4(),
    //     name: 'wsdtest',
    //     symbol: 'DSW',
    // },
    {
        name: 'Ethereum',
        id: uuid.v4(),
        symbol: 'ETH',
    },
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
