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
        x: 39.984104,
        y: 116.307503
    }
    const getRef = (ref) => {
        util.useLib('https://mapapi.qq.com/web/lbs/visualizationApi/demo/data/trail.js', 'trail').then(_ => {
            setMap(ref)
        })
    }
    useSetStateCb(() => {
        //初始化轨迹图并添加至map图层
        new TMap.visualization.Trail({
            pickStyle: function (item) { //轨迹图样式映射函数
                return {
                    width: 2
                }
            },
            startTime: 0,//动画循环周期的起始时间戳
            showDuration: 120,//动画中轨迹点高亮的持续时间
            playRate: 30 // 动画播放倍速

        })
            .addTo(map)
            .setData(trailData);//设置数据
    }, [map])
    return <>
        <MyMap mapConfig={mapProps} pos={pos} getCtx={getRef} />
    </>
}