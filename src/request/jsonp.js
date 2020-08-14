import originJSONP from 'jsonp'

const BASE_URL = 'https://apis.map.qq.com/ws'
export default function jsonp(url, data) {
    const fullUrl = BASE_URL + url + (url.indexOf('?') < 0 ? '?' : '&') + param({
        ...data,
        output: 'jsonp',
        key: process.env.TX_MAP_KEY
    })
    return new Promise((resolve, reject) => {
        originJSONP(fullUrl, {
            param: 'callback'
        }, (err, data) => {
            if (!err) {
                resolve(data)
            } else {
                reject(err)
            }
        })
    })
}

function param(data) {
    let url = ''
    for (var k in data) {
        let value = data[k] !== undefined ? data[k] : ''
        url += `&${k}=${encodeURIComponent(value)}`
    }
    // 删除第一个&
    return url ? url.substring(1) : ''
}