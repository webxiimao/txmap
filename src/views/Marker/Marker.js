import React, { useState, useEffect, useRef } from 'react'
import MyMap from '@/components/MyMap'
import { setMapCenter } from '@/utils/mapUtil'
import { DEFAULT_POS } from '@/config/constant'
import { useSetStateCb } from '@/hooks'
import { InputGroup, FormControl, Button, Card, Form } from 'react-bootstrap'
import api from '@/request/api'
import './Marker.scss'

export default () => {
    const marker = useRef(null)
    const infoWindow = useRef(null)
    const circle = useRef(null)
    const isAddMarker = useRef(false)
    const [ radius, setRadius ] = useState(500)
    const [ map, setMapCtx ] = useState()
    const [ searchKey, setSearchKey ] = useState()

    const getRef = (ref) => {
        setMapCtx(ref)
    }
    useSetStateCb(() => {
        init()
    }, [ map ])
    function init(){
        initMapEvent()
        initMarker()
        initCircle()
        initInfoWindow()
    }
    function initMapEvent(){
        map.on('click', evt => {
            if (isAddMarker.current) {
                const latLng = evt.latLng
                api.geocoder({
                    location: `${latLng.lat},${latLng.lng}`
                }).then(res => {
                    marker.current.add({
                        position: latLng,
                        properties: {
                            content: `地址：${res.result.address}`
                        }
                    })
                })
            }
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
    function initCircle(){
        circle.current = new TMap.MultiCircle({
            id: 'circle',
            map,
            geometries: [{
                center: setMapCenter(DEFAULT_POS),
                radius  //设置圆的半径
            }]
        });
    }
    function initMarker() {
        marker.current = new TMap.MultiMarker({
            id: 'marker',
            map,
            geometries: []
        });
        marker.current.on('click', evt => {
            if (!evt.geometry.properties) return
            let content = !evt.geometry.properties.content ? `
              <div>
                <p>名称: ${evt.geometry.properties.title}</p>
                <p>地址: ${evt.geometry.properties.address}</p>
                <p>电话: ${evt.geometry.properties.tel}</p>
                <p>类型：${evt.geometry.properties.category}</p>
              </div>
            `: `<div>
                <p>${evt.geometry.properties.content}</p>
            </div>`
            infoWindow.current.open();
            infoWindow.current.setPosition(evt.geometry.position);  // 设置信息窗口的坐标
            infoWindow.current.setContent(content);   // 设置信息窗口的内容
        });
    }
    function handleMarker(list) {
        let markerArr = []
        let newBounds = new TMap.LatLngBounds();
        list.forEach( (item, index) => {
            let position = new TMap.LatLng(item.location.lat, item.location.lng);
            markerArr.push({
              position: position,
              properties: {
                title: item.title,
                address: item.address,
                tel: item.tel!==' ' ? item.tel : '暂无',
                category: item.category
              }
            });
            // 寻找搜索结果的边界
            newBounds.extend(position);
          });
          // 更新marker层，显示标记
          marker.current.setGeometries(markerArr);
    }
    function search(){
        api.search({
            keyword: searchKey,
            boundary: `nearby(${DEFAULT_POS.x},${DEFAULT_POS.y},${radius},0)`
        }).then(res => {
            handleMarker(res.data)
        })
    }
    function clearMarker(){
        marker.current.setGeometries([])
    }
    const [ showAddMarker, setShowAddMarker ] = useState(false)
    function addMarker(){
        isAddMarker.current = !isAddMarker.current
        setShowAddMarker(isAddMarker.current)
    }
    return <>
        <div className="content">
            <InputGroup className="mb-3 input">
                <FormControl
                    onChange={e => setSearchKey(e.target.value)}
                    placeholder="请输入位置"
                    aria-label="Recipient's username"
                    aria-describedby="basic-addon2"
                    onKeyUp={e => {
                        if(e.keyCode === 13){
                            search()
                        }
                    }}
                />
                <InputGroup.Append>
                <Button onClick={search} variant="primary">搜索</Button>
                </InputGroup.Append>
            </InputGroup>
            <Button onClick={clearMarker} variant="secondary">清空marker</Button>
            <br/>
            <br/>
            <Button onClick={addMarker} variant={showAddMarker ? 'primary': 'secondary'}>{showAddMarker ? '取消手动添加marker': '手动添加marker'}</Button>
        </div>
        <MyMap getCtx={getRef} />
        <div className="footer">
            在输入框内输入搜索地址，点击搜索，在圆圈范围内，展示和搜索地址相关的位置标记<br/>
            点击标记，获取详细地址
        </div>
    </>
}