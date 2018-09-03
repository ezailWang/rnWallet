import Web3 from 'web3'
import { store } from '../config/store/ConfigureStore'
import { erc20Abi } from './constants'
import BigNumber from 'bignumber.js'
import etherscan from 'etherscan-api'
import layoutConstants from '../config/LayoutConstants'
import StorageManage from './StorageManage'
import { StorageKey, Network } from '../config/GlobalConfig'
import { addToken, loadTokenBalance, setTotalAssets } from '../config/action/Actions'
import lodash from 'lodash'
import { TransferGasLimit } from '../config/GlobalConfig'

const Ether = new BigNumber(10e+17)
var api = etherscan.init(layoutConstants.ETHERSCAN_API_KEY, store.getState().Core.network, 10000)
export default class networkManage {

    static getWeb3Instance() {
        return new Web3(this.getWeb3HTTPProvider())
    }

    static getWeb3HTTPProvider() {
        switch (store.getState().Core.network) {
            case Network.ropsten:
                return new Web3.providers.HttpProvider(
                    `https://ropsten.infura.io/${layoutConstants.INFURA_API_KEY}`,
                );
            case Network.kovan:
                return new Web3.providers.HttpProvider(
                    `https://kovan.infura.io/${layoutConstants.INFURA_API_KEY}`,
                );
            case Network.rinkeby:
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
            var balance = await web3.eth.getBalance(walletAddress)
            return parseFloat(balance / Math.pow(10, 18)).toFixed(4)
        } catch (err) {
            console.log('getEthBalanceErr:', err)
            return 0.00
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
            return 0.00
        }
    }

    /**
     * Get a list of trancsactions for the user's wallet concerning the given token
     * 
     * @param {object} token 
     */
    static getTransations({ contractAddress, symbol, decimals }) {
        if (symbol == 'ETH') {
            return this.getEthTransations()
        }
        return this.getERC20Transations(contractAddress, decimals)
    }

    /**
     * Get a list of ETH transactions for the user's wallet
     */
    static async getEthTransations() {
        try {
            const { walletAddress } = store.getState().Core
            var data = await api.account.txlist(walletAddress)
            if (data.message !== 'OK') {
                return []
            }
            const web3 = this.getWeb3Instance();
            return data.result.map(t => ({
                from: t.from,
                to: t.to,
                timeStamp: t.timeStamp,
                hash: t.hash,
                value: web3.utils.fromWei(t.value, 'ether'),
                gasPrice: t.gasPrice,
                blockNumber: t.blockNumber
            }))
        } catch (err) {
            console.log('getEthTransations err:', err)
            return []
        }
    }

    /**
     * Get a list of ERC20Token transactions for the user's wallet
     * 
     * @param {String} contractAddress 
     * @param {Number} decimals 
     */
    static async getERC20Transations(contractAddress, decimals) {
        try {
            const { walletAddress } = store.getState().Core
            var data = await api.account.tokentx(walletAddress, contractAddress)
            if (data.message !== 'OK') {
                return []
            }
            const web3 = this.getWeb3Instance();

            return data.result.map(t => ({
                from: t.from,
                to: t.to,
                timeStamp: t.timeStamp,
                hash: t.hash,
                value: web3.utils.fromWei(t.value, 'ether'),
                gasPrice: t.gasPrice,
                blockNumber: t.blockNumber
            }))
        } catch (err) {
            console.log('getERC20Transations err:', err)
            return []
        }
    }

    /**
     * Send a transaction from the user's wallet 
     * 
     * @param {Object} token 
     * @param {String} toAddress 
     * @param {String} amout 
     * @param {Number} gasPrice  
     */
    static sendTransaction({ contractAddress, symbol, decimals }, toAddress, amout, gasPrice, privateKey) {
        if (symbol === 'ETH') {
            return this.sendETHTransaction(toAddress, amout, gasPrice, privateKey)
        }
        return this.sendERC20Transaction(contractAddress, decimals, toAddress, amout, gasPrice, privateKey)
    }

    /**
     * Send an Eth transaction to the given address with the given amout
     * 
     * @param {String} toAddress 
     * @param {String} amout 
     * @param {Number} gasPrice 
     */
    static async sendETHTransaction(toAddress, amout, gasPrice, privateKey) {
        try {
            const web3 = this.getWeb3Instance();
            web3.eth.accounts.wallet.add(privateKey)
            let price = web3.utils.toWei(gasPrice.toString(), 'gwei');
            let value = web3.utils.toWei(amout.toString(), 'ether');
            let gasLimit = web3.utils.toHex(TransferGasLimit.ethGasLimit);
            let transactionGasPrice = web3.utils.toHex(price);
            let transactionConfig = {
                from: store.getState().Core.walletAddress,
                to: toAddress,
                value: value,
                gas: gasLimit,
                gasPrice: transactionGasPrice,
            };
            console.log(transactionConfig);
            var cb = await web3.eth.sendTransaction(transactionConfig)
            return cb
        } catch (err) {
            console.log('sendETHTransaction err:', err)
            return null
        }
    }

    /**
     * Send an ERC20Token transaction to the given address with the given amout
     * 
     * @param {Streing} contractAddress 
     * @param {Number} decimals 
     * @param {String} toAddress 
     * @param {String} amout 
     */
    static async sendERC20Transaction(contractAddress, decimals, toAddress, amout, gasPrice, privateKey) {
        try {
            const web3 = this.getWeb3Instance();
            web3.eth.accounts.wallet.add(privateKey)
            const price = web3.utils.toWei(gasPrice.toString(), 'gwei');
            const contract = new web3.eth.Contract(erc20Abi, contractAddress)
            var data = contract.methods.transfer(toAddress, amout * Math.pow(10, decimals)).encodeABI()
            var tx = {
                from: store.getState().Core.walletAddress,
                to: contractAddress,
                value: "0x0",
                data: data,
                gasLimit: web3.utils.toHex(TransferGasLimit.tokenGasLimit),
                gasPrice: web3.utils.toHex(price),
            }
            // tx['gas'] = await web3.eth.estimateGas(tx)
            var cb = await web3.eth.sendTransaction(tx)
            return cb
        } catch (err) {
            console.log('sendERC20Transaction err:', err)
            return null
        }
    }

    static isValidAddress(address) {
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
        return ethusd
    }

    /**
     * Load the tokens the user owns
     */
    static async loadTokenList() {
        try {
            await this.loadTokensFromStorage()
            await this.getTokensBalance()
        } catch (err) {
            console.log('loadTokenList err:', err)
        }
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
                decimals: token.decimals,
            })
            token["balance"] = balance
            token["price"] = 0
            if (token.symbol === 'ETH') {
                const ethPrice = await this.getEthPrice()
                const total = balance * ethPrice
                token["price"] = ethPrice
                store.dispatch(setTotalAssets(total))
            }
            //token的价格暂时无法获取
        }))
        store.dispatch(loadTokenBalance(completeTokens))
    }

    static async getSuggestGasPrice() {

        const web3 = this.getWeb3Instance();
        let price = await web3.eth.getGasPrice();
        return web3.utils.fromWei(price, 'gwei')
    }
}

