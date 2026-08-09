'use client'

import { HTTP_STATUS_CODES } from '@/clients/HttpClient'
import { roleClient } from '@/clients/RoleClient'
import { useAppSnackbar } from '@/components/AppSnackbarProvider'
import { LeftDrawerContext } from '@/components/LeftDrawerProvider'
import { PleaseWaitContext } from '@/components/PleaseWaitProvider'
import { useYesNoDialog } from '@/components/YesNoDialogProvider'
import { AppSnackbarSeverity } from '@/models/AppSnackbarState'
import { emptyRoleDetail, RoleDetail } from '@/models/RoleDetail'
import { RoleNew } from '@/models/RoleNew'
import { storeSuccessMessage, takeSuccessMessage } from '@/utils/successMessageStorage'
import { Button, Stack, TextField } from '@mui/material'
import { AxiosError } from 'axios'
import { useParams, useRouter } from 'next/navigation'
import { FC, useCallback, useContext, useEffect, useState } from 'react'

const Role: FC = () => {
    const [role, setRole] = useState<RoleDetail>(emptyRoleDetail())
    const [showValidation, setShowValidation] = useState(false)
    const {showSnackbar} = useAppSnackbar()
    const {showYesNoDialog} = useYesNoDialog()
    const {actions: {clearAllWaits, pleaseWait, doneWaiting}} = useContext(PleaseWaitContext)
    const {addBreadcrumb, setPageTitle} = useContext(LeftDrawerContext)
    const {id} = useParams<{id: string}>()
    const router = useRouter()

    const loadRole = useCallback(async (): Promise<void> => {
        if (id === undefined) {
            setRole(emptyRoleDetail())
            setShowValidation(false)
            return
        }
        pleaseWait()
        setRole(await roleClient.getRole(id))
        setShowValidation(false)
        doneWaiting()
    }, [id, pleaseWait, doneWaiting])

    useEffect(() => {
        const pageTitle = id === undefined ? 'Add Role' : 'Edit Role'
        const url = id === undefined ? '/role' : `/role/${id}`
        setPageTitle(pageTitle)
        addBreadcrumb({title: pageTitle, url})
        loadRole()
    }, [id, setPageTitle, addBreadcrumb, loadRole])

    useEffect(() => {
        if (id === undefined) return
        const storedSuccessMessage = takeSuccessMessage()
        if (storedSuccessMessage !== null) {
            showSnackbar(storedSuccessMessage, AppSnackbarSeverity.Success)
        }
    }, [id, showSnackbar])

    const conflictMessage = (ex: AxiosError): string =>
        typeof ex.response?.data === 'string'
            ? ex.response.data
            : 'The role could not be saved.'

    const upsert = async (): Promise<void> => {
        setShowValidation(true)
        if (role.Name.trim().length === 0) {
            showSnackbar('A role name is required.', AppSnackbarSeverity.Warning)
            return
        }
        pleaseWait()
        try {
            if (id === undefined) {
                const newRole: RoleNew = {Name: role.Name}
                const addedRole = await roleClient.insertRole(newRole)
                doneWaiting()
                storeSuccessMessage('This role was created.')
                router.push(`/role/${addedRole.Guid}`)
                return
            }
            setRole(await roleClient.updateRole(role))
            setShowValidation(false)
            doneWaiting()
            showSnackbar('This role was saved.', AppSnackbarSeverity.Success)
        } catch (ex: unknown) {
            clearAllWaits()
            if (ex instanceof AxiosError && ex.response?.status === HTTP_STATUS_CODES.CONFLICT) {
                showSnackbar(conflictMessage(ex), AppSnackbarSeverity.Error)
                return
            }
            throw ex
        }
    }

    const handleReset = (): void => {
        if (id === undefined) {
            router.back()
            return
        }
        loadRole()
    }

    const handleDelete = async (): Promise<void> => {
        if (id === undefined) return
        pleaseWait()
        try {
            await roleClient.deleteRole(id)
            doneWaiting()
            storeSuccessMessage('This role was deleted.')
            router.push('/roles')
        } catch (ex: unknown) {
            clearAllWaits()
            if (ex instanceof AxiosError && ex.response?.status === HTTP_STATUS_CODES.CONFLICT) {
                const message = typeof ex.response.data === 'string'
                    ? ex.response.data
                    : 'This role is assigned to one or more users and cannot be deleted.'
                showSnackbar(message, AppSnackbarSeverity.Error)
                return
            }
            throw ex
        }
    }

    return (
        <Stack margin={2} spacing={4}>
            {id !== undefined && <TextField fullWidth label="Id" value={role.Guid} disabled />}
            <TextField
                fullWidth
                required
                error={showValidation && role.Name.trim().length === 0}
                helperText={showValidation && role.Name.trim().length === 0 ? 'Name is required.' : undefined}
                label="Name"
                onChange={event => setRole(currentRole => ({...currentRole, Name: event.target.value}))}
                value={role.Name}
            />
            {id !== undefined && <TextField fullWidth label="Assigned Users" value={role.UserCount} disabled />}
            <Stack direction={{xs: 'column', sm: 'row'}} spacing={2}>
                <Button onClick={upsert} color="primary" variant="contained">{id === undefined ? 'Add' : 'Save'}</Button>
                <Button color="secondary" onClick={handleReset}>{id === undefined ? 'Cancel' : 'Reset Form'}</Button>
                {id !== undefined && (
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => showYesNoDialog({
                            question: 'Are you sure you want to delete this role?',
                            onYes: handleDelete,
                        })}>
                        Delete
                    </Button>
                )}
            </Stack>
        </Stack>
    )
}

export default Role
