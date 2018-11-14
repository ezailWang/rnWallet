//let host = 'http://47.75.16.97:9000/'
let host = 'https://wallet.iotchain.io/'

let NetAddr = {
    feedback:host + 'wallet/feedback/new',
    registerDevice:host + 'wallet/user/register',
    getVersionUpdateInfo:host + 'wallet/version',
    getAllTokens:host + 'tokens',
    getTokensVersion : host + 'tokens/version',
    getMessageList : host + 'wallet/user/messages',
    readMessage : host + 'wallet/user/readMessage',
    readAllMessage : host + 'wallet/user/readAllMessage',
    getUnReadMessageCount : host + 'wallet/user/newMessageAccount',
    userInfoUpdate:host + 'wallet/user/update'
}

export default NetAddr
