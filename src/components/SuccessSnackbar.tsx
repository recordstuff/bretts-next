'use client'

import { Alert, Fade, Snackbar } from '@mui/material'
import { FC } from 'react'

interface SuccessSnackbarProps {
    message: string | null
    onClose: () => void
}

const SuccessSnackbar: FC<SuccessSnackbarProps> = ({ message, onClose }) => (
    <Snackbar
        open={message !== null}
        autoHideDuration={4000}
        TransitionComponent={Fade}
        onClose={onClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
        <Alert
            severity="success"
            variant="filled"
            onClose={onClose}
            sx={{ width: '100%' }}
        >
            {message}
        </Alert>
    </Snackbar>
)

export default SuccessSnackbar
