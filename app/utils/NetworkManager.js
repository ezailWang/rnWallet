import Web3 from "web3";
import jbokSdk from "./jbok-sdk/src";
import { store } from "../config/store/ConfigureStore";
import { erc20Abi } from "./Constants";
import BigNumber from "bignumber.js";
import etherscan from "etherscan-api";
import LayoutConstants from "../config/LayoutConstants";
import StorageManage from "./StorageManage";
import { StorageKey, Network } from "../config/GlobalConfig";
import {
  addToken,
  loadTokenBalance,
  setTotalAssets,
  setTransactionDetailParams
} from "../config/action/Actions";
import lodash from "lodash";
import { TransferGasLimit, ItcChainId } from "../config/GlobalConfig";
import { I18n } from "../config/language/i18n";
import { DeviceEventEmitter } from "react-native";
import FetchUtils from "./FetchUtils";
import NetAddr from "./NetAddr";
import Analytics from "./Analytics";
const Ether = new BigNumber(10e17);
var api = etherscan.init(
  LayoutConstants.ETHERSCAN_API_KEY,
  store.getState().Core.network,
  10000
);
const jbokSdlUrl = NetAddr.jbokWs;
const client = jbokSdk.Client;
const hasher = jbokSdk.Hasher;
const jsonCodec = jbokSdk.JsonCodec;
const binaryCodec = jbokSdk.BinaryCodec;
const signer = jbokSdk.Signer;
let jbokSdkClient;
export default class NetworkManager {
  static getWeb3Instance() {
    return new Web3(this.getWeb3HTTPProvider());
  }

  static async getJbokSdkInstance() {
    try {
      if (jbokSdkClient === undefined || jbokSdkClient === null) {
        jbokSdkClient = await client.ws(jbokSdlUrl);
      }
    } catch (err) {
      Analytics.recordErr("getJbokSdkInstance", err);
    }
  }

  static async jsonrpc(params) {
    try {
      await this.getJbokSdkInstance();
      return jbokSdkClient.jsonrpc(params);
    } catch (err) {
      Analytics.recordErr("jsonrpcErr", err);
      jbokSdkClient = null;
      return null;
    }
  }

