'use client'

import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import {
    Button,
    Dialog,
    DialogActions,
    DialogTitle,
    Stack,
} from '@mui/material'
import { FC } from 'react'

interface YesNoDialogProps {
    open: boolean
    question: string
    onNo: () => void
    onYes: () => void
}

const YesNoDialog: FC<YesNoDialogProps> = ({ open, question, onNo, onYes }) => (
    <Dialog
        open={open}
        onClose={onNo}
        aria-labelledby="yes-no-dialog-question"
    >
        <DialogTitle id="yes-no-dialog-question" sx={{ color: 'info.light' }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
                <HelpOutlineIcon color="info" />
                <span>{question}</span>
            </Stack>
        </DialogTitle>
        <DialogActions>
            <Button color="error" onClick={onYes}>Yes</Button>
            <Button autoFocus color="info" variant="contained" onClick={onNo}>No</Button>
        </DialogActions>
    </Dialog>
)

export default YesNoDialog
