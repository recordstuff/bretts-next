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
            <Table aria-label={level === 0 ? 'Inventory item components' : 'Nested inventory item components'} sx={{minWidth: 560}}>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{width: '24%'}}>Component</TableCell>
                        <TableCell>Values</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {components.map((component, index) => {
                        const key = component.Guid === '00000000-0000-0000-0000-000000000000'
                            ? `${component.InventoryItemDefinitionGuid}-${index}`
                            : component.Guid
                        const matchingComponents = components.filter(candidate =>
                            candidate.InventoryItemDefinitionGuid === component.InventoryItemDefinitionGuid)
                        const componentNumber = components.slice(0, index + 1).filter(candidate =>
                            candidate.InventoryItemDefinitionGuid === component.InventoryItemDefinitionGuid).length
                        const componentLabel = matchingComponents.length > 1
                            ? `${component.InventoryItemDefinitionName} ${componentNumber}`
                            : component.InventoryItemDefinitionName

                        return (
                            <Fragment key={key}>
                                <TableRow>
                                    <TableCell rowSpan={component.Attributes.length + 1} sx={{verticalAlign: 'top'}}>
                                        <Typography fontWeight={500}>{componentLabel}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            fullWidth
                                            label={`${component.InventoryItemDefinitionName} Serial Number`}
                                            onChange={event => updateComponent(index, {SerialNumber: event.target.value})}
                                            value={component.SerialNumber ?? ''}
                                        />
                                    </TableCell>
                                </TableRow>
                                {component.Attributes.map(attribute => (
                                    <TableRow key={`${key}-${attribute.AttributeDefinitionGuid}`}>
                                        <TableCell>
                                            <AttributeValueFields
                                                attributes={[attribute]}
                                                onChange={updatedAttributes => updateComponent(index, {
                                                    Attributes: component.Attributes.map(currentAttribute =>
                                                        currentAttribute.AttributeDefinitionGuid === attribute.AttributeDefinitionGuid
                                                            ? updatedAttributes[0]
                                                            : currentAttribute),
                                                })}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {component.Components.length > 0 && (
                                    <TableRow>
                                        <TableCell colSpan={2} sx={{pl: {xs: 2, md: 5}, py: 2}}>
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
