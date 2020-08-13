import React, { useState, useEffect } from 'react'
import MyMap from '@/components/MyMap'

export default () => {
    const [ mapCtx, setMapCtx ] = useState()
    const getRef = (ref) => {
        setMapCtx(ref)
    }
    return <MyMap getCtx={getRef}/>
}