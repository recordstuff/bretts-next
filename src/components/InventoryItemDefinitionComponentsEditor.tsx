import { InventoryItemDefinitionComponentDetail } from '@/models/InventoryItemDefinitionComponentDetail'
import { NameGuidPair } from '@/models/NameGuidPair'
import { Button, MenuItem, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'
import { ChangeEvent, FC, useMemo, useState } from 'react'

interface InventoryItemDefinitionComponentsEditorProps {
    allDefinitions: NameGuidPair[]
    components: InventoryItemDefinitionComponentDetail[]
    currentDefinitionGuid?: string
    onChange: (components: InventoryItemDefinitionComponentDetail[]) => void
}

const InventoryItemDefinitionComponentsEditor: FC<InventoryItemDefinitionComponentsEditorProps> = ({
    allDefinitions,
    components,
    currentDefinitionGuid,
    onChange,
}) => {
    const [selectedGuid, setSelectedGuid] = useState('')
    const [quantity, setQuantity] = useState(1)

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
        </Stack>
    )
}

export default InventoryItemDefinitionComponentsEditor
