'use client'

import { FC, createContext, useMemo, useState } from "react"

interface Props {
    children?: React.ReactNode
}

const waitWithoutIndicator = async <T,>(operation: () => Promise<T>): Promise<T> => operation()

export const PleaseWaitContext = createContext({
    actions: {
        waitFor: waitWithoutIndicator,
    },
    state: {waitCount: 0},
})

export const PleaseWaitProvider: FC<Props> = ({ children }) => {
    const [waitCount, setWaitCount] = useState(0)
   
    const memorized = useMemo(() => {
        const waitFor = async <T,>(operation: () => Promise<T>): Promise<T> => {
            setWaitCount(previousWaitCount => previousWaitCount + 1)
            try {
                return await operation()
            }
            finally {
                setWaitCount(previousWaitCount => Math.max(previousWaitCount - 1, 0))
            }
        }

        return { waitFor }
    }, [])

    return (
        <PleaseWaitContext.Provider value={{actions: memorized, state: {waitCount}}}>
            {children}
        </PleaseWaitContext.Provider>
    )
}
