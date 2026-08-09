'use client'

import { AppSnackbarSeverity, AppSnackbarState } from '@/models/AppSnackbarState'
import { useCallback, useState } from 'react'

const initialState: AppSnackbarState = {
    message: null,
    severity: AppSnackbarSeverity.Info,
}

export const useAppSnackbar = () => {
    const [snackbar, setSnackbar] = useState<AppSnackbarState>(initialState)

    const showSnackbar = useCallback((message: string, severity: AppSnackbarSeverity): void => {
        setSnackbar({message, severity})
    }, [])

    const closeSnackbar = useCallback((): void => {
        setSnackbar(currentSnackbar => ({...currentSnackbar, message: null}))
    }, [])

    return {snackbar, showSnackbar, closeSnackbar}
}
