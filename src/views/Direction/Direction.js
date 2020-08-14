import React, { useState, useEffect, useRef } from 'react'
import MyMap from '@/components/MyMap'
import { setMapCenter } from '@/utils/mapUtil'
import { DEFAULT_POS } from '@/config/constant'
import { useSetStateCb } from '@/hooks'
import { InputGroup, FormControl, Button, Card, Form } from 'react-bootstrap'
import api from '@/request/api'
import { get } from 'lodash'
import Padding from '@/components/Padding'

function formatPoi(obj){
    return `${obj.lat},${obj.lng}`
}

function parserPolyline(polyline){
    var coors = [...polyline]
    for (var i = 2; i < coors.length ; i++)
    {coors[i] = coors[i-2] + coors[i]/1000000}
    return coors
}

// planType 0 1 2
export default () => {
    const [ map, setMapCtx ] = useState()
    // const [ planType, setPlanType ] = useState(0)
    const planType = useRef(0)
    const route = useRef()
    const marker = useRef({})
    const startPoint = useRef()
    const infoWindow = useRef({})
    const endPoint = useRef()
    const getRef = ref => {
        setMapCtx(ref)
    }
    useSetStateCb(() => {
        init()
    }, [ map ])
    function init() {
        initMap()
        initMarker()
        initRouter()
        initInfoWindow()
    }
    function initInfoWindow(){
        infoWindow.current = new TMap.InfoWindow({
            map,
            position: map.getCenter(),
            offset: {   // 设置信息弹窗的偏移量，否则会和marker重合
              x: 0,
              y: -48
            }
        }).close();
    }
    function initMarker(){
        marker.current = new TMap.MultiMarker({
            id: 'marker',
            map,
            styles: {
                "start": new TMap.MarkerStyle({
                    "width": 25,
                    "height": 35,
                    "anchor": { x: 16, y: 32 },
                    "src": 'https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/start.png'
                }),
                "end": new TMap.MarkerStyle({
                    "width": 25,
                    "height": 35,
                    "anchor": { x: 16, y: 32 },
                    "src": 'https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/end.png'
                }),
            },
            geometries: []
        });
    }
    function cleanup(){
        marker.current.setGeometries([])
        startPoint.current = undefined
        endPoint.current = undefined
        if (route.current) {
            route.current.setGeometries([])
        }
    }
    function initMap(){
        map.on('click', evt => {
            if (planType.current === 2)return
            const latLng = evt.latLng
            const curPlanType = planType.current + 1
            if (curPlanType === 1) {
                startPoint.current = latLng
            } else if(curPlanType === 2) {
                endPoint.current = latLng
            }
            marker.current.add({
                position: latLng,
                styleId: curPlanType === 1 ? 'start' : 'end'
            })
            planType.current = curPlanType
        })
    }
    const initRouter = () => {
        route.current = new TMap.MultiPolyline({
            map, // 绘制到目标地图
            // 折线样式定义
            styles: {
              'style_blue': new TMap.PolylineStyle({
                'color': '#3777FF', //线填充色
                'width': 4, //折线宽度
                'borderWidth': 2, //边线宽度
                'borderColor': '#FFF', //边线颜色
                'lineCap': 'round' //线端头方式
              })
            },
            geometries: [],
        });
        route.current.on('click', evt => {
            const content = `<div>
                <p>预计总距离: ${evt.geometry.properties.distance}</p>
                <p>预计总时间: ${evt.geometry.properties.duration}</p>
            </div>`
            infoWindow.current.open();
            infoWindow.current.setPosition(evt.geometry.position);  // 设置信息窗口的坐标
            infoWindow.current.setContent(content);   
        })
    }
    const planRouter = () => {
        if (!startPoint.current || !endPoint.current){
            return
        }
        api.direction({
            from: formatPoi(startPoint.current),
            to: formatPoi(endPoint.current),
        }).then(res => {
            const routes = get(res, 'result.routes[0]', {})
            const { steps, polyline, distance, duration } = routes
            const formatLine = parserPolyline(polyline)
            // const paths = formatLine.reduce(point => {
            //     return new TMap.LatLng(get(point, 'location.lat'), get(point, 'location.lng'))
            // })
            let paths = [],
                i = 0;
            while(i + 1 <= formatLine.length){
                paths.push(new TMap.LatLng(formatLine[i], formatLine[i+1]))
                i += 2
            }
            route.current.setGeometries([{
                styleId: 'style_blue',
                paths,
                properties: {
                    distance: distance + '米',
                    duration: duration + '分钟'
                }
            }])
        })
    }
    const clearRouter = () => {
        cleanup()
        planType.current = 0
    }
    return <>
        <div style={{ textAlign: 'left', marginLeft: '25px' }}>
            <Button onClick={planRouter} variant="secondary">路径规划</Button>
            <Padding pad={'5px'}/>
            <Button onClick={clearRouter} variant="secondary">清空路径</Button>
        </div>
        <MyMap getCtx={getRef} />
        <div className="footer">
            默认采用驾车路线<br/>
            点击地图设置起点<br/>
            点击地图设置终点<br/>
            点击【路线规划】按钮展示路径<br/>
            点击路径 展示 距离和时间
        </div>
    </>
}