import request from './axios'
export function geocoder(){
    return request({
        url: '/geocoder/v1/',
        method: 'get',
        params: {
            address: '深圳市前海微众银行'
        }
    })
}