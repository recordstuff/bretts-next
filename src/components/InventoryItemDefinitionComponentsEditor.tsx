import { AttributeDefinitionDetail } from '@/models/AttributeDefinitionDetail'
import { AttributeDefinitionNew } from '@/models/AttributeDefinitionNew'
import { InventoryItemDefinitionComponentDetail } from '@/models/InventoryItemDefinitionComponentDetail'
import { InventoryItemDefinitionNew } from '@/models/InventoryItemDefinitionNew'
import { NameGuidPair } from '@/models/NameGuidPair'
import AddIcon from '@mui/icons-material/Add'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'
import { ChangeEvent, FC, useMemo, useState } from 'react'
import AttributeDefinitionsSelector from './AttributeDefinitionsSelector'

interface InventoryItemDefinitionComponentsEditorProps {
    allDefinitions: NameGuidPair[]
    allAttributes: AttributeDefinitionDetail[]
    components: InventoryItemDefinitionComponentDetail[]
    currentDefinitionGuid?: string
    onChange: (components: InventoryItemDefinitionComponentDetail[]) => void
    onQuickAdd: (definition: InventoryItemDefinitionNew) => Promise<NameGuidPair | null>
    onQuickAddAttribute: (definition: AttributeDefinitionNew) => Promise<AttributeDefinitionDetail | null>
}

const InventoryItemDefinitionComponentsEditor: FC<InventoryItemDefinitionComponentsEditorProps> = ({
    allDefinitions,
    allAttributes,
    components,
    currentDefinitionGuid,
    onChange,
    onQuickAdd,
    onQuickAddAttribute,
}) => {
    const [selectedGuid, setSelectedGuid] = useState('')
    const [quantity, setQuantity] = useState(1)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [showValidation, setShowValidation] = useState(false)
    const [adding, setAdding] = useState(false)
    const [newDefinitionAttributes, setNewDefinitionAttributes] = useState<AttributeDefinitionDetail[]>([])

    const availableDefinitions = useMemo(() => allDefinitions.filter(definition =>
        definition.Guid !== currentDefinitionGuid
        && !components.some(component => component.Guid === definition.Guid)
    ), [allDefinitions, components, currentDefinitionGuid])

    const addComponent = (): void => {
        const definition = availableDefinitions.find(option => option.Guid === selectedGuid)

        if (definition === undefined) return

        onChange([...components, {
            Guid: definition.Guid,
            Name: definition.Name,
            Quantity: quantity,
        }])
        setSelectedGuid('')
        setQuantity(1)
    }

    const updateQuantity = (guid: string, event: ChangeEvent<HTMLInputElement>): void => {
        const updatedQuantity = Math.max(1, Number.parseInt(event.target.value, 10) || 1)

        onChange(components.map(component => component.Guid === guid
            ? {...component, Quantity: updatedQuantity}
            : component))
    }

    const removeComponent = (guid: string): void => {
        onChange(components.filter(component => component.Guid !== guid))
    }

    const closeDialog = (): void => {
        if (adding) return

        setDialogOpen(false)
        setName('')
        setDescription('')
        setNewDefinitionAttributes([])
        setShowValidation(false)
    }

    const addDefinition = async (): Promise<void> => {
        setShowValidation(true)

        if (name.trim().length === 0) return

        setAdding(true)

        try {
            const addedDefinition = await onQuickAdd({
                Name: name,
                Description: description,
                Attributes: newDefinitionAttributes,
                Components: [],
            })

            if (addedDefinition === null) return

            onChange([...components, {
                Guid: addedDefinition.Guid,
                Name: addedDefinition.Name,
                Quantity: quantity,
            }])
            setQuantity(1)
            setDialogOpen(false)
            setName('')
            setDescription('')
            setNewDefinitionAttributes([])
            setShowValidation(false)
        } finally {
            setAdding(false)
        }
    }

    return (
        <Stack spacing={2}>
            <Typography component="h2" variant="h6">Components</Typography>
            <Stack direction={{xs: 'column', sm: 'row'}} spacing={2} alignItems={{sm: 'center'}}>
                <TextField
                    select
                    fullWidth
                    label="Component Definition"
                    value={selectedGuid}
                    onChange={event => setSelectedGuid(event.target.value)}
                >
                    <MenuItem value=""><em>Select a definition</em></MenuItem>
                    {availableDefinitions.map(definition => (
                        <MenuItem key={definition.Guid} value={definition.Guid}>{definition.Name}</MenuItem>
                    ))}
                </TextField>
                <TextField
                    label="Quantity"
                    type="number"
                    value={quantity}
                    onChange={event => setQuantity(Math.max(1, Number.parseInt(event.target.value, 10) || 1))}
                    inputProps={{min: 1}}
                    sx={{width: {sm: '10rem'}}}
                />
                <Button
                    disabled={selectedGuid.length === 0}
                    onClick={addComponent}
                    variant="contained"
                    sx={{minWidth: {sm: '9rem'}}}
                >
                    Add Component
                </Button>
                <Button
                    onClick={() => setDialogOpen(true)}
                    startIcon={<AddIcon />}
                    variant="outlined"
                    sx={{minWidth: {sm: '15rem'}}}
                >
                    New Inventory Definition
                </Button>
            </Stack>
            <TableContainer component={Paper} variant="outlined">
                <Table aria-label="Inventory item definition components">
                    <TableHead>
                        <TableRow>
                            <TableCell>Component Definition</TableCell>
                            <TableCell sx={{width: {xs: '7rem', sm: '10rem'}}}>Quantity</TableCell>
                            <TableCell aria-label="Actions" sx={{width: {xs: '6rem', sm: '9rem'}}} />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {components.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={3}>This definition does not contain any component definitions.</TableCell>
                            </TableRow>
                        )}
                        {components.map(component => (
                            <TableRow key={component.Guid}>
                                <TableCell>{component.Name}</TableCell>
                                <TableCell>
                                    <TextField
                                        aria-label={`Quantity of ${component.Name}`}
                                        type="number"
                                        value={component.Quantity}
                                        onChange={(event: ChangeEvent<HTMLInputElement>) => updateQuantity(component.Guid, event)}
                                        inputProps={{min: 1}}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Button color="error" onClick={() => removeComponent(component.Guid)}>Remove</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog open={dialogOpen} onClose={closeDialog} fullWidth maxWidth="md">
                <DialogTitle>Add Inventory Item Definition</DialogTitle>
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
                            label="Description"
                            multiline
                            minRows={3}
                            value={description}
                            onChange={event => setDescription(event.target.value)}
                        />
                        <AttributeDefinitionsSelector
                            allAttributes={allAttributes}
                            selectedAttributes={newDefinitionAttributes}
                            onChange={setNewDefinitionAttributes}
                            onQuickAdd={onQuickAddAttribute}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button color="secondary" disabled={adding} onClick={closeDialog}>Cancel</Button>
                    <Button disabled={adding} onClick={addDefinition} variant="contained">Add</Button>
                </DialogActions>
            </Dialog>
        </Stack>
    )
}

export default InventoryItemDefinitionComponentsEditor
