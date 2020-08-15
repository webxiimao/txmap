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

export default () => {
    // var center = new TMap.LatLng(37.80787, 112.269029);
    const pos = {
        x: 37.80787,
        y: 112.269029
    }
    const mapProps = {
        zoom: 5,//设置地图缩放级别
        pitch: 30,
        mapStyleId: "style1" //个性化样式
    }
    const [ map, setMapCtx ] = useState()
    const getRef = ref => {
        util.useLib('https://mapapi.qq.com/web/lbs/visualizationApi/demo/data/arc.js', 'arc').then(_ => {
            setMapCtx(ref)
        })
    }
    useSetStateCb(() => {
        initArcLayout()
    }, [ map ])
    const initArcLayout = () => {
        var data = arcData;
        new TMap.visualization.Arc({
            mode: 'vertical', // 弧线平面与地平面垂直
            selectOptions: { //拾取配置
                action: 'click', //拾取动作
                style: { //选中样式
                        width: 6,
                        color: "#1CD5FF",
                        animateColor: "#A8EFFF"
                },
            enableHighlight: false //是否使用高亮效果
            }
        })
        .addTo(map)
        .setData(data);//设置数据
    }
    return <>
    <MyMap mapConfig={mapProps} pos={pos} getCtx={getRef} />
</>
}