import Web3 from 'web3'
import { store } from '../config/store/ConfigureStore'
import { erc20Abi } from './Constants'
import BigNumber from 'bignumber.js'
import etherscan from 'etherscan-api'
import LayoutConstants from '../config/LayoutConstants'
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
var api = etherscan.init(LayoutConstants.ETHERSCAN_API_KEY, store.getState().Core.network, 10000)
export default class NetworkManager {

    static getWeb3Instance() {
        return new Web3(this.getWeb3HTTPProvider())
    }

    static getWeb3HTTPProvider() {
        switch (store.getState().Core.network) {
            case Network.ropsten:
                return new Web3.providers.HttpProvider(
                    `https://ropsten.infura.io/${LayoutConstants.INFURA_API_KEY}`,
                );
            case Network.kovan:
                return new Web3.providers.HttpProvider(
                    `https://kovan.infura.io/${LayoutConstants.INFURA_API_KEY}`,
                );
            case Network.rinkeby:
                return new Web3.providers.HttpProvider(
                    `https://rinkeby.infura.io/${LayoutConstants.INFURA_API_KEY}`,
                );
            default:
                return new Web3.providers.HttpProvider(
                    `https://mainnet.infura.io/${LayoutConstants.INFURA_API_KEY}`,
                );
        }
    }

    /**
     * Get the user's wallet balance of a token
     * 
     * @param {Object} token 
     */
    static getBalance({ address, symbol, decimal }) {
        //token数据结构 
        if (symbol === 'ETH') {
            return this.getEthBalance()
        }
        return this.getERC20Balance(address, decimal)
    }

