'use client'

import { HTTP_STATUS_CODES } from '@/clients/HttpClient'
import { attributeDefinitionClient } from '@/clients/AttributeDefinitionClient'
import { inventoryItemDefinitionClient } from '@/clients/InventoryItemDefinitionClient'
import { useAppSnackbar } from '@/components/AppSnackbarProvider'
import AttributeDefinitionsSelector from '@/components/AttributeDefinitionsSelector'
import InventoryItemDefinitionComponentsEditor from '@/components/InventoryItemDefinitionComponentsEditor'
import { LeftDrawerContext } from '@/components/LeftDrawerProvider'
import { PleaseWaitContext } from '@/components/PleaseWaitProvider'
import { useYesNoDialog } from '@/components/YesNoDialogProvider'
import { AppSnackbarSeverity } from '@/models/AppSnackbarState'
import { AttributeDefinitionDetail } from '@/models/AttributeDefinitionDetail'
import { AttributeDefinitionNew } from '@/models/AttributeDefinitionNew'
import { emptyInventoryItemDefinitionDetail, InventoryItemDefinitionDetail } from '@/models/InventoryItemDefinitionDetail'
import { InventoryItemDefinitionNew } from '@/models/InventoryItemDefinitionNew'
import { NameGuidPair } from '@/models/NameGuidPair'
import { storeSuccessMessage, takeSuccessMessage } from '@/utils/successMessageStorage'
import { Button, Stack, TextField } from '@mui/material'
import { AxiosError } from 'axios'
import { useParams, useRouter } from 'next/navigation'
import { ChangeEvent, FC, useCallback, useContext, useEffect, useState } from 'react'

