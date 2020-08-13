export function initMap(pos, props = {}){
    //定义地图中心点坐标
    var center = new TMap.LatLng(pos.x, pos.y)
    //定义map变量，调用 TMap.Map() 构造函数创建地图
    return new TMap.Map(document.getElementById('container'), {
        center: center,//设置地图中心点坐标
        zoom: 17.2,   //设置地图缩放级别
        ...props
    });
}

export function getGeolocation(){
    if ("geolocation" in navigator) {
         navigator.geolocation.getCurrentPosition(function(position) {
            return {
                x: position.coords.latitude,
                y: position.coords.longitude
            }
        }, err => {
            console.error(err);
            return
        });
    } else {
        return
    }
}