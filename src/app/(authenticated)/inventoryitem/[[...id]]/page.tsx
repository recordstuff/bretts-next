'use client'

import { HTTP_STATUS_CODES } from '@/clients/HttpClient'
import { inventoryItemClient } from '@/clients/InventoryItemClient'
import { useAppSnackbar } from '@/components/AppSnackbarProvider'
import { LeftDrawerContext } from '@/components/LeftDrawerProvider'
import { PleaseWaitContext } from '@/components/PleaseWaitProvider'
import YesNoDialog from '@/components/YesNoDialog'
import { AppSnackbarSeverity } from '@/models/AppSnackbarState'
import { AttributeDataType } from '@/models/AttributeDataType'
import { AttributeValueDetail } from '@/models/AttributeValueDetail'
import { InventoryItemComponentTemplate } from '@/models/InventoryItemComponentTemplate'
import { emptyInventoryItemDetail, InventoryItemDetail } from '@/models/InventoryItemDetail'
import { InventoryItemNew } from '@/models/InventoryItemNew'
import { NameGuidPair } from '@/models/NameGuidPair'
import { storeSuccessMessage, takeSuccessMessage } from '@/utils/successMessageStorage'
import { Button, Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'
import { AxiosError } from 'axios'
import { useParams, useRouter } from 'next/navigation'
import { ChangeEvent, FC, useCallback, useContext, useEffect, useState } from 'react'
import Link from 'next/link'

const InventoryItem: FC = () => {
    const [item, setItem] = useState<InventoryItemDetail>(emptyInventoryItemDetail())
    const [definitionOptions, setDefinitionOptions] = useState<NameGuidPair[]>([])
    const [componentTemplates, setComponentTemplates] = useState<InventoryItemComponentTemplate[]>([])
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
        setDefinitionOptions(options)
        setItem(loadedItem)
        setComponentTemplates([])
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
        }))
        setComponentTemplates(template.Components)
        doneWaiting()
    }

    const updateAttribute = (
        attributeGuid: string,
        updates: Partial<AttributeValueDetail>
    ): void => {
        setItem(currentItem => ({
            ...currentItem,
            Attributes: currentItem.Attributes.map(attribute => attribute.AttributeDefinitionGuid === attributeGuid
                ? {...attribute, ...updates}
                : attribute),
        }))
    }

    const handleNumberChange = (
        attribute: AttributeValueDetail,
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ): void => {
        const value = event.target.value === '' ? null : Number(event.target.value)
        if (attribute.DataType === AttributeDataType.Integer) {
            updateAttribute(attribute.AttributeDefinitionGuid, {IntegerValue: value})
        } else if (attribute.DataType === AttributeDataType.Currency) {
            updateAttribute(attribute.AttributeDefinitionGuid, {CurrencyValue: value})
        } else {
            updateAttribute(attribute.AttributeDefinitionGuid, {DecimalValue: value})
        }
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
            if (ex instanceof AxiosError && ex.response?.status === HTTP_STATUS_CODES.CONFLICT) {
                showSnackbar('This inventory item contains other items and cannot be deleted.', AppSnackbarSeverity.Error)
                return
            }
            throw ex
        }
    }

    const attributeField = (attribute: AttributeValueDetail) => {
        if (attribute.DataType === AttributeDataType.Checkbox) {
            return (
                <FormControlLabel
                    key={attribute.AttributeDefinitionGuid}
                    control={<Checkbox
                        checked={attribute.CheckboxValue}
                        onChange={event => updateAttribute(attribute.AttributeDefinitionGuid, {
                            CheckboxValue: event.target.checked,
                        })}
                    />}
                    label={attribute.Name}
                />
            )
        }

        if (attribute.DataType === AttributeDataType.String) {
            return (
                <TextField
                    fullWidth
                    key={attribute.AttributeDefinitionGuid}
                    label={attribute.Name}
                    onChange={event => updateAttribute(attribute.AttributeDefinitionGuid, {
                        StringValue: event.target.value.length === 0 ? null : event.target.value,
                    })}
                    value={attribute.StringValue ?? ''}
                />
            )
        }

        const value = attribute.DataType === AttributeDataType.Integer
            ? attribute.IntegerValue
            : attribute.DataType === AttributeDataType.Currency
                ? attribute.CurrencyValue
                : attribute.DecimalValue
        const step = attribute.DataType === AttributeDataType.Integer
            ? 1
            : attribute.DataType === AttributeDataType.Currency ? 0.01 : 'any'

        return (
            <TextField
                fullWidth
                key={attribute.AttributeDefinitionGuid}
                inputProps={{step}}
                label={attribute.Name}
                onChange={event => handleNumberChange(attribute, event)}
                type="number"
                value={value ?? ''}
            />
        )
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
                        : item.Attributes.map(attributeField)}
                </Stack>
            )}
            {item.InventoryItemDefinitionGuid.length > 0 && (
                <Stack spacing={2}>
                    <Typography variant="h6">Components</Typography>
                    {(id === undefined ? componentTemplates.length : item.Components.length) === 0
                        ? <Typography color="text.secondary">This inventory item has no components.</Typography>
                        : (
                            <TableContainer component={Paper}>
                                <Table aria-label="Inventory item components">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Id</TableCell>
                                            <TableCell>Definition</TableCell>
                                            <TableCell>Serial Number</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {id === undefined
                                            ? componentTemplates.map((component, index) => (
                                                <TableRow key={`${component.InventoryItemDefinitionGuid}-${index}`}>
                                                    <TableCell>—</TableCell>
                                                    <TableCell>{component.InventoryItemDefinitionName}</TableCell>
                                                    <TableCell>—</TableCell>
                                                </TableRow>
                                            ))
                                            : item.Components.map(component => (
                                                <TableRow key={component.Guid}>
                                                    <TableCell>
                                                        <Link className="entity-id-link" href={`/inventoryitem/${component.Guid}`}>
                                                            {component.Guid}
                                                        </Link>
                                                    </TableCell>
                                                    <TableCell>{component.InventoryItemDefinitionName}</TableCell>
                                                    <TableCell>{component.SerialNumber ?? '—'}</TableCell>
                                                </TableRow>
                                            ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
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
                open={deleteDialogOpen}
                question="Are you sure you want to delete this inventory item?"
                onNo={() => setDeleteDialogOpen(false)}
                onYes={handleDelete}
            />
        </Stack>
    )
}

export default InventoryItem
