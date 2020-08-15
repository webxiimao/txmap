export default {
    isEmpty(data) {
        if(Array.isArray(data)){
            return data.length === 0
        } else {
            return !data
        }
    },
    useLib(url, name){
        if (eval('window.__Lib__' + name)) {
            return Promise.resolve()
        }
        return new Promise((resolve, reject) => {
            const script = document.createElement('script')
            script.id = '__Lib__' + name
            script.src = url
            script.onload = function(){
                resolve()
            }
            document.getElementsByTagName("head")[0].appendChild(script);
        })
        
    }
}