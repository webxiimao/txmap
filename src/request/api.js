import request from './axios'
import jsonp from './jsonp'
export default {
    geocoder(params){
        return jsonp('/geocoder/v1/', params)
    },
    search(params){
        return jsonp('/place/v1/search', params)
    },
    direction(params){
        return jsonp('/direction/v1/driving/', params)
    }
}