    /**
     * Get the user's wallet ETH balance
     */
    static async getEthBalance() {
        try {
            const { wallet } = store.getState().Core
            web3 = this.getWeb3Instance()
            var balance = await web3.eth.getBalance(wallet.address)
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
     * @param {String} address 
     * @param {Number} decimal 
     */
    static async getERC20Balance(address, decimal) {
        try {
            const { wallet } = store.getState().Core
            web3 = this.getWeb3Instance()
            const contract = new web3.eth.Contract(erc20Abi, address)
            const bigBalance = new BigNumber(await contract.methods.balanceOf(wallet.address).call())
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
     * @param {number} startBlock
     * @param {number/string} endBlock   default 'latest'
     */
    static getTransations({ address, symbol, decimal },startBlock,endBlock) {
        if (symbol == 'ETH') {
            return this.getEthTransations(startBlock,endBlock)
        }
        return this.getERC20Transations(address, decimal,startBlock,endBlock)
    }

    /**
     * Get a list of ETH transactions for the user's wallet
     */
    static async getEthTransations(startBlock,endBlock) {
        try {
            const { wallet} = store.getState().Core
            var data = await api.account.txlist(wallet.address,startBlock,endBlock)
            if (data.message !== 'OK') {
                return []
            }

            let dataArr = []

            for (const index in data.result) {

                let transaction = data.result[index];
                if (transaction.isError != 0 || transaction.value != 0) {
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
            //console.log('getEthTransations err:', err)
            return []
        }
    }

    /**
     * Get a list of ERC20Token transactions for the user's wallet
     * 
     * @param {String} address 
     * @param {Number} decimal 
     */
    static async getERC20Transations(address, decimal,startBlock,endBlock) {
        try {
            const { wallet } = store.getState().Core
            var data = await api.account.tokentx(wallet.address, address,startBlock,endBlock)
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
                isError: '0',
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
    static sendTransaction({ address, symbol, decimal }, toAddress, amout, gasPrice, privateKey, callBackHash) {
        if (symbol === 'ETH') {
            return this.sendETHTransaction(toAddress, amout, gasPrice, privateKey, callBackHash)
        }
        return this.sendERC20Transaction(address, decimal, toAddress, amout, gasPrice, privateKey, callBackHash)
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
                from: store.getState().Core.wallet.address,
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
     * @param {Streing} address 
     * @param {Number} decimal 
     * @param {String} toAddress 
     * @param {String} amout 
     */
    static async sendERC20Transaction(address, decimal, toAddress, amout, gasPrice, privateKey, callBackHash) {
        try {
            const web3 = this.getWeb3Instance();
            web3.eth.accounts.wallet.add(privateKey)
            const price = web3.utils.toWei(gasPrice.toString(), 'gwei');
            const contract = new web3.eth.Contract(erc20Abi, address)
            const BNAmout = new BigNumber(amout * Math.pow(10, decimal))
            var data = contract.methods.transfer(toAddress, BNAmout).encodeABI()
            var tx = {
                from: store.getState().Core.wallet.address,
                to: address,
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

    static getContractAddressInfo(address) {
        try {
            let contract = new web3.eth.Contract(erc20Abi, address)
            return Promise.all([contract.methods.symbol().call(),
            contract.methods.decimal().call()])
        } catch (err) {
            DeviceEventEmitter.emit('netRequestErr', err)
            console.log('getContractAddressInfo err:', err)
            return Promise.reject(err)
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
            //const result = await FetchUtils.timeoutFetch(fetch(`http://47.75.16.97:3001/tokenPrice?symbol=${symbol}`))
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
                    } else if (monetaryUnitType == 'EUR') {
                        return resJson.data.eur
                    } else if (monetaryUnitType == 'RUB') {
                        return resJson.data.rub
                    } else if (monetaryUnitType == 'UAH') {
                        return resJson.data.uah
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
                    } else if (currentLocale.includes('uk')) {
                        return resJson.data.uah
                    } else if (currentLocale.includes('de') || currentLocale.includes('es') || currentLocale.includes('nl') || currentLocale.includes('fr')) {
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
        const { tokens, wallet } = store.getState().Core
        console.log('L_tokens',tokens)
        const tokensAddresses = tokens
            .filter(token => token.symbol !== 'ETH')
            .map(token => token.address)
        var localTokens = await StorageManage.load(StorageKey.Tokens+wallet.address)
        if (localTokens) {
            localTokens.filter(
                token =>
                    !tokensAddresses.includes(token.address)
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
                address: token.address,
                symbol: token.symbol,
                decimal: token.decimal,
            })
            token["balance"] = balance
            token["price"] = 0
            const ethPrice = await this.getPrice('eth')
            token["ethPrice"] = ethPrice


            if (token.symbol === 'ETH') {
                const ethTotal = balance * ethPrice
                token["price"] = ethPrice
                totalAssets = totalAssets + ethTotal
            } else {
                const price = await this.getPrice(token.symbol.toLowerCase())
                const total = balance * price
                token["price"] = price
                totalAssets = totalAssets + total
            }
            /*if (token.symbol === 'ITC') {
                const itcPrice = await this.getPrice('itc')
                const itcTotal = balance * itcPrice
                token["price"] = itcPrice
                totalAssets = totalAssets + itcTotal
            }*/
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
    * getAllTokens 
    */

    static getAllTokens(params) {
        return FetchUtils.requestGet(NetAddr.getAllTokens, params)
    }
    
    /**
     * getAllTokens 
     */

    static getTokensVersion(params) {
        return FetchUtils.requestGet(NetAddr.getTokensVersion, params)
    }

    /**
     * getMessage消息中心列表
     */

    static getMessageList(params) {
        return FetchUtils.requestGet(NetAddr.getMessageList, params)
    }

    /**
     * readMessage 更新消息已读未读状态
     */

    static readMessage(params) {
        return FetchUtils.requestPost(NetAddr.readMessage, params)
    }

    /**
     *  获取未读消息个数
     */

    static getUnReadMessageCount(params) {
        return FetchUtils.requestGet(NetAddr.getUnReadMessageCount, params)
    }


    /**
     *  将所有的消息标记为已读
     */
    static readAllMessage(params) {
        return FetchUtils.requestPost(NetAddr.readAllMessage, params)
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

    /**
     * version update info
     */

    static getVersionUpdateInfo(params) {
        return FetchUtils.requestGet(NetAddr.getVersionUpdateInfo, params)
    }

    /**
     * user info update
     */

    static async userInfoUpdate(params) {
        let userToken = await StorageManage.load(StorageKey.UserToken)
        if (!userToken || userToken === null) {
            return new Promise.reject('userToken not found');
        }
        params['userToken'] = userToken['userToken']
        return FetchUtils.requestPost(NetAddr.userInfoUpdate, params)
    }


    /**
     * get transaction detail with hashid 
     */

    static async getTransaction(hashId) {
        let web3 = this.getWeb3Instance();
        return await web3.eth.getTransaction(hashId);
    }
}

