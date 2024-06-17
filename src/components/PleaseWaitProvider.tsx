'use client'

import { FC, createContext, useMemo, useState } from "react"

interface Props {
    children?: React.ReactNode
}

export const PleaseWaitContext = createContext({actions: {pleaseWait: () => {}, doneWaiting: () => {}, clearAllWaits: () => {}}, state: {waitCount: 0}})

export const PleaseWaitProvider: FC<Props> = ({ children }) => {
    const [waitCount, setWaitCount] = useState(0)
   
    const memorized = useMemo(() => ({
        pleaseWait: () => {
            setWaitCount(previousWaitCount => previousWaitCount + 1)
        }, 
        doneWaiting: () => {
            setWaitCount(previousWaitCount => Math.min(previousWaitCount - 1, 0))
        }, 
        clearAllWaits: () => {
            setWaitCount(0)
        }
    }), [])

    return (
        <PleaseWaitContext.Provider value={{actions: memorized, state: {waitCount}}}>
            {children}
        </PleaseWaitContext.Provider>
    )
}