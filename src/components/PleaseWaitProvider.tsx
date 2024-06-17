'use client'

import { FC, createContext, useState } from "react"

interface Props {
    children?: React.ReactNode
}

export const PleaseWaitContext = createContext({pleaseWait: () => {}, doneWaiting: () => {}, clearAllWaits: () => {}, waitCount: 0})

export const PleaseWaitProvider: FC<Props> = ({ children }) => {
    const pleaseWait = () => {
        setWaitCount(previousWaitCount => previousWaitCount + 1)
    }  
    
    const doneWaiting = () => {
        setWaitCount(previousWaitCount => Math.min(previousWaitCount - 1, 0))
    }  
    
    const clearAllWaits = () => {
        setWaitCount(0)
    }  
    
    const [waitCount, setWaitCount] = useState(0)
   
    return (
        <PleaseWaitContext.Provider value={{pleaseWait, doneWaiting, clearAllWaits, waitCount}}>
            {children}
        </PleaseWaitContext.Provider>
    )
}