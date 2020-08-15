import React, { useState, useEffect, useRef } from 'react'
import MyMap from '@/components/MyMap'
import { setMapCenter } from '@/utils/mapUtil'
import util from '@/utils/util'
import { DEFAULT_POS } from '@/config/constant'
import { useSetStateCb } from '@/hooks'
import { InputGroup, FormControl, Button, Card, Form } from 'react-bootstrap'
import api from '@/request/api'
import { get } from 'lodash'
import Padding from '@/components/Padding'

export default (props) => {
    const mapProps = {
        mapStyleId: 'style1',
        zoom: 8
    }
    const [ map, setMapCtx ] = useState()
    const infoWindow = useRef({})
    const dot = useRef({})
    const getRef = (ref) => {
        util.useLib('https://mapapi.qq.com/web/lbs/visualizationApi/demo/data/dot.js', 'dot').then(_ => {
            setMapCtx(ref)
        })
    }
    useSetStateCb(() => {
        initInfoWindow()
        initDots()
    }, [ map ])
    const initDots = _ => {
        dotData.forEach(function (item,index) {
            if(index < dotData.length/4){
                item.styleId = 'greenStyleColor';
            }else if(index < (dotData.length*2/4)){
                item.styleId = 'yellowStyleColor';
            }else if(index < (dotData.length*3/4)){
                item.styleId = 'blueStyleColor';
            }else{
                item.styleId = 'redStyleColor';
            }
            
        });
        dot.current = new TMap.visualization.Dot({
            styles: {
                'redStyleColor': {
                    type: "circle", //圆形样式
                    fillColor: "#ce4c45", //填充颜色
                    strokeColor: "#FFFFFF",//边线颜色
                    strokeWidth: 0, //边线宽度
                    radius: 4 //原型半径
                },
                'blueStyleColor': {
                    type: "circle", //圆形样式
                    fillColor: "#387cea", //填充颜色
                    strokeColor: "#FFFFFF",//边线颜色
                    strokeWidth: 0, //边线宽度
                    radius: 4 //原型半径
                },
                'yellowStyleColor': {
                    type: "circle", //圆形样式
                    fillColor: "#b58823", //填充颜色
                    strokeColor: "#FFFFFF",//边线颜色
                    strokeWidth: 0, //边线宽度
                    radius: 4 //原型半径
                },
                'greenStyleColor': {
                    type: "circle", //圆形样式
                    fillColor: "#10a162", //填充颜色
                    strokeColor: "#FFFFFF",//边线颜色
                    strokeWidth: 0, //边线宽度
                    radius: 4 //原型半径
                }
            },
            selectOptions: { //拾取配置
                action: 'click', //拾取动作
                style: { //选中样式
                    fillColor: "#1CD5FF",
                },
            enableHighlight: false //是否使用高亮效果
            },
            faceTo: "screen",//散点固定的朝向
        })
        .addTo(map)
        .setData(window.dotData);//设置数据
        dot.current.on('click', (res) => {
            if (!res.detail.dot)return
            const { latLng } = res
            console.log(latLng);
            api.geocoder({
                location: `${latLng.lat},${latLng.lng}`
            }).then(res => {
                const content = `<div>
                    <p>地址: ${get(res, 'result.address')}</p>
                </div>`
                infoWindow.current.open();
                infoWindow.current.setPosition(latLng);  // 设置信息窗口的坐标
                infoWindow.current.setContent(content);   
            })
        })
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
    return <>
        <MyMap mapConfig={mapProps} getCtx={getRef} />
        <div className="footer">
            点击散点获取对应的位置
        </div>
    </>
}