  static getWeb3HTTPProvider() {
    switch (store.getState().Core.network) {
      case Network.ropsten:
        return new Web3.providers.HttpProvider(
          `https://ropsten.infura.io/v3/${LayoutConstants.INFURA_API_KEY}`
        );
      case Network.kovan:
        return new Web3.providers.HttpProvider(
          `https://kovan.infura.io/v3/${LayoutConstants.INFURA_API_KEY}`
        );
      case Network.rinkeby:
        return new Web3.providers.HttpProvider(
          `https://rinkeby.infura.io/v3/${LayoutConstants.INFURA_API_KEY}`
        );
      default:
        return new Web3.providers.HttpProvider(
          `https://mainnet.infura.io/v3/${LayoutConstants.INFURA_API_KEY}`
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
    const wallet = store.getState().Core.wallet;
    if (wallet.type === "eth") {
      return this.getBalanceOfETH({ address, symbol, decimal });
    } else if (wallet.type === "itc") {
      return this.getBalanceOfITC();
    }
  }

  static getBalanceOfETH({ address, symbol, decimal }) {
    if (symbol === "ETH") {
      return this.getEthBalance();
    }
    return this.getEthERC20Balance(address, decimal);
  }

  static getBalanceOfITC() {
    return this.getItcBalance();
  }

  static async getItcBalance() {
    try {
      const { wallet } = store.getState().Core;
      const blockParam = {
        //WithNumber:{n:'830'}    //查询某个区块高度时的余额
        Latest: {} //查询最新余额状态
      };
      const params = {
        method: "getBalance",
        params: [wallet.address, blockParam]
      };
      const balanceJson = await this.jsonrpc(JSON.stringify(params));
      const balance = JSON.parse(balanceJson).result;
      if (balance) {
        return parseFloat(balance / Math.pow(10, 18)).toFixed(4);
      }
      firebase
        .analytics()
        .logEvent("getItcBalanceErr", JSON.parse(balanceJson).error);
      return 0.0;
    } catch (err) {
      DeviceEventEmitter.emit("netRequestErr", err);
      Analytics.recordErr("getItcBalanceCatchErr", err);
      return 0.0;
    }
  }

  /**
   * Get the user's wallet ETH balance
   */
  static async getEthBalance() {
    try {
      const { wallet } = store.getState().Core;
      web3 = this.getWeb3Instance();
      var balance = await web3.eth.getBalance(wallet.address);
      return parseFloat(balance / Math.pow(10, 18)).toFixed(4);
    } catch (err) {
      DeviceEventEmitter.emit("netRequestErr", err);
      Analytics.recordErr("getEthBalanceErr", err);
      return 0.0;
    }
  }

  /**
   * Get the user's wallet balance of a specific ERC20 token
   *
   * @param {String} address
   * @param {Number} decimal
   */
  static async getEthERC20Balance(address, decimal) {
    try {
      const { wallet } = store.getState().Core;
      web3 = this.getWeb3Instance();
      const contract = new web3.eth.Contract(erc20Abi, address);
      const bigBalance = new BigNumber(
        await contract.methods.balanceOf(wallet.address).call()
      );
      return parseFloat(bigBalance.dividedBy(Ether)).toFixed(2);
    } catch (err) {
      DeviceEventEmitter.emit("netRequestErr", err);
      Analytics.recordErr("getEthERC20BalanceErr", err);
      return 0.0;
    }
  }

  /**
   * Get a list of trancsactions for the user's wallet concerning the given token
   *
   * @param {object} token
   * @param {number} startBlock
   * @param {number/string} endBlock   default 'latest'
   */
  static getTransations({ address, symbol, decimal }, startBlock, endBlock) {
    const wallet = store.getState().Core.wallet;
    if (wallet.type === "eth") {
      return this.getTransactionsOfETH(
        { address, symbol, decimal },
        startBlock,
        endBlock
      );
    } else if (wallet.type === "itc") {
      return this.getTransactionOfITC(
        { address, symbol, decimal },
        startBlock,
        endBlock
      );
    }
  }

  static getTransactionsOfETH(
    { address, symbol, decimal },
    startBlock,
    endBlock
  ) {
    if (symbol == "ETH") {
      return this.getEthTransations(startBlock, endBlock);
    }
    return this.getERC20Transations(address, decimal, startBlock, endBlock);
  }

  static getTransactionOfITC(
    { address, symbol, decimal },
    startBlock,
    endBlock
  ) {
    return this.getItcTransations(startBlock, endBlock);
  }

  static async getItcTransations(startBlock, endBlock) {
    const wallet = store.getState().Core.wallet;
    const web3 = this.getWeb3Instance();
    try {
      const params = {
        address: wallet.address,
        size: 100,
        page: 1
      };
      const rsp = await this.getTransactionForItc(params);
      if (rsp.code === 200) {
        return rsp.data.trx.reverse().map(t => ({
          from: t.senderAddress,
          to: t.receivingAddress,
          timeStamp: t.unixTimestamp,
          hash: t.hash,
          value: web3.utils.fromWei(t.value, "ether"),
          gasPrice:
            t.gasPrice === 0
              ? 0
              : web3.utils.fromWei(
                  ((t.gasUsed || t.gasLimit) * t.gasPrice).toString(),
                  "ether"
                ),
          blockNumber: t.blockNumber,
          isError: "0"
        }));
      } else {
        Analytics.recordErr("getItcTransationsRspErr", rsp);
      }
      return [];
    } catch (err) {
      Analytics.recordErr("getItcTransationsCatchErr", err);
      return [];
    }
  }

  /**
   * Get a list of ETH transactions for the user's wallet
   */
  static async getEthTransations(startBlock, endBlock) {
    try {
      const { wallet } = store.getState().Core;
      var data = await api.account.txlist(wallet.address, startBlock, endBlock);
      if (data.message !== "OK") {
        return [];
      }

      let dataArr = [];

      for (const index in data.result) {
        let transaction = data.result[index];
        if (transaction.isError != 0 || transaction.value != 0) {
          dataArr.push(transaction);
        }
      }
      const web3 = this.getWeb3Instance();
      return dataArr.map(t => ({
        from: t.from,
        to: t.to,
        timeStamp: t.timeStamp,
        hash: t.hash,
        value: web3.utils.fromWei(t.value, "ether"),
        isError: t.isError,
        gasPrice: web3.utils.fromWei(
          (parseInt(t.gasUsed) * parseInt(t.gasPrice)).toString(),
          "ether"
        ),
        blockNumber: t.blockNumber
      }));
    } catch (err) {
      DeviceEventEmitter.emit("netRequestErr", err);
      Analytics.recordErr("getEthTransationsErr", err);
      return [];
    }
  }

  /**
   * Get a list of ERC20Token transactions for the user's wallet
   *
   * @param {String} address
   * @param {Number} decimal
   */
  static async getERC20Transations(address, decimal, startBlock, endBlock) {
    try {
      const { wallet } = store.getState().Core;
      var data = await api.account.tokentx(
        wallet.address,
        address,
        startBlock,
        endBlock
      );
      if (data.message !== "OK") {
        return [];
      }
      const web3 = this.getWeb3Instance();

      return data.result.map(t => ({
        from: t.from,
        to: t.to,
        timeStamp: t.timeStamp,
        hash: t.hash,
        value: web3.utils.fromWei(t.value, "ether"),
        gasPrice: web3.utils.fromWei(
          (parseInt(t.gasUsed) * parseInt(t.gasPrice)).toString(),
          "ether"
        ),
        blockNumber: t.blockNumber,
        isError: "0"
      }));
    } catch (err) {
      DeviceEventEmitter.emit("netRequestErr", err);
      Analytics.recordErr("getERC20TransationsErr", err);
      return [];
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
  static sendTransaction(
    { address, symbol, decimal },
    toAddress,
    amout,
    gasPrice,
    privateKey,
    callBackHash
  ) {
    const wallet = store.getState().Core.wallet;
    if (wallet.type === "itc") {
      return this.sendItcTransaction(
        toAddress,
        amout,
        gasPrice,
        privateKey,
        callBackHash
      );
    } else if (wallet.type === "eth") {
      if (symbol === "ETH") {
        return this.sendETHTransaction(
          toAddress,
          amout,
          gasPrice,
          privateKey,
          callBackHash
        );
      }
      return this.sendERC20Transaction(
        address,
        decimal,
        toAddress,
        amout,
        gasPrice,
        privateKey,
        callBackHash
      );
    }
  }

  static async getItcNonce() {
    try {
      const { wallet } = store.getState().Core;
      const blockParam = {
        Latest: {}
      };
      const params = {
        method: "getAccount",
        params: [wallet.address, blockParam]
      };
      const accountRsp = await this.jsonrpc(JSON.stringify(params));
      const accountRes = JSON.parse(accountRsp).result;
      let nonce = accountRes.nonce;
      // const preNonce = await StorageManage.load(StorageKey.ItcWalletNonce, wallet.address)
      // console.log('nonce:', nonce, '\npreNonce:', preNonce)
      // if (preNonce) {
      //     nonce = nonce <= preNonce ? preNonce + 1 : nonce
      // }
      return nonce;
    } catch (err) {
      Analytics.recordErr("getItcAccountErr", err);
      return 0;
    }
  }

  static async sendItcTransaction(
    toAddress,
    amout,
    gasPrice,
    privateKey,
    callBackHash
  ) {
    try {
      const web3 = this.getWeb3Instance();
      const wallet = store.getState().Core.wallet;
      const nonce = await this.getItcNonce();
      const tx = {
        nonce: nonce,
        gasPrice: web3.utils.toHex(gasPrice * Math.pow(10, 9)),
        gasLimit: web3.utils.toHex(TransferGasLimit.itcGasLimit),
        receivingAddress: toAddress,
        value: web3.utils.toWei(amout.toString(), "ether").toString(),
        payload: ""
      };
      const txRow = jsonCodec.decodeTransaction(JSON.stringify(tx));
      const signedTx = signer.signTx(txRow, privateKey, ItcChainId.default);
      const signedTxJson = jsonCodec.encodeSignedTransaction(signedTx);
      const params = {
        method: "sendSignedTransaction",
        params: JSON.parse(signedTxJson)
      };
      const rsp = await this.jsonrpc(JSON.stringify(params));
      const rspO = JSON.parse(rsp);
      if (rspO.result) {
        // StorageManage.save(StorageKey.ItcWalletNonce, tx['nonce'], wallet.address) //发出交易后，存储nonce在本地
        callBackHash(rspO.result);
      } else {
        callBackHash(null);
      }
      return rsp;
    } catch (err) {
      Analytics.recordErr("sendItcTransactionErr", err);
      callBackHash(null);
      return null;
    }
  }

  /**
   * Send an Eth transaction to the given address with the given amout
   *
   * @param {String} toAddress
   * @param {String} amout
   * @param {Number} gasPrice
   */
  static async sendETHTransaction(
    toAddress,
    amout,
    gasPrice,
    privateKey,
    callBackHash
  ) {
    try {
      const web3 = this.getWeb3Instance();
      web3.eth.accounts.wallet.add(privateKey);
      let price = web3.utils.toWei(gasPrice.toString(), "gwei");
      let value = web3.utils.toWei(amout.toString(), "ether");
      let gasLimit = web3.utils.toHex(TransferGasLimit.ethGasLimit);
      let transactionGasPrice = web3.utils.toHex(price);
      let transactionConfig = {
        from: store.getState().Core.wallet.address,
        to: toAddress,
        value: value,
        gas: gasLimit,
        gasPrice: transactionGasPrice
      };
      var cb = await web3.eth
        .sendTransaction(transactionConfig)
        .on("transactionHash", hash => {
          callBackHash(hash);
        });
      return cb;
    } catch (err) {
      DeviceEventEmitter.emit("netRequestErr", err);
      Analytics.recordErr("sendETHTransactionErr", err);
      callBackHash(null);
      return null;
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
  static async sendERC20Transaction(
    address,
    decimal,
    toAddress,
    amout,
    gasPrice,
    privateKey,
    callBackHash
  ) {
    try {
      const web3 = this.getWeb3Instance();
      web3.eth.accounts.wallet.add(privateKey);
      const price = web3.utils.toWei(gasPrice.toString(), "gwei");
      const contract = new web3.eth.Contract(erc20Abi, address);
      const BNAmout = new BigNumber(amout * Math.pow(10, decimal));
      var data = contract.methods.transfer(toAddress, BNAmout).encodeABI();
      var tx = {
        from: store.getState().Core.wallet.address,
        to: address,
        value: "0x0",
        data: data,
        gasLimit: web3.utils.toHex(TransferGasLimit.tokenGasLimit),
        gasPrice: web3.utils.toHex(price)
      };
      // tx['gasLimit'] = await web3.eth.estimateGas(tx)
      var cb = await web3.eth
        .sendTransaction(tx)
        .on("transactionHash", hash => {
          callBackHash(hash);
        });
      return cb;
    } catch (err) {
      DeviceEventEmitter.emit("netRequestErr", err);
      Analytics.recordErr("sendERC20TransactionErr", err);
      return null;
    }
  }

  static async getCurrentBlockNumber() {
    try {
      const wallet = store.getState().Core.wallet;
      if (wallet.type === "itc") {
        const params = {
          method: "bestBlockNumber",
          params: {}
        };
        const jsondata = await this.jsonrpc(JSON.stringify(params));
        const result = JSON.parse(jsondata).result;
        if (result) {
          return result;
        }
        return 0;
      } else {
        const web3 = this.getWeb3Instance();
        return await web3.eth.getBlockNumber();
      }
    } catch (err) {
      DeviceEventEmitter.emit("netRequestErr", err);
      Analytics.recordErr("getCurrentBlockNumberErr", err);
      return 0;
    }
  }

  static isValidAddress(address) {
    try {
      const web3 = this.getWeb3Instance();
      return web3.utils.isAddress(address);
    } catch (err) {
      DeviceEventEmitter.emit("netRequestErr", err);
      Analytics.recordErr("isValidAddressErr", err);
      return false;
    }
  }

  static getContractAddressInfo(address) {
    try {
      let contract = new web3.eth.Contract(erc20Abi, address);
      return Promise.all([
        contract.methods.symbol().call(),
        contract.methods.decimal().call()
      ]);
    } catch (err) {
      DeviceEventEmitter.emit("netRequestErr", err);
      Analytics.recordErr("getContractAddressInfoErr", err);
      return Promise.reject(err);
    }
  }

  /**
   * Get ETH price (abandoned)
   */
  static async getEthPrice() {
    try {
      const { wallet } = store.getState().Core;
      if (wallet.type === "itc") {
        return await this.getPrice("itc");
      } else if (wallet.type === "eth") {
        const data = await api.stats.ethprice();
        ethusd = data.result.ethusd;
        return ethusd;
      }
    } catch (err) {
      DeviceEventEmitter.emit("netRequestErr", err);
      Analytics.recordErr("getEthPriceErr", err);
      return 0;
    }
  }

  /**
   * Query token price
   * @param {string} symbol
   */
  static async getPrice(symbol) {
    try {
      const result = await FetchUtils.timeoutFetch(
        fetch(`https://api.iotchain.io/tokenPrice?symbol=${symbol}`)
      );
      //const result = await FetchUtils.timeoutFetch(fetch(`http://47.75.16.97:3001/tokenPrice?symbol=${symbol}`))
      const resJson = await result.json();
      if (resJson.code === 200) {
        //优先判断货币 如果货币本地没有再使用语言
        //const currentLocale = I18n.currentLocale()
        //var monetaryUnit = await StorageManage.load(StorageKey.MonetaryUnit)
        const monetaryUnit = store.getState().Core.monetaryUnit;
        if (monetaryUnit) {
          let monetaryUnitType = monetaryUnit.monetaryUnitType;
          if (monetaryUnitType == "CNY") {
            return resJson.data.cny;
          } else if (monetaryUnitType == "KRW") {
            return resJson.data.krw;
          } else if (monetaryUnitType == "EUR") {
            return resJson.data.eur;
          } else if (monetaryUnitType == "RUB") {
            return resJson.data.rub;
          } else if (monetaryUnitType == "UAH") {
            return resJson.data.uah;
          } else {
            return resJson.data.usd;
          }
        } else {
          const currentLocale = I18n.locale;
          if (currentLocale.includes("zh")) {
            return resJson.data.cny;
          } else if (currentLocale.includes("ko")) {
            return resJson.data.krw;
          } else if (currentLocale.includes("ru")) {
            return resJson.data.rub;
          } else if (currentLocale.includes("uk")) {
            return resJson.data.uah;
          } else if (
            currentLocale.includes("de") ||
            currentLocale.includes("es") ||
            currentLocale.includes("nl") ||
            currentLocale.includes("fr")
          ) {
            return resJson.data.eur;
          } else {
            //默认美元
            return resJson.data.usd;
          }
        }
      }
      return 0.0;
    } catch (err) {
      DeviceEventEmitter.emit("netRequestErr", err);
      Analytics.recordErr("getPriceErr", err);
      return 0.0;
    }
  }

  /**
   * Load the tokens the user owns
   */
  static async loadTokenList() {
    try {
      //如果是itc钱包，暂不支持erc20
      const { wallet } = store.getState().Core;
      if (wallet.type === "itc") {
        const { tokens } = store.getState().Core;
        const completeTokens = lodash.cloneDeep(tokens);
        var totalAssets = 0.0;
        await Promise.all(
          completeTokens.map(async token => {
            const balance = await this.getBalanceOfITC();
            token["balance"] = balance;
            const price = await this.getPrice(token.symbol.toLowerCase());
            token["price"] = price;
            token["itcPrice"] = price; //暂时使用eth erc20代币的价格
            totalAssets = balance * price;
          })
        );
        store.dispatch(setTotalAssets(totalAssets));
        store.dispatch(loadTokenBalance(completeTokens));
      } else {
        await this.loadTokensFromStorage();
        await this.getTokensBalance();
      }
    } catch (err) {
      DeviceEventEmitter.emit("netRequestErr", err);
      Analytics.recordErr("loadTokenListErr", err);
    }
  }

  static async loadTokensFromStorage() {
    const { tokens, wallet } = store.getState().Core;
    const tokensAddresses = tokens
      .filter(token => token.symbol !== "ETH")
      .map(token => token.address);
    var localTokens = await StorageManage.load(
      StorageKey.Tokens + wallet.address
    );
    if (localTokens) {
      localTokens
        .filter(token => !tokensAddresses.includes(token.address))
        .forEach(token => {
          store.dispatch(addToken(token));
        });
    }
  }

  static async getTokensBalance() {
    const { tokens } = store.getState().Core;
    const completeTokens = lodash.cloneDeep(tokens);
    var totalAssets = 0.0;
    await Promise.all(
      completeTokens.map(async token => {
        const balance = await this.getBalance({
          address: token.address,
          symbol: token.symbol,
          decimal: token.decimal
        });
        token["balance"] = balance;
        token["price"] = 0;
        const ethPrice = await this.getPrice("eth");
        token["ethPrice"] = ethPrice;

        if (token.symbol === "ETH") {
          const ethTotal = balance * ethPrice;
          token["price"] = ethPrice;
          totalAssets = totalAssets + ethTotal;
        } else {
          const price = await this.getPrice(token.symbol.toLowerCase());
          const total = balance * price;
          token["price"] = price;
          totalAssets = totalAssets + total;
        }
        /*if (token.symbol === 'ITC') {
                const itcPrice = await this.getPrice('itc')
                const itcTotal = balance * itcPrice
                token["price"] = itcPrice
                totalAssets = totalAssets + itcTotal
            }*/
      })
    );
    store.dispatch(setTotalAssets(totalAssets));
    store.dispatch(loadTokenBalance(completeTokens));
  }

  static async getSuggestGasPrice() {
    try {
      const { wallet } = store.getState().Core;
      const web3 = this.getWeb3Instance();
      if (wallet.type === "itc") {
        const params = {
          method: "getGasPrice",
          params: {}
        };
        const jsondata = await this.jsonrpc(JSON.stringify(params));
        let result = JSON.parse(jsondata).result;
        result = result === 0 ? 1 : result;
        if (result) {
          const price = web3.utils.fromWei(result, "gwei");
          return price;
        }
        return 0;
      } else if (wallet.type === "eth") {
        let price = await web3.eth.getGasPrice();
        return web3.utils.fromWei(price, "gwei");
      }
    } catch (err) {
      DeviceEventEmitter.emit("netRequestErr", err);
      Analytics.recordErr("getSuggestGasPriceErr", err);
      return 0;
    }
  }

  /**
   * getAllTokens
   */

  static getAllTokens(params) {
    return FetchUtils.requestGet(NetAddr.getAllTokens, params);
  }

  /**
   * getAllTokens
   */

  static getTokensVersion(params) {
    return FetchUtils.requestGet(NetAddr.getTokensVersion, params);
  }

  /**
   * getMessage消息中心列表
   */

  static getMessageList(params) {
    return FetchUtils.requestGet(NetAddr.getMessageList, params);
  }

  /**
   * readMessage 更新消息已读未读状态
   */

  static readMessage(params) {
    return FetchUtils.requestPost(NetAddr.readMessage, params);
  }

  /**
   *  获取未读消息个数
   */

  static getUnReadMessageCount(params) {
    return FetchUtils.requestGet(NetAddr.getUnReadMessageCount, params);
  }

  /**
   *  将所有的消息标记为已读
   */
  static readAllMessage(params) {
    return FetchUtils.requestPost(NetAddr.readAllMessage, params);
  }

  /**
   * feedback
   */

  static uploadFeedback(params, images) {
    return FetchUtils.requestPost(
      NetAddr.feedback,
      params,
      images.length > 0 ? images : null
    );
  }

  /**
   * register
   */

  static deviceRegister(params) {
    return FetchUtils.requestPost(NetAddr.registerDevice, params);
  }

  /**
   * version update info
   */

  static getVersionUpdateInfo(params) {
    return FetchUtils.requestGet(NetAddr.getVersionUpdateInfo, params);
  }

  /**
   *
   *   getTransactionForItc from scan
   */
  static getTransactionForItc(params) {
    return FetchUtils.requestGet(NetAddr.getTransactionByAddress, params);
  }

  /**
   * user info update
   */

  static async userInfoUpdate(params) {
    let userToken = await StorageManage.load(StorageKey.UserToken);
    if (!userToken || userToken === null) {
      return new Promise.reject("userToken not found");
    }
    params["userToken"] = userToken["userToken"];
    return FetchUtils.requestPost(NetAddr.userInfoUpdate, params);
  }

  /**
   * get transaction detail with hashid
   */

  static async getTransaction(hashId) {
    let web3 = this.getWeb3Instance();
    return await web3.eth.getTransaction(hashId);
  }
}
