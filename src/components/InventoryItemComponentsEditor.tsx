import { InventoryItemComponentDetail } from '@/models/InventoryItemComponentDetail'
import { Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'
import { FC, Fragment } from 'react'
import AttributeValueFields from './AttributeValueFields'

interface InventoryItemComponentsEditorProps {
    components: InventoryItemComponentDetail[]
    onChange: (components: InventoryItemComponentDetail[]) => void
    level?: number
}

const InventoryItemComponentsEditor: FC<InventoryItemComponentsEditorProps> = ({
    components,
    onChange,
    level = 0,
}) => {
    const updateComponent = (
        index: number,
        updates: Partial<InventoryItemComponentDetail>
    ): void => onChange(components.map((component, componentIndex) => componentIndex === index
        ? {...component, ...updates}
        : component))

    return (
        <TableContainer component={Paper} sx={{overflowX: 'auto'}}>
            <Table aria-label={level === 0 ? 'Inventory item components' : 'Nested inventory item components'} sx={{minWidth: 720}}>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{width: '22%'}}>Component</TableCell>
                        <TableCell sx={{width: '30%'}}>Serial Number</TableCell>
                        <TableCell>Attributes</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {components.map((component, index) => {
                        const key = component.Guid === '00000000-0000-0000-0000-000000000000'
                            ? `${component.InventoryItemDefinitionGuid}-${index}`
                            : component.Guid

                        return (
                            <Fragment key={key}>
                                <TableRow>
                                    <TableCell sx={{verticalAlign: 'top'}}>
                                        <Typography fontWeight={500}>{component.InventoryItemDefinitionName}</Typography>
                                    </TableCell>
                                    <TableCell sx={{verticalAlign: 'top'}}>
                                        <TextField
                                            fullWidth
                                            label="Serial Number"
                                            onChange={event => updateComponent(index, {SerialNumber: event.target.value})}
                                            value={component.SerialNumber ?? ''}
                                        />
                                    </TableCell>
                                    <TableCell sx={{verticalAlign: 'top'}}>
                                        {component.Attributes.length === 0
                                            ? <Typography color="text.secondary">No attributes</Typography>
                                            : <AttributeValueFields
                                                attributes={component.Attributes}
                                                onChange={attributes => updateComponent(index, {Attributes: attributes})}
                                            />}
                                    </TableCell>
                                </TableRow>
                                {component.Components.length > 0 && (
                                    <TableRow>
                                        <TableCell colSpan={3} sx={{pl: {xs: 2, md: 5}, py: 2}}>
                                            <Stack spacing={1}>
                                                <Typography component="h3" variant="subtitle1">
                                                    {component.InventoryItemDefinitionName} Components
                                                </Typography>
                                                <InventoryItemComponentsEditor
                                                    components={component.Components}
                                                    level={level + 1}
                                                    onChange={nestedComponents => updateComponent(index, {
                                                        Components: nestedComponents,
                                                    })}
                                                />
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </Fragment>
                        )
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default InventoryItemComponentsEditor
