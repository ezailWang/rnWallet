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
        contractAddress: '0xC1c42e9807BDf6a744376D77Cb3D1fE9a0b23aD5',
        decimals: 18,
        id: uuid.v4(),
        name: 'IotChain',
        symbol: 'ITC',
    }
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
