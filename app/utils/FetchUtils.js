
import MD5 from 'react-native-md5'
const signKey = 'Ub9xq1Ju~T&.g%B7?8!]OpB+ab,b7q19w'

export default class FetchUtils {

    /**
     * fetch timeout
     * @param {Promise} fetch_promise  fetch Request to return the Promise
     * @param {number} [timeout = 10000] In milliseconds, the default timeout is set to 10 seconds  
     * @return {Promise}
     */
    static timeoutFetch(fetch_promise, timeout = 10000) {
        let timeout_fn = null
        let timeout_promise = new Promise((resolve, reject) => {
            timeout_fn = () => {
                reject('timeout promise')
            }
        })
        let abortable_promise = Promise.race([
            fetch_promise,
            timeout_promise
        ])
        setTimeout(() => {
            timeout_fn()
        }, timeout);
        return abortable_promise
    }

    static requestGet(url, params) {
        if (params) {
            let paramsArray = []
            Object.keys(params).forEach(key => paramsArray.push(key + '=' + params[key]))
            if (url.search(/\?/) === -1) {
                url += '?' + paramsArray.join('&')
            } else {
                url += '&' + paramsArray.join('&')
            }
        }
        const currentTime = new Date().getTime()
        let sign = MD5.hex_md5(this.getSign(currentTime))
        let signParam = ['time=' + currentTime, 'sign=' + sign].join('&')
        if (url.search(/\?/) === -1) {
            url += '?' + signParam
        } else {
            url += '&' + signParam
        }
        return new Promise((resolve, reject) => {
            this.timeoutFetch(fetch(url, {
                method: 'GET'
            }))
                .then(response => response.json())
                .then(responseJson => {
                    resolve(responseJson)
                })
                .catch((err) => {
                    reject(err)
                })

        })
    }

    static requestPost(url, params, images) {
        const currentTime = new Date().getTime()
        let sign = MD5.hex_md5(this.getSign(currentTime))
        params['sign'] = sign
        params['time'] = currentTime
        if (images) {
            let formData = new FormData()
            Object.keys(params).forEach((key) => {
                formData.append(key, params[key])
            })
            for (let i = 0; i < images.length; i++) {
                let uri = images[i]['uri']
                let name = params['userId'] + '_' + new Date().getTime() + '_' + i + '.png'
                let imagefile = { uri: uri, type: 'multipart/form-data', name: name }
                formData.append('feedbackImage', imagefile)
            }
            return new Promise((resolve, reject) => {
                this.timeoutFetch(fetch(url, {
                    method: 'POST',
                    body: formData
                }))
                    .then((response) => response.json())
                    .then((responseJson) => {
                        resolve(responseJson)
                    })
                    .catch((err) => {
                        reject(err)
                    })
            })
        } else {
            return new Promise((resolve, reject) => {
                this.timeoutFetch(fetch(url, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json;charset=UTF-8"
                    },
                    body: JSON.stringify(params),
                }))
                    .then((response) => response.json())
                    .then((responseJson) => {
                        resolve(responseJson)
                    })
                    .catch((err) => {
                        reject(err)
                    })
            })
        }
    }

    static getSign(currentTime) {
        let inputSign = currentTime + signKey
        let outputSign = ''
        for (let i = 0; i < inputSign.length; i++) {
            if (i % 2 === 0) {
                outputSign += inputSign[i]
            }
        }
        return outputSign
    }



}