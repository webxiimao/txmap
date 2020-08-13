import request from './axios'
export default {
    geocoder(params){
        return request({
            url: '/geocoder/v1/',
            method: 'get',
            params
        })
    },
    search(params){
        return request({
            url: '/place/v1/search',
            method: 'get',
            params
        })
    },
}