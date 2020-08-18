import React, { useState, useEffect, useRef } from 'react'
import MyMap from '@/components/MyMap'
import { setMapCenter } from '@/utils/mapUtil'
import { DEFAULT_POS } from '@/config/constant'
import { useSetStateCb } from '@/hooks'
import { InputGroup, FormControl, Button, Card, Form } from 'react-bootstrap'
import api from '@/request/api'
import './GraphicsEditing.scss'

import Modal from '@/components/Modal'

const defaultPos = {
    x: 40.04019000341765,
    y: 116.27446815226199
}

function SelectedGeometryInfo(props){
    const { info } = props
    if(!info) return null
    return <>
        { props.info.map(item => {
            if (item.paths) {
                return <div style={{ 'word-wrap': 'break-word' }}>
                    图形: 多边形
                    <br/>
                    路径: { item.paths.map(v => `${v.lat},${v.lng}`).join('|') }
                </div>
            } else if(item.center){
                return <div style={{ 'word-wrap': 'break-word' }}>
                    图形: 原型
                    <br/>
                    原心坐标: {`${item.center.lat},${item.center.lng}`}
                    <br/>
                    半径：{item.radius}
                </div>
            }
        }) }
    </>
}

export default () => {
    const [ map, setMapCtx ] = useState()
    const [ toolType, setToolType ] = useState(false)
    const [ modalShow, setModalShow ] = useState(false)
    const [ selectInfo, setSelectInfo ] = useState()
    const [ activeType, setActiveType ] = useState()
    const editor = useRef({})
    const marker = useRef({})
    const getRef = (ref) => {
        setMapCtx(ref)
    }
    useSetStateCb(() => {
        initEditor()
        initMarker()
    }, [ map ])
    function initMarker(){
        marker.current = new TMap.MultiMarker({
            id: 'marker',
            map,
            geometries: []
        });
    }
    function initEditor(){
        editor.current = new TMap.tools.GeometryEditor({
            map, // 编辑器绑定的地图对象
            overlayList: [ // 可编辑图层
                {
                    overlay: new TMap.MultiPolyline({
                        map
                    }),
                    id: 'polyline'
                },
                {
                    overlay: new TMap.MultiPolygon({
                        map
                    }),
                    id: 'polygon',
                    selectedStyleId: 'highlight'
                },
                {
                    overlay: new TMap.MultiCircle({
                        map
                    }),
                    id: 'circle',
                    selectedStyleId: 'highlight'
                }
            ],
            actionMode: TMap.tools.constants.EDITOR_ACTION.DRAW, // 编辑器的工作模式
            activeOverlayId: 'polygon', // 激活图层
            selectable: true, // 开启点选功能
            snappable: true // 开启吸附
        });
        let evtList = ['delete', 'adjust', 'split', 'union', 'draw'];
        evtList.forEach(evtName => {
            editor.current.on(evtName + '_complete', evtResult => {
                console.log(evtName, evtResult);
            });
        });
        // 监听拆分失败事件，获取拆分失败原因
        editor.current.on('split_fail', (res) => { 
            alert(res.message);
        });
        // 监听合并失败事件，获取合并失败原因
        editor.current.on('union_fail', (res) => { 
            alert(res.message);
        });
    }
    const deleteAction = (e) => {
        editor.current.delete(e)
    }
    const splitAction = e => {
        editor.current.split(e)
    }
    const unionAction = e => {
        editor.current.union(e)
    }
    const changeToolType = e => {
        const value = !toolType
        setActiveType()
        setToolType(value)
        const type = value ? TMap.tools.constants.EDITOR_ACTION.INTERACT : TMap.tools.constants.EDITOR_ACTION.DRAW
        editor.current.setActionMode(type)
    }
    const setActiveOverlay = type => {
        setActiveType(type)
        editor.current.setActiveOverlay(type)
    }
    // 获取选中的详情
    const getSelectedInfo = _ => {
        const list = editor.current.getSelectedList()
        console.log(JSON.stringify(list, null, 2));
        setSelectInfo(list)
        setModalShow(true)
    }
    const [ searchKey, setSearchKey ] = useState()
    const search = () => {
        const list = editor.current.getSelectedList()
        if (list && list.length == 1) {
            const item = list[0]
            if (item.paths){
                alert('仅支持在圆形区域中搜索')
            }
            api.search({
                keyword: searchKey,
                boundary: `nearby(${item.center.lat},${item.center.lng},${item.radius},0)`
            }).then(res => {
                handleMarker(res.data)
            })
        } else {
            alert('请选中单个图形')
        }
    }
    const handleMarker = (list) => {
        let markerArr = []
        marker.current.setGeometries([]);
        let newBounds = new TMap.LatLngBounds();
        list.forEach( (item, index) => {
            let position = new TMap.LatLng(item.location.lat, item.location.lng);
            markerArr.push({
              position: position,
            //   properties: {
            //     title: item.title,
            //     address: item.address,
            //     tel: item.tel!==' ' ? item.tel : '暂无',
            //     category: item.category
            //   }
            });
            // 寻找搜索结果的边界
            newBounds.extend(position);
            // 更新marker层，显示标记
          });
          console.log(markerArr);
          marker.current.setGeometries(markerArr);
    }
    return <>
        <div style={{ textAlign: 'left', marginLeft: '20px', position:'relative', zIndex: '10' }}>
            <Button  variant={toolType ? 'primary': 'secondary'} onClick={changeToolType}>{ toolType ? '取消编辑模式' : '编辑模式' }</Button>
            <br/>
            <br/>
            { toolType ? <Button onClick={getSelectedInfo} variant="secondary">获取选中图形信息</Button>: null }
        </div>
        <div id="toolControl">
            { !toolType ? <>
                <div className={'toolItem ' + (activeType === 'polyline' ? 'active' : '')} id="polyline" onClick={() => setActiveOverlay('polyline')} title="折线"></div>
                <div className={'toolItem ' + (activeType === 'polygon' ? 'active' : '')} id="polygon" onClick={() => setActiveOverlay('polygon')} title="多边形"></div>
                <div className={'toolItem ' + (activeType === 'circle' ? 'active' : '')} id="circle" onClick={() => setActiveOverlay('circle')} title="圆形"></div>
            </> : <>
                <div className="toolItem" id="delete" onClick={deleteAction} title="删除"></div>
                <div className="toolItem" id="split" onClick={splitAction} title="拆分"></div>
                <div className="toolItem" id="union" onClick={unionAction} title="合并"></div>
            </> }
        </div>
        <MyMap pos={defaultPos} getCtx={getRef} />
        <div className="footer">
            { toolType? <div>单选：鼠标左键点击图形，选中图形获取位置信息<br/>
                多选：按下ctrl键后点击多个图形<br/>
                删除：选中图形后按下delete键或点击删除按钮可删除图形<br/>
                编辑：选中图形后出现编辑点，拖动编辑点可移动顶点位置，双击实心编辑点可删除顶点<br/>
                拆分：选中单个多边形后可绘制拆分线，拆分线绘制完成后自动进行拆分<br/>
                合并：选中多个相邻多边形后可进行合并，飞地形式的多边形不支持合并<br/></div>
            : <div>
            绘制：鼠标左键点击及移动即可绘制图形<br/>
            结束绘制：鼠标左键双击即可结束绘制折线、多边形、多边形会自动闭合；圆形单击即可结束<br/>
            中断：绘制过程中按下esc键可中断该过程<br/>
            </div> }
        </div>
        <Modal show={modalShow} title={'图形信息'} onHide={() => setModalShow(false)}>
            <SelectedGeometryInfo info={selectInfo} />
        </Modal>
    </>
}
