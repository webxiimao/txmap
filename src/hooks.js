import { useEffect } from 'react'
import util from '@/utils/util'

export function useSetStateCb(fn, [data]){
    useEffect(() => {
        if (!util.isEmpty(data)) {
            fn()
        }
    }, [data])
}