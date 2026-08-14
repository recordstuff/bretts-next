'use client'

import { Box, Button, SxProps, Theme } from '@mui/material'
import { AppSnackbarSeverity } from '@/models/AppSnackbarState'
import { FC, ReactNode, useState } from 'react'
import YesNoDialog from '@/components/YesNoDialog'
import { useAppSnackbar } from '@/components/AppSnackbarProvider'
import styles from './EntityForm.module.css'

const formControlStyles: SxProps<Theme> = {
    '& .MuiInputLabel-root': {
        color: 'text.primary',
        fontWeight: 500,
    },
    '& .MuiOutlinedInput-notchedOutline': {
        borderColor: 'primary.light',
    },
    '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: 'primary.main',
    },
    '& .MuiInputBase-input.Mui-disabled': {
        WebkitTextFillColor: 'text.secondary',
        opacity: 1,
    },
}

const resetButtonStyles: SxProps<Theme> = {
    color: 'primary.main',
    '&:hover': {
        backgroundColor: 'secondary.light',
        color: 'primary.dark',
    },
    '&:active': {
        backgroundColor: 'secondary.main',
        color: 'primary.dark',
    },
}

interface EntityFormProps {
    children: ReactNode
    entityName: string
    isEdit: boolean
    onCancel: () => void | Promise<void>
    onDelete: () => void | Promise<void>
    onSave: () => void | Promise<void>
}

const EntityForm: FC<EntityFormProps> = ({
    children,
    entityName,
    isEdit,
    onCancel,
    onDelete,
    onSave,
}) => {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const { showSnackbar } = useAppSnackbar()
    let saveButtonText = 'Add'
    let cancelButtonText = 'Cancel'

    if (isEdit) {
        saveButtonText = 'Save'
        cancelButtonText = 'Reset Form'
    }

    const handleDelete = async (): Promise<void> => {
        setDeleteDialogOpen(false)
        await onDelete()
    }

    const handleCancel = async (): Promise<void> => {
        await onCancel()

        if (isEdit) {
            showSnackbar('The form was reset.', AppSnackbarSeverity.Info)
        }
    }

    return (
        <Box className={styles.form} sx={formControlStyles}>
            {children}
            <div className={styles.actions}>
                <Button onClick={onSave} color="primary" variant="contained">{saveButtonText}</Button>
                <Button onClick={handleCancel} sx={resetButtonStyles}>{cancelButtonText}</Button>
                {isEdit && (
                    <Button variant="contained" color="error" onClick={() => setDeleteDialogOpen(true)}>Delete</Button>
                )}
            </div>
            <YesNoDialog
                open={deleteDialogOpen}
                question={`Are you sure you want to delete this ${entityName}?`}
                onNo={() => setDeleteDialogOpen(false)}
                onYes={handleDelete}
            />
        </Box>
    )
}

export default EntityForm
