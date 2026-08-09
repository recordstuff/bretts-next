import { InventoryItemComponentDetail } from '@/models/InventoryItemComponentDetail'
import { Box, Paper, Stack, TextField, Typography } from '@mui/material'
import { FC } from 'react'
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
        <Box
            aria-label={level === 0 ? 'Inventory item components' : 'Nested inventory item components'}
            component="section"
            sx={{
                display: 'grid',
                gap: 2,
                gridTemplateColumns: {xs: '1fr', lg: 'repeat(2, minmax(0, 1fr))'},
            }}
        >
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
                    <Paper
                        component="article"
                        key={key}
                        variant="outlined"
                        sx={{p: {xs: 2, sm: 2.5}}}
                    >
                        <Stack spacing={2.5}>
                            <Typography component="h3" variant="h6">{componentLabel}</Typography>
                            <TextField
                                fullWidth
                                label="Serial Number"
                                onChange={event => updateComponent(index, {SerialNumber: event.target.value})}
                                value={component.SerialNumber ?? ''}
                            />
                            {component.Attributes.length === 0
                                ? <Typography color="text.secondary">This component has no attributes.</Typography>
                                : <AttributeValueFields
                                    attributes={component.Attributes}
                                    onChange={attributes => updateComponent(index, {Attributes: attributes})}
                                />}
                            {component.Components.length > 0 && (
                                <Stack spacing={1.5}>
                                    <Typography component="h4" variant="subtitle1">
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
                            )}
                        </Stack>
                    </Paper>
                )
            })}
        </Box>
    )
}

export default InventoryItemComponentsEditor
