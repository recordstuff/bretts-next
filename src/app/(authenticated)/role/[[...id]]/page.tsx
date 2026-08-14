'use client'

import { TextField } from '@mui/material'
import { AppSnackbarSeverity } from '@/models/AppSnackbarState'
import { HTTP_STATUS_CODES, isHttpStatusError } from '@/clients/HttpClient'
import EntityForm from '@/components/EntityForm'
import { LeftDrawerContext } from '@/components/LeftDrawerProvider'
import { NameGuidPair } from '@/models/NameGuidPair'
import { PleaseWaitContext } from '@/components/PleaseWaitProvider'
import { RoleNew } from '@/models/RoleNew'
import { roleClient } from '@/clients/RoleClient'
import { useAppSnackbar } from '@/components/AppSnackbarProvider'
import { useParams, useRouter } from 'next/navigation'
import { ChangeEvent, FC, useCallback, useContext, useEffect, useState } from 'react'

const emptyRole = (): NameGuidPair => ({ Guid: '', Name: '' })

const Role: FC = () => {
    const [role, setRole] = useState<NameGuidPair>(emptyRole())
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

                showSnackbar('This role was created.', AppSnackbarSeverity.Success)
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

            if (isHttpStatusError(exception, HTTP_STATUS_CODES.CONFLICT)) {
                showSnackbar('A role with this name already exists.', AppSnackbarSeverity.Warning)
                return
            }

            throw exception
        }
    }

    const handleCancel = async (): Promise<void> => {
        if (!isEdit) {
            router.back()
            return
        }

        await getRole()
    }

    const handleDelete = async (): Promise<void> => {
        if (id === undefined) {
            return
        }

        pleaseWait()

        try {
            await roleClient.deleteRole(id)
            doneWaiting()
            showSnackbar('This role was deleted.', AppSnackbarSeverity.Success)
            router.push('/roles')
        }
        catch (exception: unknown) {
            clearAllWaits()

            if (isHttpStatusError(exception, HTTP_STATUS_CODES.CONFLICT)) {
                showSnackbar('This role is assigned to one or more users and cannot be deleted.', AppSnackbarSeverity.Warning)
                return
            }

            throw exception
        }
    }

    return (
        <EntityForm
            entityName="role"
            isEdit={isEdit}
            onCancel={handleCancel}
            onDelete={handleDelete}
            onSave={upsert}
        >
            {isEdit && <TextField fullWidth label="Id" value={role.Guid} disabled />}
            <TextField fullWidth label="Name" name="Name" onChange={handleChange} value={role.Name} />
        </EntityForm>
    )
}

export default Role
