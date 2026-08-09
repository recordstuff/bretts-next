'use client'

import { AppSnackbarSeverity, AppSnackbarState } from '@/models/AppSnackbarState'
import { FC, ReactNode, createContext, useCallback, useContext, useMemo, useState } from 'react'
import AppSnackbar from './AppSnackbar'

interface AppSnackbarContextValue {
    showSnackbar: (message: string, severity: AppSnackbarSeverity) => void
    closeSnackbar: () => void
}

interface AppSnackbarProviderProps {
    children: ReactNode
}

const AppSnackbarContext = createContext<AppSnackbarContextValue | undefined>(undefined)

export const AppSnackbarProvider: FC<AppSnackbarProviderProps> = ({children}) => {
    const [snackbar, setSnackbar] = useState<AppSnackbarState>({
        message: null,
        severity: AppSnackbarSeverity.Info,
    })

    const showSnackbar = useCallback((message: string, severity: AppSnackbarSeverity): void => {
        setSnackbar({message, severity})
    }, [])

    const closeSnackbar = useCallback((): void => {
        setSnackbar(currentSnackbar => ({...currentSnackbar, message: null}))
    }, [])

    const contextValue = useMemo(() => ({showSnackbar, closeSnackbar}), [showSnackbar, closeSnackbar])

    return (
        <AppSnackbarContext.Provider value={contextValue}>
            {children}
            <AppSnackbar
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={closeSnackbar}
            />
        </AppSnackbarContext.Provider>
    )
}

export const useAppSnackbar = (): AppSnackbarContextValue => {
    const context = useContext(AppSnackbarContext)

    if (context === undefined) {
        throw new Error('useAppSnackbar must be used within an AppSnackbarProvider.')
    }

    return context
}
