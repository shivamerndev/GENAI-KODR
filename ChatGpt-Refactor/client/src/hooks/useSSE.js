import React from 'react'
import eventSource from '../services/sse.service'

const useSSE = () => {

    const handleGetSSE = () => {
        eventSource()
    }

    return {handleGetSSE}
}

export default useSSE;