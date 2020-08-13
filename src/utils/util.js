export default {
    isEmpty(data) {
        if(Array.isArray(data)){
            return data.length === 0
        } else {
            return !data
        }
    }
}