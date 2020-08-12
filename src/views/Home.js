import React, { useState, useEffect } from 'react'
import { initMap } from '@/utils/mapUtil'

export default () => {
    useEffect(() => {
        initMap(39.984104, 116.307503)
    }, [])
    const style = {
        width: '1400px',
        height: '600px'
    }
    return <div id="container" style={style}></div>
}