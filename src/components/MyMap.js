import React, { useState, useEffect } from 'react'
import { initMap } from '@/utils/mapUtil'
import { DEFAULT_POS } from '@/config/constant'



export default function MyMap({pos, mapConfig, getCtx }){
    useEffect(() => {
        const mapCtx = initMap(pos || DEFAULT_POS)
        if (getCtx) {
            getCtx(mapCtx)
        }
    }, [])
    const style = {
        width: '100%',
        height: '100%',
        // paddingTop: '30px',
        position: 'absolute',
        top: 0,
        zIndex: '-1'
    }
    return <div id="container" props={mapConfig} style={style}></div>
}