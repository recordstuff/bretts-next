import { InventoryItemComponentDetail } from '@/models/InventoryItemComponentDetail'
import { InventoryItemComponentTemplate } from '@/models/InventoryItemComponentTemplate'
import { toInventoryItemComponentDetail } from '@/utils/inventoryItemComponent'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import { Box, Button, IconButton, Paper, Stack, TextField, Typography } from '@mui/material'
import { FC } from 'react'
import AttributeValueFields from './AttributeValueFields'

interface InventoryItemComponentsEditorProps {
    components: InventoryItemComponentDetail[]
    componentTemplates: InventoryItemComponentTemplate[]
    onDelete?: (component: InventoryItemComponentDetail, componentLabel: string) => void
    onChange: (components: InventoryItemComponentDetail[]) => void
    level?: number
}

const InventoryItemComponentsEditor: FC<InventoryItemComponentsEditorProps> = ({
    components,
    componentTemplates,
    onDelete,
    onChange,
    level = 0,
}) => {
    const updateComponent = (
        index: number,
        updates: Partial<InventoryItemComponentDetail>
    ): void => onChange(components.map((component, componentIndex) => componentIndex === index
        ? {...component, ...updates}
        : component))

    const addComponent = (template: InventoryItemComponentTemplate): void => onChange([
        ...components,
        toInventoryItemComponentDetail(template),
    ].sort((left, right) => left.OrderIndex - right.OrderIndex))

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
            {componentTemplates.map(template => {
                const component = components.find(candidate => candidate.OrderIndex === template.OrderIndex)
                const matchingTemplates = componentTemplates.filter(candidate =>
                    candidate.InventoryItemDefinitionGuid === template.InventoryItemDefinitionGuid)
                const componentNumber = componentTemplates
                    .filter(candidate => candidate.OrderIndex <= template.OrderIndex
                        && candidate.InventoryItemDefinitionGuid === template.InventoryItemDefinitionGuid)
                    .length
                const componentLabel = matchingTemplates.length > 1
                    ? `${template.InventoryItemDefinitionName} ${componentNumber}`
                    : template.InventoryItemDefinitionName

                if (component === undefined) {
                    return (
                        <Paper
                            component="article"
                            key={`missing-${template.InventoryItemDefinitionGuid}-${template.OrderIndex}`}
                            variant="outlined"
                            sx={{
                                borderStyle: 'dashed',
                                p: {xs: 2, sm: 2.5},
                            }}
                        >
                            <Stack alignItems="flex-start" spacing={1.5}>
                                <Typography component="h3" variant="h6">{componentLabel}</Typography>
                                <Typography color="text.secondary">This component is missing.</Typography>
                                <Button startIcon={<AddIcon />} onClick={() => addComponent(template)}>
                                    Add {template.InventoryItemDefinitionName} Component
                                </Button>
                            </Stack>
                        </Paper>
                    )
                }

                const index = components.indexOf(component)
                const key = component.Guid === '00000000-0000-0000-0000-000000000000'
                    ? `${component.InventoryItemDefinitionGuid}-${component.OrderIndex}`
                    : component.Guid

                return (
                    <Paper
                        component="article"
                        key={key}
                        variant="outlined"
                        sx={{p: {xs: 2, sm: 2.5}}}
                    >
                        <Stack spacing={2.5}>
                            <Stack alignItems="center" direction="row" justifyContent="space-between">
                                <Typography component="h3" variant="h6">{componentLabel}</Typography>
                                {onDelete !== undefined
                                 && component.Guid !== '00000000-0000-0000-0000-000000000000' && (
                                    <IconButton
                                        aria-label={`Delete ${componentLabel}`}
                                        color="error"
                                        onClick={() => onDelete(component, componentLabel)}
                                        size="small"
                                        sx={{m: -1}}
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                )}
                            </Stack>
                            <TextField
                                fullWidth
                                label="Serial Number"
                                onChange={event => updateComponent(index, {SerialNumber: event.target.value})}
                                value={component.SerialNumber ?? ''}
                            />
                            {component.Attributes.length > 0 && (
                                <AttributeValueFields
                                    attributes={component.Attributes}
                                    onChange={attributes => updateComponent(index, {Attributes: attributes})}
                                />
                            )}
                            {template.Components.length > 0 && (
                                <Stack spacing={1.5}>
                                    <Typography component="h4" variant="subtitle1">
                                        {component.InventoryItemDefinitionName} Components
                                    </Typography>
                                    <InventoryItemComponentsEditor
                                        components={component.Components}
                                        componentTemplates={template.Components}
                                        level={level + 1}
                                        onDelete={onDelete}
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
