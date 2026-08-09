'use client'

import { FC, ReactNode, createContext, useCallback, useContext, useMemo, useState } from 'react'
import YesNoDialog from './YesNoDialog'

interface YesNoDialogOptions {
    question: string
    onYes: () => void
    onNo?: () => void
}

interface YesNoDialogContextValue {
    showYesNoDialog: (options: YesNoDialogOptions) => void
}

interface YesNoDialogProviderProps {
    children: ReactNode
}

const YesNoDialogContext = createContext<YesNoDialogContextValue | undefined>(undefined)

export const YesNoDialogProvider: FC<YesNoDialogProviderProps> = ({children}) => {
    const [dialog, setDialog] = useState<YesNoDialogOptions | null>(null)

    const showYesNoDialog = useCallback((options: YesNoDialogOptions): void => {
        setDialog(options)
    }, [])

    const handleNo = useCallback((): void => {
        const onNo = dialog?.onNo
        setDialog(null)
        onNo?.()
    }, [dialog])

    const handleYes = useCallback((): void => {
        const onYes = dialog?.onYes
        setDialog(null)
        onYes?.()
    }, [dialog])

    const contextValue = useMemo(() => ({showYesNoDialog}), [showYesNoDialog])

    return (
        <YesNoDialogContext.Provider value={contextValue}>
            {children}
            <YesNoDialog
                open={dialog !== null}
                question={dialog?.question ?? ''}
                onNo={handleNo}
                onYes={handleYes}
            />
        </YesNoDialogContext.Provider>
    )
}

export const useYesNoDialog = (): YesNoDialogContextValue => {
    const context = useContext(YesNoDialogContext)

    if (context === undefined) {
        throw new Error('useYesNoDialog must be used within a YesNoDialogProvider.')
    }

    return context
}
