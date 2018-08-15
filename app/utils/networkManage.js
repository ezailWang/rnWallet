import Web3 from 'web3'
import { store } from '../config/store/ConfigureStore'
import { erc20Abi } from './constants'
import BigNumber from 'bignumber.js'
import etherscan from 'etherscan-api'
import layoutConstants from '../config/LayoutConstants'
import StorageManage from './StorageManage'
import { StorageKey } from '../config/GlobalConfig'
import { addToken, loadTokenBalance, setTotalAssets } from '../config/action/Actions'
import lodash from 'lodash'


const Ether = new BigNumber(10e+17)
var api = etherscan.init(layoutConstants.ETHERSCAN_API_KEY, store.getState().Core.network, 10000)
export default class networkManage {

    static getWeb3Instance() {
        if (typeof web3 !== 'undefined') {
            return new Web3(web3.currentProvider)
        } else {
            return new Web3(this.getWeb3HTTPProvider())
        }
    }




    static getWeb3HTTPProvider() {
        switch (store.getState().Core.network) {
            case 'ropsten':
                return new Web3.providers.HttpProvider(
                    `https://ropsten.infura.io/${layoutConstants.INFURA_API_KEY}`,
                );
            case 'kovan':
                return new Web3.providers.HttpProvider(
                    `https://kovan.infura.io/${layoutConstants.INFURA_API_KEY}`,
                );
            case 'rinkeby':
                return new Web3.providers.HttpProvider(
                    `https://rinkeby.infura.io/${layoutConstants.INFURA_API_KEY}`,
                );
            default:
                return new Web3.providers.HttpProvider(
                    `https://mainnet.infura.io/${layoutConstants.INFURA_API_KEY}`,
                );
        }
    }

    /**
     * Get the user's wallet balance of a token
     * 
     * @param {Object} token 
     */
    static getBalance({ contractAddress, symbol, decimals }) {
        //token数据结构 
        if (symbol === 'ETH') {
            return this.getEthBalance()
        }
        return this.getERC20Balance(contractAddress, decimals)
    }

    /**
     * Get the user's wallet ETH balance
     */
    static async getEthBalance() {
        try {
            const { walletAddress } = store.getState().Core
            web3 = this.getWeb3Instance()
            console.log('walletAddress:', walletAddress)
            var balance = await web3.eth.getBalance(walletAddress)
            return parseFloat(balance / Math.pow(10, 18)).toFixed(4)
        } catch (err) {
            console.log('getEthBalanceErr:', err)
        }
    }

    /**
     * Get the user's wallet balance of a specific ERC20 token
     * 
     * @param {String} contractAddress 
     * @param {Number} decimals 
     */
    static async getERC20Balance(contractAddress, decimals) {
        try {
            const { walletAddress } = store.getState().Core
            web3 = this.getWeb3Instance()
            const contract = new web3.eth.Contract(erc20Abi, contractAddress)
            const bigBalance = new BigNumber(await contract.methods.balanceOf(walletAddress).call())
            return parseFloat(bigBalance.dividedBy(Ether)).toFixed(2);
        } catch (err) {
            console.log('getERC20BalanceErr:', err)
        }
    }

    /**
     * Get a list of trancsactions for the user's wallet concerning the given token
     * 
     * @param {object} token 
     */
    static getTransations({ contractAddress, symbol, decimals }) {
        if (symbol === 'ETH') {
            return this.getEthTransations()
        }
        return this.getERC20Transations(contractAddress, decimals)
    }

    /**
     * Get a list of ETH transactions for the user's wallet
     */
    static async getEthTransations() {
        const { walletAddress } = store.getState().Core
        var data = await api.account.txlist(walletAddress)
        if (data.message !== 'OK') {
            return []
        }


        console.warn(data.result);
        console.log('ransactions'+data);

        return data.result.map(t => ({
            from: t.from,
            to:t.to,
            timeStamp: t.timeStamp,
            hash: t.hash,
            value: (parseInt(t.value, 10) / 1e18).toFixed(2),
        }))
    }

