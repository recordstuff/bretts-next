import { AppSnackbarSeverity } from '@/models/AppSnackbarState'
import { takeSuccessMessage } from '@/utils/successMessageStorage'
import { useAppSnackbar } from '@/components/AppSnackbarProvider'
import { useEffect } from 'react'

export const useStoredSuccessMessage = (shouldDisplay = true): void => {
    const { showSnackbar } = useAppSnackbar()

    useEffect(() => {
        if (!shouldDisplay) {
            return
        }

        const storedSuccessMessage = takeSuccessMessage()

        if (storedSuccessMessage !== null) {
            showSnackbar(storedSuccessMessage, AppSnackbarSeverity.Success)
        }
    }, [shouldDisplay, showSnackbar])
}
