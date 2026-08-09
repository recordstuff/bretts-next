'use client'

import { HTTP_STATUS_CODES } from '@/clients/HttpClient'
import { inventoryItemClient } from '@/clients/InventoryItemClient'
import { useAppSnackbar } from '@/components/AppSnackbarProvider'
import AttributeValueFields from '@/components/AttributeValueFields'
import InventoryItemComponentsEditor from '@/components/InventoryItemComponentsEditor'
import { LeftDrawerContext } from '@/components/LeftDrawerProvider'
import { PleaseWaitContext } from '@/components/PleaseWaitProvider'
import YesNoDialog from '@/components/YesNoDialog'
import { AppSnackbarSeverity } from '@/models/AppSnackbarState'
import { InventoryItemComponentTemplate } from '@/models/InventoryItemComponentTemplate'
import { emptyInventoryItemDetail, InventoryItemDetail } from '@/models/InventoryItemDetail'
import { InventoryItemNew } from '@/models/InventoryItemNew'
import { NameGuidPair } from '@/models/NameGuidPair'
import { storeSuccessMessage, takeSuccessMessage } from '@/utils/successMessageStorage'
import { toInventoryItemComponentDetail } from '@/utils/inventoryItemComponent'
import { Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, TextField, Typography } from '@mui/material'
import { AxiosError } from 'axios'
import { useParams, useRouter } from 'next/navigation'
import { FC, useCallback, useContext, useEffect, useState } from 'react'

interface ComponentDeleteRequest {
    componentLabel: string
    guid: string
}

