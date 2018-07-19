import Web3 from 'web3'
import { store } from '../config/store/ConfigureStore'
import Config from 'react-native-config'
import { erc20Abi } from './constants'
import BigNumber from 'bignumber.js'
const Ether = new BigNumber(10e+17)

export default class networkManage {

    static getWeb3Instance() {
        if (typeof web3 !== 'undefined' && wab3.isConnected()) {
            console.log('web3.isconnected:',web3.isConnected())
            return new Web3(web3.currentProvider)
        } else {
            return new Web3(this.getWeb3HTTPProvider())
        }
    }

    static getWeb3HTTPProvider() {
        switch (store.getState().Core.network) {
            case 'ropsten':
                return new Web3.providers.HttpProvider(
                    `https://ropsten.infura.io/${Config.INFURA_API_KEY}`,
                );
            case 'kovan':
                return new Web3.providers.HttpProvider(
                    `https://kovan.infura.io/${Config.INFURA_API_KEY}`,
                );
            case 'rinkeby':
                return new Web3.providers.HttpProvider(
                    `https://rinkeby.infura.io/${Config.INFURA_API_KEY}`,
                );
            default:
                return new Web3.providers.HttpProvider(
                    `https://mainnet.infura.io/${Config.INFURA_API_KEY}`,
                );
        }
    }

    static getBalance({ contractAddress, symbol, decimals }) {
        if (symbol === 'ETH') {
            return this.getEthBalance()
        }
        return this.getERC20Balance(contractAddress, decimals)
    }

    static async getEthBalance() {
        try {
            const { walletAddress } = store.getState().Core
            web3 = this.getWeb3Instance()
            var balance = await web3.eth.getBalance(walletAddress)
            return balance / Math.pow(10, 18)
        } catch (err) {
            console.log('getEthBalanceErr:', err)
        }
    }

    static async getERC20Balance(contractAddress, decimals) {
        try {
            const { walletAddress } = store.getState().Core
            web3 = this.getWeb3Instance()
            const contract =  new web3.eth.Contract(erc20Abi,contractAddress)
            const bigBalance = new BigNumber(await contract.methods.balanceOf(walletAddress).call())
            return parseFloat(bigBalance.dividedBy(Ether)).toFixed(2);
        } catch (err) {
            console.log('getERC20BalanceErr:', err)
        }
    }
}

