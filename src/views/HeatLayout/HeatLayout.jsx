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
    const [map, setMap] = useState()
    const mapProps = {
        zoom:12,//设置地图缩放级别
        mapStyleId: "style1" //个性化样式
    }
    const pos = {
        x: 39.909897147274364,
        y: 116.39756310116866
    }
    const getRef = (ref) => {
        util.useLib('https://mapapi.qq.com/web/lbs/visualizationApi/demo/data/heat.js', 'trail').then(_ => {
            setMap(ref)
        })
    }
    useSetStateCb(() => {
        //初始化轨迹图并添加至map图层
        new TMap.visualization.Heat({
            max: 180, // 热力最强阈值
            min: 0, // 热力最弱阈值
            height: 40, // 峰值高度
            radius: 30 // 最大辐射半径
        })
            .addTo(map)
            .setData(heatData);//设置数据
    }, [map])
    return <>
        <MyMap mapConfig={mapProps} pos={pos} getCtx={getRef} />
    </>
}