    /**
     * Get a list of ERC20Token transactions for the user's wallet
     * 
     * @param {String} contractAddress 
     * @param {Number} decimals 
     */
    static async getERC20Transations(contractAddress, decimals) {
        const { walletAddress } = store.getState().Core
        var data = await api.account.tokentx(walletAddress, contractAddress)
        if (data.message !== 'OK') {
            return []
        }
        return data.result.map(t => ({
            from: t.from,
            to:t.to,
            timeStamp: t.timeStamp,
            hash: t.hash,
            value: (parseInt(t.value, 16) / Math.pow(10, decimals)).toFixed(2),
        }))
    }

    /**
     * Send a transaction from the user's wallet 
     * 
     * @param {Object} token 
     * @param {String} toAddress 
     * @param {String} amout 
     */
    static sendTransaction({ contractAddress, symbol, decimals }, toAddress, amout) {
        if (symbol === 'ETH') {
            return this.sendETHTransaction(toAddress, amout)
        }
        return this.sendERC20Transaction(contractAddress, decimals, toAddress, amout)
    }

    /**
     * Send an Eth transaction to the given address with the given amout
     * 
     * @param {String} toAddress 
     * @param {String} amout 
     * @param {Number} gas 
     */
    static async sendETHTransaction(toAddress, amout, gas) {
        const web3 = this.getWeb3Instance();
        const wallet = web3.eth.accounts.wallet.add(store.getState().Core.prikey)
        var cb = await web3.eth.sendTransaction({
            from: store.getState().Core.walletAddress,
            to: toAddress,
            value: web3.utils.toWei(amout),
            gas: 21000
        })
        return cb
    }

    /**
     * Send an ERC20Token transaction to the given address with the given amout
     * 
     * @param {Streing} contractAddress 
     * @param {Number} decimals 
     * @param {String} toAddress 
     * @param {String} amout 
     */
    static async sendERC20Transaction(contractAddress, decimals, toAddress, amout) {
        const web3 = this.getWeb3Instance();
        const wallet = web3.eth.accounts.wallet.add(store.getState().Core.prikey)
        const contract = new web3.eth.Contract(erc20Abi, contractAddress)
        var data = contract.methods.transfer(toAddress, amout * Math.pow(10, decimals)).encodeABI()
        var tx = {
            from: store.getState().Core.walletAddress,
            to: contractAddress,
            value: "0x0",
            data: data
        }
        tx['gas'] = await web3.eth.estimateGas(tx)
        var cb = await web3.eth.sendTransaction(tx)
        return cb
    }

    static isValidAddress(address) {
        //  console.warn(address, address.length);
        const web3 = this.getWeb3Instance();
        console.log(web3.utils.isAddress(address))
        return web3.utils.isAddress(address);
    }

    /**
     * Get ETH price
     */
    static async getEthPrice() {
        const data = await api.stats.ethprice()
        ethusd = data.result.ethusd
        console.log('price:', data)
        return ethusd
    }

    /**
     * Load the tokens the user owns
     */
    static async loadTokenList() {
        await this.loadTokensFromStorage()
        await this.getTokensBalance()
    }

    static async loadTokensFromStorage() {
        const { tokens, walletAddress } = store.getState().Core
        const tokensAddresses = tokens
            .filter(token => token.symbol !== 'ETH')
            .map(token => token.contractAddress)
        var localTokens = await StorageManage.load(StorageKey.Tokens)
        if (localTokens) {
            localTokens.filter(
                token =>
                    !tokensAddresses.includes(token.contractAddress)
            )
                .forEach(
                    token => {
                        store.dispatch(addToken(token))
                    }
                )
        }
    }

    static async getTokensBalance() {
        const { tokens } = store.getState().Core
        const completeTokens = lodash.cloneDeep(tokens)
        await Promise.all(completeTokens.map(async (token) => {
            const balance = await this.getBalance({
                contractAddress: token.contractAddress,
                symbol: token.symbol,
                decimals: token.decimals
            })
            token["balance"] = balance
            if (token.symbol === 'ETH') { 
                const total = balance * await this.getEthPrice()
                store.dispatch(setTotalAssets(total))
            }
        }))
        store.dispatch(loadTokenBalance(completeTokens))
    }
}