const InventoryItem: FC = () => {
    const [item, setItem] = useState<InventoryItemDetail>(emptyInventoryItemDetail())
    const [componentTemplates, setComponentTemplates] = useState<InventoryItemComponentTemplate[]>([])
    const [definitionOptions, setDefinitionOptions] = useState<NameGuidPair[]>([])
    const [componentDeleteRequest, setComponentDeleteRequest] = useState<ComponentDeleteRequest | null>(null)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [showValidation, setShowValidation] = useState(false)
    const {showSnackbar} = useAppSnackbar()
    const {actions: {clearAllWaits, pleaseWait, doneWaiting}} = useContext(PleaseWaitContext)
    const {addBreadcrumb, setPageTitle} = useContext(LeftDrawerContext)
    const {id} = useParams<{id: string}>()
    const router = useRouter()

    const loadItem = useCallback(async (): Promise<void> => {
        pleaseWait()
        const [options, loadedItem] = await Promise.all([
            inventoryItemClient.getInventoryItemDefinitionOptions(),
            id === undefined
                ? Promise.resolve(emptyInventoryItemDetail())
                : inventoryItemClient.getInventoryItem(id),
        ])
        const template = loadedItem.InventoryItemDefinitionGuid.length === 0
            ? null
            : await inventoryItemClient.getInventoryItemTemplate(loadedItem.InventoryItemDefinitionGuid)
        setDefinitionOptions(options)
        setItem(loadedItem)
        setComponentTemplates(template?.Components ?? [])
        setShowValidation(false)
        doneWaiting()
    }, [id, pleaseWait, doneWaiting])

    useEffect(() => {
        const pageTitle = id === undefined ? 'Add Inventory Item' : 'Edit Inventory Item'
        const url = id === undefined ? '/inventoryitem' : `/inventoryitem/${id}`
        setPageTitle(pageTitle)
        addBreadcrumb({title: pageTitle, url})
        loadItem()
    }, [id, setPageTitle, addBreadcrumb, loadItem])

    useEffect(() => {
        if (id === undefined) return
        const storedSuccessMessage = takeSuccessMessage()
        if (storedSuccessMessage !== null) {
            showSnackbar(storedSuccessMessage, AppSnackbarSeverity.Success)
        }
    }, [id, showSnackbar])

    const handleDefinitionChange = async (event: SelectChangeEvent<string>): Promise<void> => {
        const inventoryItemDefinitionGuid = event.target.value
        pleaseWait()
        const template = await inventoryItemClient.getInventoryItemTemplate(inventoryItemDefinitionGuid)
        setItem(currentItem => ({
            ...currentItem,
            InventoryItemDefinitionGuid: inventoryItemDefinitionGuid,
            InventoryItemDefinitionName: template.InventoryItemDefinitionName,
            Attributes: template.Attributes,
            Components: template.Components.map(toInventoryItemComponentDetail),
        }))
        setComponentTemplates(template.Components)
        doneWaiting()
    }

    const upsert = async (): Promise<void> => {
        setShowValidation(true)
        if (item.InventoryItemDefinitionGuid.length === 0) {
            showSnackbar('An inventory item definition is required.', AppSnackbarSeverity.Warning)
            return
        }

        pleaseWait()
        try {
            if (id === undefined) {
                const newItem: InventoryItemNew = {
                    InventoryItemDefinitionGuid: item.InventoryItemDefinitionGuid,
                    SerialNumber: item.SerialNumber,
                    Attributes: item.Attributes,
                    Components: item.Components,
                }
                const addedItem = await inventoryItemClient.insertInventoryItem(newItem)
                doneWaiting()
                storeSuccessMessage('This inventory item was created.')
                router.push(`/inventoryitem/${addedItem.Guid}`)
                return
            }

            setItem(await inventoryItemClient.updateInventoryItem(item))
            setShowValidation(false)
            doneWaiting()
            showSnackbar('This inventory item was saved.', AppSnackbarSeverity.Success)
        } catch (ex: unknown) {
            clearAllWaits()
            if (ex instanceof AxiosError
             && (ex.response?.status === HTTP_STATUS_CODES.BAD_REQUEST
              || ex.response?.status === HTTP_STATUS_CODES.CONFLICT)) {
                showSnackbar('The inventory item could not be saved. Check its definition, serial number, and attribute values.', AppSnackbarSeverity.Error)
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
        loadItem()
    }

    const handleDelete = async (): Promise<void> => {
        if (id === undefined) return
        setDeleteDialogOpen(false)
        pleaseWait()
        try {
            await inventoryItemClient.deleteInventoryItem(id)
            doneWaiting()
            storeSuccessMessage('This inventory item was deleted.')
            router.push('/inventory')
        } catch (ex: unknown) {
            clearAllWaits()
            throw ex
        }
    }

    const handleDeleteComponent = async (): Promise<void> => {
        if (componentDeleteRequest === null) return

        const {guid} = componentDeleteRequest
        setComponentDeleteRequest(null)
        pleaseWait()
        try {
            await inventoryItemClient.deleteInventoryItem(guid)
            await loadItem()
            doneWaiting()
            showSnackbar('This component was deleted.', AppSnackbarSeverity.Success)
        } catch (ex: unknown) {
            clearAllWaits()
            throw ex
        }
    }

    return (
        <Stack margin={2} spacing={4}>
            {id !== undefined && <TextField fullWidth label="Id" value={item.Guid} disabled />}
            <FormControl fullWidth required error={showValidation && item.InventoryItemDefinitionGuid.length === 0}>
                <InputLabel id="inventory-definition-label">Inventory Definition</InputLabel>
                <Select
                    labelId="inventory-definition-label"
                    label="Inventory Definition"
                    disabled={id !== undefined}
                    onChange={handleDefinitionChange}
                    value={item.InventoryItemDefinitionGuid}
                >
                    {definitionOptions.map(option => (
                        <MenuItem key={option.Guid} value={option.Guid}>{option.Name}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <TextField
                fullWidth
                label="Serial Number"
                onChange={event => setItem(currentItem => ({...currentItem, SerialNumber: event.target.value}))}
                value={item.SerialNumber ?? ''}
            />
            {item.InventoryItemDefinitionGuid.length > 0 && (
                <Stack spacing={3}>
                    <Typography variant="h6">Attributes</Typography>
                    {item.Attributes.length === 0
                        ? <Typography color="text.secondary">This definition has no attributes.</Typography>
                        : <AttributeValueFields
                            attributes={item.Attributes}
                            onChange={attributes => setItem(currentItem => ({...currentItem, Attributes: attributes}))}
                        />}
                </Stack>
            )}
            {item.InventoryItemDefinitionGuid.length > 0 && (
                <Stack spacing={2}>
                    <Typography variant="h6">Components</Typography>
                    {componentTemplates.length === 0
                        ? <Typography color="text.secondary">This inventory item has no components.</Typography>
                        : <InventoryItemComponentsEditor
                            components={item.Components}
                            componentTemplates={componentTemplates}
                            onDelete={id === undefined
                                ? undefined
                                : (component, componentLabel) => setComponentDeleteRequest({
                                    componentLabel,
                                    guid: component.Guid,
                                })}
                            onChange={components => setItem(currentItem => ({...currentItem, Components: components}))}
                        />}
                </Stack>
            )}
            <Stack direction={{xs: 'column', sm: 'row'}} spacing={2}>
                <Button onClick={upsert} color="primary" variant="contained">{id === undefined ? 'Add' : 'Save'}</Button>
                <Button color="secondary" onClick={handleReset}>{id === undefined ? 'Cancel' : 'Reset Form'}</Button>
                {id !== undefined && (
                    <Button variant="contained" color="error" onClick={() => setDeleteDialogOpen(true)}>Delete</Button>
                )}
            </Stack>
            <YesNoDialog
                open={componentDeleteRequest !== null}
                question={`Are you sure you want to delete ${componentDeleteRequest?.componentLabel ?? 'this component'}? Any components it contains will also be deleted.`}
                onNo={() => setComponentDeleteRequest(null)}
                onYes={handleDeleteComponent}
            />
            <YesNoDialog
                open={deleteDialogOpen}
                question={item.Components.length > 0
                    ? 'This inventory item contains other inventory items. The contained inventory items will be deleted. Are you sure?'
                    : 'Are you sure you want to delete this inventory item?'}
                onNo={() => setDeleteDialogOpen(false)}
                onYes={handleDelete}
            />
        </Stack>
    )
}

export default InventoryItem
