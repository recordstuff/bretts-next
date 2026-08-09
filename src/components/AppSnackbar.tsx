'use client'

import { Alert, Fade, Snackbar } from '@mui/material'
import { FC } from 'react'
import { AppSnackbarSeverity } from '@/models/AppSnackbarState'

interface AppSnackbarProps {
    message: string | null
    severity: AppSnackbarSeverity
    onClose: () => void
}

const AppSnackbar: FC<AppSnackbarProps> = ({ message, severity, onClose }) => (
    <Snackbar
        open={message !== null}
        autoHideDuration={4000}
        TransitionComponent={Fade}
        onClose={onClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
        <Alert
            severity={severity}
            variant="filled"
            onClose={onClose}
            sx={{ width: '100%' }}
        >
            {message}
        </Alert>
    </Snackbar>
)

export default AppSnackbar
