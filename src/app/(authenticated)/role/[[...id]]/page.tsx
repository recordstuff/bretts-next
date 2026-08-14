'use client'

import { AxiosError } from 'axios'
import { Button, Stack, SxProps, TextField, Theme } from '@mui/material'
import { AppSnackbarSeverity } from '@/models/AppSnackbarState'
import { HTTP_STATUS_CODES } from '@/clients/HttpClient'
import { LeftDrawerContext } from '@/components/LeftDrawerProvider'
import { NameGuidPair } from '@/models/NameGuidPair'
import { PleaseWaitContext } from '@/components/PleaseWaitProvider'
import { RoleNew } from '@/models/RoleNew'
import YesNoDialog from '@/components/YesNoDialog'
import { roleClient } from '@/clients/RoleClient'
import { storeSuccessMessage, takeSuccessMessage } from '@/utils/successMessageStorage'
import { useAppSnackbar } from '@/components/AppSnackbarProvider'
import { useParams, useRouter } from 'next/navigation'
import { ChangeEvent, FC, useCallback, useContext, useEffect, useState } from 'react'

const roleFormStyles: SxProps<Theme> = {
    maxWidth: '75rem',
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

const emptyRole = (): NameGuidPair => ({ Guid: '', Name: '' })

const Role: FC = () => {
    const [role, setRole] = useState<NameGuidPair>(emptyRole())
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const { showSnackbar } = useAppSnackbar()
    const { actions: { clearAllWaits, pleaseWait, doneWaiting } } = useContext(PleaseWaitContext)
    const { addBreadcrumb, setPageTitle } = useContext(LeftDrawerContext)
    const { id } = useParams<{ id: string }>()
    const router = useRouter()
    const isEdit = id !== undefined

    const getRole = useCallback(async (): Promise<void> => {
        if (id === undefined) {
            return
        }

        pleaseWait()
        setRole(await roleClient.getRole(id))
        doneWaiting()
    }, [id, pleaseWait, doneWaiting])

    useEffect(() => {
        let pageTitle = 'Add Role'
        let url = '/role'

        if (isEdit) {
            pageTitle = 'Edit Role'
            url = `${url}/${id}`
        }

        setPageTitle(pageTitle)
        addBreadcrumb({ title: pageTitle, url })
        getRole()
    }, [id, isEdit, setPageTitle, addBreadcrumb, getRole])

    useEffect(() => {
        if (!isEdit) {
            return
        }

        const storedSuccessMessage = takeSuccessMessage()

        if (storedSuccessMessage !== null) {
            showSnackbar(storedSuccessMessage, AppSnackbarSeverity.Success)
        }
    }, [isEdit, showSnackbar])

    const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
        setRole({ ...role, Name: event.target.value })
    }

    const upsert = async (): Promise<void> => {
        const roleName = role.Name.trim()

        if (roleName.length === 0) {
            showSnackbar('Complete the required role fields.', AppSnackbarSeverity.Warning)
            return
        }

        pleaseWait()

        try {
            if (!isEdit) {
                const newRole: RoleNew = { Name: roleName }
                const roleDetail = await roleClient.insertRole(newRole)

                storeSuccessMessage('This role was created.')
                router.push(`/role/${roleDetail.Guid}`)
            }
            else {
                const updatedRole = { ...role, Name: roleName }

                setRole(await roleClient.updateRole(updatedRole))
                showSnackbar('This role was saved.', AppSnackbarSeverity.Success)
            }

            doneWaiting()
        }
        catch (exception: unknown) {
            clearAllWaits()

            if (exception instanceof AxiosError
             && exception.response?.status === HTTP_STATUS_CODES.CONFLICT) {
                showSnackbar('A role with this name already exists.', AppSnackbarSeverity.Warning)
                return
            }

            throw exception
        }
    }

    const handleCancel = (): void => {
        if (!isEdit) {
            router.back()
            return
        }

        getRole()
    }

    const handleDelete = async (): Promise<void> => {
        if (id === undefined) {
            return
        }

        setDeleteDialogOpen(false)
        pleaseWait()

        try {
            await roleClient.deleteRole(id)
            doneWaiting()
            storeSuccessMessage('This role was deleted.')
            router.push('/roles')
        }
        catch (exception: unknown) {
            clearAllWaits()

            if (exception instanceof AxiosError
             && exception.response?.status === HTTP_STATUS_CODES.CONFLICT) {
                showSnackbar('This role is assigned to one or more users and cannot be deleted.', AppSnackbarSeverity.Warning)
                return
            }

            throw exception
        }
    }

    let saveButtonText = 'Add'
    let cancelButtonText = 'Cancel'

    if (isEdit) {
        saveButtonText = 'Save'
        cancelButtonText = 'Reset Form'
    }

    return (
        <Stack margin={2} spacing={4} sx={roleFormStyles}>
            {isEdit && <TextField fullWidth label="Id" value={role.Guid} disabled />}
            <TextField fullWidth label="Name" name="Name" onChange={handleChange} value={role.Name} />
            <Stack direction="row" spacing={2}>
                <Button onClick={upsert} color="primary" variant="contained">{saveButtonText}</Button>
                <Button onClick={handleCancel} sx={resetButtonStyles}>{cancelButtonText}</Button>
                {isEdit && <Button variant="contained" color="error" onClick={() => setDeleteDialogOpen(true)}>Delete</Button>}
            </Stack>
            <YesNoDialog
                open={deleteDialogOpen}
                question="Are you sure you want to delete this role?"
                onNo={() => setDeleteDialogOpen(false)}
                onYes={handleDelete}
            />
        </Stack>
    )
}

export default Role
