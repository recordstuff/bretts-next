import { ATTRIBUTE_DATA_TYPE_OPTIONS, AttributeDataType, attributeDataTypeLabel } from '@/models/AttributeDataType'
import { AttributeDefinitionDetail } from '@/models/AttributeDefinitionDetail'
import { AttributeDefinitionNew } from '@/models/AttributeDefinitionNew'
import AddIcon from '@mui/icons-material/Add'
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material'
import { FC, useMemo, useState } from 'react'

interface AttributeDefinitionsSelectorProps {
    allAttributes: AttributeDefinitionDetail[]
    selectedAttributes: AttributeDefinitionDetail[]
    onChange: (attributes: AttributeDefinitionDetail[]) => void
    onQuickAdd: (definition: AttributeDefinitionNew) => Promise<boolean>
}

const AttributeDefinitionsSelector: FC<AttributeDefinitionsSelectorProps> = ({
    allAttributes,
    selectedAttributes,
    onChange,
    onQuickAdd,
}) => {
    const [dialogOpen, setDialogOpen] = useState(false)
    const [name, setName] = useState('')
    const [dataType, setDataType] = useState(AttributeDataType.String)
    const [showValidation, setShowValidation] = useState(false)
    const [adding, setAdding] = useState(false)
    const [selectedGuid, setSelectedGuid] = useState('')

    const availableAttributes = useMemo(() => allAttributes.filter(attribute =>
        !selectedAttributes.some(selectedAttribute => selectedAttribute.Guid === attribute.Guid)
    ), [allAttributes, selectedAttributes])

    const addSelectedAttribute = (): void => {
        const attribute = availableAttributes.find(option => option.Guid === selectedGuid)

        if (attribute === undefined) return

        onChange([...selectedAttributes, attribute])
        setSelectedGuid('')
    }

    const removeAttribute = (guid: string): void => {
        onChange(selectedAttributes.filter(attribute => attribute.Guid !== guid))
    }

    const closeDialog = (): void => {
        if (adding) return

        setDialogOpen(false)
        setName('')
        setDataType(AttributeDataType.String)
        setShowValidation(false)
    }

    const addAttribute = async (): Promise<void> => {
        setShowValidation(true)

        if (name.trim().length === 0) return

        setAdding(true)

        try {
            if (await onQuickAdd({Name: name, DataType: dataType})) {
                setDialogOpen(false)
                setName('')
                setDataType(AttributeDataType.String)
                setShowValidation(false)
            }
        } finally {
            setAdding(false)
        }
    }

    return (
        <Stack spacing={2}>
            <Typography component="h2" variant="h6">Attributes</Typography>
            <Stack direction={{xs: 'column', sm: 'row'}} spacing={2} alignItems={{sm: 'center'}}>
                <TextField
                    select
                    fullWidth
                    helperText="Select a reusable attribute available to instances of this definition."
                    label="Attribute Definition"
                    value={selectedGuid}
                    onChange={event => setSelectedGuid(event.target.value)}
                >
                    <MenuItem value=""><em>Select an attribute</em></MenuItem>
                    {availableAttributes.map(attribute => (
                        <MenuItem key={attribute.Guid} value={attribute.Guid}>{attribute.Name}</MenuItem>
                    ))}
                </TextField>
                <Button
                    disabled={selectedGuid.length === 0}
                    onClick={addSelectedAttribute}
                    variant="contained"
                    sx={{minWidth: {sm: '9rem'}}}
                >
                    Add Attribute
                </Button>
                <Button
                    onClick={() => setDialogOpen(true)}
                    startIcon={<AddIcon />}
                    variant="outlined"
                    sx={{minWidth: {sm: '13rem'}}}
                >
                    New Attribute
                </Button>
            </Stack>
            <TableContainer component={Paper} variant="outlined">
                <Table aria-label="Inventory item definition attributes">
                    <TableHead>
                        <TableRow>
                            <TableCell>Attribute Definition</TableCell>
                            <TableCell sx={{width: {xs: '7rem', sm: '10rem'}}}>Data Type</TableCell>
                            <TableCell aria-label="Actions" sx={{width: {xs: '6rem', sm: '9rem'}}} />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {selectedAttributes.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={3}>This definition does not contain any attribute definitions.</TableCell>
                            </TableRow>
                        )}
                        {selectedAttributes.map(attribute => (
                            <TableRow key={attribute.Guid}>
                                <TableCell>{attribute.Name}</TableCell>
                                <TableCell>{attributeDataTypeLabel(attribute.DataType)}</TableCell>
                                <TableCell>
                                    <Button color="error" onClick={() => removeAttribute(attribute.Guid)}>Remove</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog open={dialogOpen} onClose={closeDialog} fullWidth maxWidth="sm">
                <DialogTitle>Add Attribute Definition</DialogTitle>
                <DialogContent>
                    <Stack spacing={3} paddingTop={1}>
                        <TextField
                            autoFocus
                            required
                            error={showValidation && name.trim().length === 0}
                            helperText={showValidation && name.trim().length === 0 ? 'Name is required.' : undefined}
                            label="Name"
                            value={name}
                            onChange={event => setName(event.target.value)}
                        />
                        <TextField
                            select
                            label="Data Type"
                            value={dataType}
                            onChange={event => setDataType(Number(event.target.value) as AttributeDataType)}
                        >
                            {ATTRIBUTE_DATA_TYPE_OPTIONS.map(option => (
                                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                            ))}
                        </TextField>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button color="secondary" disabled={adding} onClick={closeDialog}>Cancel</Button>
                    <Button disabled={adding} onClick={addAttribute} variant="contained">Add</Button>
                </DialogActions>
            </Dialog>
        </Stack>
    )
}

export default AttributeDefinitionsSelector
