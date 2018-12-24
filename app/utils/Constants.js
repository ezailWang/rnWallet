import uuid from 'react-native-uuid';

const defaultTokens = [
    {
        id: uuid.v4(),
        symbol: 'ETH',
        iconLarge: '',
        name: 'Ethereum',
        decimal: 18,
        address: '',
    },
    // {
    //     address: '0x5e6b6d9abad9093fdc861ea1600eba1b355cd940',//主网
    //     decimal: 18,
    //     id: uuid.v4(),
    //     name: 'IOT on Chain',
    //     symbol: 'ITC',
    // },
    //test net ERC20Token
    {
        //address: '0x6e7d1b1bdE9A02b1F3ad2D5f81baD90eF68b7994',//测试网
        id: uuid.v4(),
        //iconLarge: 'http://47.75.16.97:9000/images/token/0x5e6b6d9abad9093fdc861ea1600eba1b355cd940@3x.png',
        iconLarge :'',
        symbol: 'ITC',
        name: 'IoT Chain',
        decimal: 18,
        address: '0x6e7d1b1bdE9A02b1F3ad2D5f81baD90eF68b7994',
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
        "constant": true,
        "inputs": [

        ],
        "name": "symbol",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [

        ],
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
    }

];

export { defaultTokens, erc20Abi };
