'use client'

import { attributeDefinitionClient } from '@/clients/AttributeDefinitionClient'
import { HTTP_STATUS_CODES } from '@/clients/HttpClient'
import { useAppSnackbar } from '@/components/AppSnackbarProvider'
import { LeftDrawerContext } from '@/components/LeftDrawerProvider'
import { PleaseWaitContext } from '@/components/PleaseWaitProvider'
import { useYesNoDialog } from '@/components/YesNoDialogProvider'
import { AppSnackbarSeverity } from '@/models/AppSnackbarState'
import { ATTRIBUTE_DATA_TYPE_OPTIONS, AttributeDataType } from '@/models/AttributeDataType'
import { AttributeDefinitionDetail, emptyAttributeDefinitionDetail } from '@/models/AttributeDefinitionDetail'
import { AttributeDefinitionNew } from '@/models/AttributeDefinitionNew'
import { storeSuccessMessage, takeSuccessMessage } from '@/utils/successMessageStorage'
import { Button, MenuItem, Stack, TextField } from '@mui/material'
import { AxiosError } from 'axios'
import { useParams, useRouter } from 'next/navigation'
import { FC, useCallback, useContext, useEffect, useState } from 'react'

const AttributeDefinition: FC = () => {
    const [definition, setDefinition] = useState<AttributeDefinitionDetail>(emptyAttributeDefinitionDetail())
    const [showValidation, setShowValidation] = useState(false)
    const {showSnackbar} = useAppSnackbar()
    const {showYesNoDialog} = useYesNoDialog()
    const {actions: {clearAllWaits, pleaseWait, doneWaiting}} = useContext(PleaseWaitContext)
    const {addBreadcrumb, setPageTitle} = useContext(LeftDrawerContext)
    const {id} = useParams<{id: string}>()
    const router = useRouter()

    const loadDefinition = useCallback(async (): Promise<void> => {
        if (id === undefined) {
            setDefinition(emptyAttributeDefinitionDetail())
            setShowValidation(false)
            return
        }

        pleaseWait()
        setDefinition(await attributeDefinitionClient.getAttributeDefinition(id))
        setShowValidation(false)
        doneWaiting()
    }, [id, pleaseWait, doneWaiting])

    useEffect(() => {
        const pageTitle = id === undefined ? 'Add Attribute Definition' : 'Edit Attribute Definition'
        const url = id === undefined ? '/attributedefinition' : `/attributedefinition/${id}`

        setPageTitle(pageTitle)
        addBreadcrumb({title: pageTitle, url})
        loadDefinition()
    }, [id, setPageTitle, addBreadcrumb, loadDefinition])

    useEffect(() => {
        if (id === undefined) return

        const storedSuccessMessage = takeSuccessMessage()

        if (storedSuccessMessage !== null) {
            showSnackbar(storedSuccessMessage, AppSnackbarSeverity.Success)
        }
    }, [id, showSnackbar])

    const upsert = async (): Promise<void> => {
        setShowValidation(true)

        if (definition.Name.trim().length === 0) {
            showSnackbar('An attribute definition name is required.', AppSnackbarSeverity.Warning)
            return
        }

        pleaseWait()

        try {
            if (id === undefined) {
                const newDefinition: AttributeDefinitionNew = {
                    Name: definition.Name,
                    DataType: definition.DataType,
                }
                const addedDefinition = await attributeDefinitionClient.insertAttributeDefinition(newDefinition)

                doneWaiting()
                storeSuccessMessage('This attribute definition was created.')
                router.push(`/attributedefinition/${addedDefinition.Guid}`)
                return
            }

            setDefinition(await attributeDefinitionClient.updateAttributeDefinition(definition))
            setShowValidation(false)
            doneWaiting()
            showSnackbar('This attribute definition was saved.', AppSnackbarSeverity.Success)
        } catch (ex: unknown) {
            clearAllWaits()

            if (ex instanceof AxiosError && ex.response?.status === HTTP_STATUS_CODES.CONFLICT) {
                showSnackbar('An attribute definition with this name already exists.', AppSnackbarSeverity.Error)
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

        loadDefinition()
    }

    const handleDelete = async (): Promise<void> => {
        if (id === undefined) return

        pleaseWait()

        try {
            await attributeDefinitionClient.deleteAttributeDefinition(id)
            doneWaiting()
            storeSuccessMessage('This attribute definition was deleted.')
            router.push('/attributedefinitions')
        } catch (ex: unknown) {
            clearAllWaits()

            if (ex instanceof AxiosError && ex.response?.status === HTTP_STATUS_CODES.CONFLICT) {
                showSnackbar(
                    'This attribute definition is used by an inventory item definition and cannot be deleted.',
                    AppSnackbarSeverity.Error
                )
                return
            }

            throw ex
        }
    }

    return (
        <Stack margin={2} spacing={4}>
            {id !== undefined && <TextField fullWidth label="Id" value={definition.Guid} disabled />}
            <TextField
                fullWidth
                required
                error={showValidation && definition.Name.trim().length === 0}
                helperText={showValidation && definition.Name.trim().length === 0 ? 'Name is required.' : undefined}
                label="Name"
                onChange={event => setDefinition(current => ({...current, Name: event.target.value}))}
                value={definition.Name}
            />
            <TextField
                select
                fullWidth
                label="Data Type"
                onChange={event => setDefinition(current => ({
                    ...current,
                    DataType: Number(event.target.value) as AttributeDataType,
                }))}
                value={definition.DataType}
            >
                {ATTRIBUTE_DATA_TYPE_OPTIONS.map(option => (
                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                ))}
            </TextField>
            <Stack direction={{xs: 'column', sm: 'row'}} spacing={2}>
                <Button onClick={upsert} color="primary" variant="contained">{id === undefined ? 'Add' : 'Save'}</Button>
                <Button color="secondary" onClick={handleReset}>{id === undefined ? 'Cancel' : 'Reset Form'}</Button>
                {id !== undefined && (
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => showYesNoDialog({
                            question: 'Are you sure you want to delete this attribute definition?',
                            onYes: handleDelete,
                        })}>
                        Delete
                    </Button>
                )}
            </Stack>
        </Stack>
    )
}

export default AttributeDefinition
