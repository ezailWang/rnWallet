// let host = 'http://47.75.16.97:9000/'
const host = 'https://wallet.iotchain.io/';
const itcHost = 'https://scan.iotchain.io/';
const swftHost = 'https://transfer.swft.pro/';
// const swftHost = 'https://test.swftcoin.com/';
// const itcHost = 'http://192.168.50.83:7777/'

const NetAddr = {
  jbokWs: 'ws://47.52.218.141:20002',
  jbokHttp: 'http://47.52.218.141:20002',
  feedback: `${host}wallet/feedback/new`,
  registerDevice: `${host}wallet/user/register`,
  getVersionUpdateInfo: `${host}wallet/version`,
  getAllTokens: `${host}tokens`,
  getTokensVersion: `${host}tokens/version`,
  getMessageList: `${host}wallet/user/messages`,
  readMessage: `${host}wallet/user/readMessage`,
  readAllMessage: `${host}wallet/user/readAllMessage`,
  getUnReadMessageCount: `${host}wallet/user/newMessageAccount`,
  userInfoUpdate: `${host}wallet/user/update`,
  getTransactionByAddress: `${itcHost}v1/transaction/address`,
  queryCoinList: `${swftHost}api/v1/queryCoinList`,
  getBaseInfo: `${swftHost}api/v1/getBaseInfo`,
  accountExchange: `${swftHost}api/v2/accountExchange`,
  queryOrderState: `${swftHost}api/v2/queryOrderState`,
  queryAllTrade: `${swftHost}api/v2/queryAllTrade`,
  bindConvertAddress: `${host}bindConvertAddress`,
  queryConvertAddress: `${host}convertAddressList`,
  queryConvertTxList: `${host}userConvertList`,
  // transactionDetail:itcHost + 'v1/transavtion/hash'
};

export default NetAddr;
