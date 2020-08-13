import React, { useState, useEffect } from 'react'
import { initMap } from '@/utils/mapUtil'
import { geocoder } from '@/request/api'

export default function MyMap({pos, mapConfig, getCtx }){
    
    useEffect(() => {
        geocoder()
        const defaultPos = {
            x: 22.529865,
            y: 113.954422
        }
        const mapCtx = initMap(pos || defaultPos)
        if (getCtx) {
            getCtx(mapCtx)
        }
    }, [])
    const style = {
        width: '100%',
        height: '800px',
        position: 'absolute'
    }
    return <div id="container" props={mapConfig} style={style}></div>
}