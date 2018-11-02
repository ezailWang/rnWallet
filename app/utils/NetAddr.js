let host = 'http://47.75.16.97:9000/'

let NetAddr = {
    feedback:host + 'wallet/feedback/new',
    registerDevice:host + 'wallet/user/register',
    getVersionUpdateInfo:host + 'wallet/version',
    getAllTokens:host + 'tokens'
}

export default NetAddr
