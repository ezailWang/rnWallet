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
import { I18n } from '../config/language/i18n'
import { DeviceEventEmitter } from 'react-native'
import FetchUtils from './FetchUtils'
import NetAddr from './NetAddr'

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
            DeviceEventEmitter.emit('netRequestErr', err)
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
            DeviceEventEmitter.emit('netRequestErr', err)
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

            let dataArr = []

            for (const index in data.result) {

                let transaction = data.result[index];
                if(transaction.isError != 0 || transaction.value != 0){
                    dataArr.push(transaction)
                }
            }

            const web3 = this.getWeb3Instance();
            return dataArr.map(t => ({
                from: t.from,
                to: t.to,
                timeStamp: t.timeStamp,
                hash: t.hash,
                value: web3.utils.fromWei(t.value, 'ether'),
                isError: t.isError,
                gasPrice: web3.utils.fromWei(t.gasUsed, 'gwei'),
                blockNumber: t.blockNumber
            }))
        } catch (err) {
            DeviceEventEmitter.emit('netRequestErr', err)
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
                gasPrice: web3.utils.fromWei(t.gasUsed, 'gwei'),
                blockNumber: t.blockNumber,
                isError: t.isError,
            }))
        } catch (err) {
            DeviceEventEmitter.emit('netRequestErr', err)
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
    static sendTransaction({ contractAddress, symbol, decimals }, toAddress, amout, gasPrice, privateKey, callBackHash) {
        if (symbol === 'ETH') {
            return this.sendETHTransaction(toAddress, amout, gasPrice, privateKey, callBackHash)
        }
        return this.sendERC20Transaction(contractAddress, decimals, toAddress, amout, gasPrice, privateKey, callBackHash)
    }

    /**
     * Send an Eth transaction to the given address with the given amout
     * 
     * @param {String} toAddress 
     * @param {String} amout 
     * @param {Number} gasPrice 
     */
    static async sendETHTransaction(toAddress, amout, gasPrice, privateKey, callBackHash) {
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
            var cb = await web3.eth.sendTransaction(transactionConfig).on('transactionHash', (hash) => {
                callBackHash(hash)
            })
            return cb
        } catch (err) {
            DeviceEventEmitter.emit('netRequestErr', err)
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
    static async sendERC20Transaction(contractAddress, decimals, toAddress, amout, gasPrice, privateKey, callBackHash) {
        try {
            const web3 = this.getWeb3Instance();
            web3.eth.accounts.wallet.add(privateKey)
            const price = web3.utils.toWei(gasPrice.toString(), 'gwei');
            const contract = new web3.eth.Contract(erc20Abi, contractAddress)
            const BNAmout = new BigNumber(amout * Math.pow(10, decimals))
            var data = contract.methods.transfer(toAddress, BNAmout).encodeABI()
            var tx = {
                from: store.getState().Core.walletAddress,
                to: contractAddress,
                value: "0x0",
                data: data,
                gasLimit: web3.utils.toHex(TransferGasLimit.tokenGasLimit),
                gasPrice: web3.utils.toHex(price),
            }
           // tx['gasLimit'] = await web3.eth.estimateGas(tx)
            var cb = await web3.eth.sendTransaction(tx).on('transactionHash', (hash) => {
                callBackHash(hash)
            })
            return cb
        } catch (err) {
            DeviceEventEmitter.emit('netRequestErr', err)
            console.log('sendERC20Transaction err:', err)
            return null
        }
    }

    static async getCurrentBlockNumber() {
        try {
            const web3 = this.getWeb3Instance();
            return await web3.eth.getBlockNumber();
        } catch (err) {
            DeviceEventEmitter.emit('netRequestErr', err)
            console.log('getCurrentBlockNumber err:', err)
            return 0
        }
    }

    static isValidAddress(address) {
        try {
            const web3 = this.getWeb3Instance();
            return web3.utils.isAddress(address);
        } catch (err) {
            DeviceEventEmitter.emit('netRequestErr', err)
            console.log('isValidAddress err:', err)
            return false
        }
    }

    /**
     * Get ETH price (abandoned)
     */
    static async getEthPrice() {
        try {
            const data = await api.stats.ethprice()
            ethusd = data.result.ethusd
            return ethusd
        } catch (err) {
            DeviceEventEmitter.emit('netRequestErr', err)
            console.log('getEthPrice err:', err)
            return 0
        }
    }

    /**
     * Query token price
     * @param {string} symbol 
     */
    static async getPrice(symbol) {
        try {
            const result = await FetchUtils.timeoutFetch(fetch(`https://api.iotchain.io/tokenPrice?symbol=${symbol}`))
            const resJson = await result.json()
            if (resJson.code === 200) {
                //优先判断货币 如果货币本地没有再使用语言
                //const currentLocale = I18n.currentLocale()
                //var monetaryUnit = await StorageManage.load(StorageKey.MonetaryUnit) 
                const monetaryUnit = store.getState().Core.monetaryUnit
                if (monetaryUnit) {
                    let monetaryUnitType = monetaryUnit.monetaryUnitType
                    if (monetaryUnitType == 'CNY') {
                        return resJson.data.cny
                    } else if (monetaryUnitType == 'KRW') {
                        return resJson.data.krw
                    } else if(monetaryUnitType == 'EUR'){
                        return resJson.data.eur
                    } else if(monetaryUnitType == 'RUB'){
                        return resJson.data.rub
                    } else {
                        return resJson.data.usd
                    }
                } else {
                    const currentLocale = I18n.locale
                    if (currentLocale.includes('zh')) {
                        return resJson.data.cny
                    } else if (currentLocale.includes('ko')) {
                        return resJson.data.krw
                    } else if (currentLocale.includes('ru')) {
                        return resJson.data.rub
                    } else if (currentLocale.includes('de') || currentLocale.includes('es') || currentLocale.includes('nl') || currentLocale.includes('fr') ) {
                        return resJson.data.eur
                    } else {
                        //默认美元
                        return resJson.data.usd
                    }
                }

            }
            return 0.00
        } catch (err) {
            DeviceEventEmitter.emit('netRequestErr', err)
            console.log('getPrice err:', err)
            return 0.00
        }
    }

    /**
     * Load the tokens the user owns
     */
    static async loadTokenList() {
        try {
            await this.loadTokensFromStorage()
            await this.getTokensBalance()
        } catch (err) {
            DeviceEventEmitter.emit('netRequestErr', err)
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
        var totalAssets = 0.00
        await Promise.all(completeTokens.map(async (token) => {
            const balance = await this.getBalance({
                contractAddress: token.contractAddress,
                symbol: token.symbol,
                decimals: token.decimals,
            })
            token["balance"] = balance
            token["price"] = 0
            const ethPrice = await this.getPrice('eth')
            token["ethPrice"] = ethPrice
            if (token.symbol === 'ETH') {
                const ethTotal = balance * ethPrice
                token["price"] = ethPrice
                totalAssets = totalAssets + ethTotal
            }
            if (token.symbol === 'ITC') {
                const itcPrice = await this.getPrice('itc')
                const itcTotal = balance * itcPrice
                token["price"] = itcPrice
                totalAssets = totalAssets + itcTotal
            }
        }))
        store.dispatch(setTotalAssets(totalAssets))
        store.dispatch(loadTokenBalance(completeTokens))
    }

    static async getSuggestGasPrice() {
        try {
            const web3 = this.getWeb3Instance();
            let price = await web3.eth.getGasPrice();
            return web3.utils.fromWei(price, 'gwei')
        } catch (err) {
            DeviceEventEmitter.emit('netRequestErr', err)
            console.log('getSuggestGasPrice err:', err)
            return 0
        }
    }

    /**
     * feedback 
     */

    static uploadFeedback(params, images) {
        return FetchUtils.requestPost(NetAddr.feedback, params, images.length > 0 ? images : null)
    }

    /**
     * register
     */

    static deviceRegister(params) {
        return FetchUtils.requestPost(NetAddr.registerDevice, params)
    }


}