const InventoryItemDefinition: FC = () => {
    const [definition, setDefinition] = useState<InventoryItemDefinitionDetail>(emptyInventoryItemDefinitionDetail())
    const [attributeOptions, setAttributeOptions] = useState<AttributeDefinitionDetail[]>([])
    const [definitionOptions, setDefinitionOptions] = useState<NameGuidPair[]>([])
    const [showValidation, setShowValidation] = useState(false)
    const {showSnackbar} = useAppSnackbar()
    const {showYesNoDialog} = useYesNoDialog()
    const {actions: {clearAllWaits, pleaseWait, doneWaiting}} = useContext(PleaseWaitContext)
    const {addBreadcrumb, setPageTitle} = useContext(LeftDrawerContext)
    const {id} = useParams<{id: string}>()
    const router = useRouter()

    const loadDefinition = useCallback(async (): Promise<void> => {
        pleaseWait()

        const [possibleAttributes, possibleItemDefinitionComponents, inventoryItemDefinition] = await Promise.all([
            attributeDefinitionClient.getAttributeDefinitionOptions(),
            inventoryItemDefinitionClient.getInventoryItemDefinitionOptions(),
            id === undefined
                ? Promise.resolve(emptyInventoryItemDefinitionDetail())
                : inventoryItemDefinitionClient.getInventoryItemDefinition(id),
        ])

        setAttributeOptions(possibleAttributes)
        setDefinitionOptions(possibleItemDefinitionComponents)
        setDefinition(inventoryItemDefinition)
        setShowValidation(false)
        doneWaiting()
    }, [id, pleaseWait, doneWaiting])

    useEffect(() => {
        const pageTitle = id === undefined ? 'Add Inventory Item Definition' : 'Edit Inventory Item Definition'
        const url = id === undefined ? '/inventoryitemdefinition' : `/inventoryitemdefinition/${id}`

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

    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        const field = event.target.name as 'Name' | 'Description'

        setDefinition(currentDefinition => ({
            ...currentDefinition,
            [field]: event.target.value,
        }))
    }

    const upsert = async (): Promise<void> => {
        setShowValidation(true)

        if (definition.Name.trim().length === 0) {
            showSnackbar('A definition name is required.', AppSnackbarSeverity.Warning)
            return
        }

        pleaseWait()

        try {
            if (id === undefined) {
                const newDefinition: InventoryItemDefinitionNew = {
                    Name: definition.Name,
                    Description: definition.Description,
                    Attributes: definition.Attributes,
                    Components: definition.Components,
                }
                const addedDefinition = await inventoryItemDefinitionClient.insertInventoryItemDefinition(newDefinition)

                doneWaiting()
                storeSuccessMessage('This inventory item definition was created.')
                router.push(`/inventoryitemdefinition/${addedDefinition.Guid}`)
                return
            }

            const updatedDefinition = await inventoryItemDefinitionClient.updateInventoryItemDefinition({
                ...definition,
                AttributeCount: definition.Attributes.length,
                ComponentCount: definition.Components.length,
            })

            setDefinition(updatedDefinition)
            setShowValidation(false)
            doneWaiting()
            showSnackbar('This inventory item definition was saved.', AppSnackbarSeverity.Success)
        } catch (ex: unknown) {
            clearAllWaits()

            if (ex instanceof AxiosError && ex.response?.status === HTTP_STATUS_CODES.BAD_REQUEST) {
                showSnackbar(
                    'The definition could not be saved. Check its fields, attributes, and component relationships.',
                    AppSnackbarSeverity.Error
                )
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

    const quickAddAttribute = async (newAttribute: AttributeDefinitionNew): Promise<AttributeDefinitionDetail | null> => {
        pleaseWait()

        try {
            const addedAttribute = await attributeDefinitionClient.insertAttributeDefinition(newAttribute)

            setAttributeOptions(currentOptions => [...currentOptions, addedAttribute]
                .sort((left, right) => left.Name.localeCompare(right.Name)))
            doneWaiting()
            showSnackbar('The attribute definition was created and selected.', AppSnackbarSeverity.Success)

            return addedAttribute
        } catch (ex: unknown) {
            clearAllWaits()

            if (ex instanceof AxiosError && ex.response?.status === HTTP_STATUS_CODES.CONFLICT) {
                showSnackbar('An attribute definition with this name already exists.', AppSnackbarSeverity.Error)
                return null
            }

            throw ex
        }
    }

    const quickAddDefinition = async (newDefinition: InventoryItemDefinitionNew): Promise<NameGuidPair | null> => {
        pleaseWait()

        try {
            const addedDefinition = await inventoryItemDefinitionClient.insertInventoryItemDefinition(newDefinition)
            const newOption = {Guid: addedDefinition.Guid, Name: addedDefinition.Name}

            setDefinitionOptions(currentOptions => [...currentOptions, newOption]
                .sort((left, right) => left.Name.localeCompare(right.Name)))
            doneWaiting()
            showSnackbar('The inventory item definition was created and selected.', AppSnackbarSeverity.Success)

            return newOption
        } catch (ex: unknown) {
            clearAllWaits()

            if (ex instanceof AxiosError && ex.response?.status === HTTP_STATUS_CODES.BAD_REQUEST) {
                showSnackbar('An inventory item definition with this name already exists.', AppSnackbarSeverity.Error)
                return null
            }

            throw ex
        }
    }

    const handleDelete = async (): Promise<void> => {
        if (id === undefined) return

        pleaseWait()

        try {
            await inventoryItemDefinitionClient.deleteInventoryItemDefinition(id)
            doneWaiting()
            storeSuccessMessage('This inventory item definition was deleted.')
            router.push('/inventoryitemdefinitions')
        } catch (ex: unknown) {
            clearAllWaits()

            if (ex instanceof AxiosError && ex.response?.status === HTTP_STATUS_CODES.CONFLICT) {
                showSnackbar(
                    'This definition is in use by another definition or inventory item and cannot be deleted.',
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
                name="Name"
                onChange={handleChange}
                value={definition.Name}
            />
            <TextField
                fullWidth
                label="Description"
                name="Description"
                multiline
                minRows={3}
                onChange={handleChange}
                value={definition.Description ?? ''}
            />
            <AttributeDefinitionsSelector
                allAttributes={attributeOptions}
                selectedAttributes={definition.Attributes}
                onChange={attributes => setDefinition(currentDefinition => ({
                    ...currentDefinition,
                    Attributes: attributes,
                    AttributeCount: attributes.length,
                }))}
                onQuickAdd={quickAddAttribute}
            />
            <InventoryItemDefinitionComponentsEditor
                allDefinitions={definitionOptions}
                allAttributes={attributeOptions}
                components={definition.Components}
                currentDefinitionGuid={id}
                onChange={components => setDefinition(currentDefinition => ({
                    ...currentDefinition,
                    Components: components,
                    ComponentCount: components.length,
                }))}
                onQuickAdd={quickAddDefinition}
                onQuickAddAttribute={quickAddAttribute}
            />
            <Stack direction={{xs: 'column', sm: 'row'}} spacing={2}>
                <Button onClick={upsert} color="primary" variant="contained">{id === undefined ? 'Add' : 'Save'}</Button>
                <Button color="secondary" onClick={handleReset}>{id === undefined ? 'Cancel' : 'Reset Form'}</Button>
                {id !== undefined && (
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => showYesNoDialog({
                            question: 'Are you sure you want to delete this inventory item definition?',
                            onYes: handleDelete,
                        })}>
                        Delete
                    </Button>
                )}
            </Stack>
        </Stack>
    )
}

export default InventoryItemDefinition
