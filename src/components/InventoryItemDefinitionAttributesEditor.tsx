import { InventoryItemAttributeDataType } from '@/models/InventoryItemAttributeDataType'
import { InventoryItemAttributeDefinitionDetail } from '@/models/InventoryItemAttributeDefinitionDetail'
import AddIcon from '@mui/icons-material/Add'
import { Button, MenuItem, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'
import { ChangeEvent, FC } from 'react'

const EMPTY_GUID = '00000000-0000-0000-0000-000000000000'
const DATA_TYPE_OPTIONS = [
    {label: 'String', value: InventoryItemAttributeDataType.String},
    {label: 'Integer', value: InventoryItemAttributeDataType.Integer},
    {label: 'Currency', value: InventoryItemAttributeDataType.Currency},
] as const

interface InventoryItemDefinitionAttributesEditorProps {
    attributes: InventoryItemAttributeDefinitionDetail[]
    onChange: (attributes: InventoryItemAttributeDefinitionDetail[]) => void
    showValidation: boolean
}

const InventoryItemDefinitionAttributesEditor: FC<InventoryItemDefinitionAttributesEditorProps> = ({
    attributes,
    onChange,
    showValidation,
}) => {
    const normalizedNames = attributes.map(attribute => attribute.Name.trim().toLocaleLowerCase())

    const addAttribute = (): void => {
        onChange([...attributes, {
            Guid: EMPTY_GUID,
            Name: '',
            DataType: InventoryItemAttributeDataType.String,
        }])
    }

    const updateName = (index: number, event: ChangeEvent<HTMLInputElement>): void => {
        onChange(attributes.map((attribute, attributeIndex) => attributeIndex === index
            ? {...attribute, Name: event.target.value}
            : attribute))
    }

    const updateDataType = (index: number, event: ChangeEvent<HTMLInputElement>): void => {
        onChange(attributes.map((attribute, attributeIndex) => attributeIndex === index
            ? {...attribute, DataType: Number(event.target.value) as InventoryItemAttributeDataType}
            : attribute))
    }

    const removeAttribute = (index: number): void => {
        onChange(attributes.filter((_, attributeIndex) => attributeIndex !== index))
    }

    const getNameError = (index: number): string | undefined => {
        if (!showValidation) return undefined

        const normalizedName = normalizedNames[index]

        if (normalizedName.length === 0) return 'Name is required.'
        if (normalizedNames.filter(name => name === normalizedName).length > 1) return 'Name must be unique.'

        return undefined
    }

    return (
        <Stack spacing={2}>
            <Stack
                direction={{xs: 'column', sm: 'row'}}
                justifyContent="space-between"
                alignItems={{xs: 'stretch', sm: 'center'}}
                spacing={2}
            >
                <Typography component="h2" variant="h6">Attributes</Typography>
                <Button startIcon={<AddIcon />} onClick={addAttribute}>Add Attribute</Button>
            </Stack>
            <TableContainer component={Paper} variant="outlined">
                <Table aria-label="Inventory item definition attributes">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell sx={{width: {xs: '9rem', sm: '14rem'}}}>Data Type</TableCell>
                            <TableCell aria-label="Actions" sx={{width: {xs: '6rem', sm: '9rem'}}} />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {attributes.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={3}>This definition does not have any attributes.</TableCell>
                            </TableRow>
                        )}
                        {attributes.map((attribute, index) => {
                            const nameError = getNameError(index)

                            return (
                                <TableRow key={`${attribute.Guid}-${index}`}>
                                    <TableCell>
                                        <TextField
                                            fullWidth
                                            required
                                            error={nameError !== undefined}
                                            helperText={nameError}
                                            label="Attribute Name"
                                            value={attribute.Name}
                                            onChange={(event: ChangeEvent<HTMLInputElement>) => updateName(index, event)}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            select
                                            fullWidth
                                            label="Data Type"
                                            value={attribute.DataType}
                                            onChange={(event: ChangeEvent<HTMLInputElement>) => updateDataType(index, event)}
                                            size="small"
                                        >
                                            {DATA_TYPE_OPTIONS.map(option => (
                                                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                                            ))}
                                        </TextField>
                                    </TableCell>
                                    <TableCell>
                                        <Button color="error" onClick={() => removeAttribute(index)}>Remove</Button>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Stack>
    )
}

export default InventoryItemDefinitionAttributesEditor
