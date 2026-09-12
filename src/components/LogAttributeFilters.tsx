'use client'

import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import { Box, Button, FormControl, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material'
import { LogAttributeFilter } from '@/models/LogAttributeFilter'
import { LogFilterOperator, logFilterNeedsValue } from '@/models/LogFilterOperator'
import { FC, useId } from 'react'

const OPERATORS = [
    { label: 'exists', value: LogFilterOperator.Exists },
    { label: 'does not exist', value: LogFilterOperator.DoesNotExist },
    { label: 'equals', value: LogFilterOperator.Equals },
    { label: 'does not equal', value: LogFilterOperator.DoesNotEqual },
    { label: 'contains', value: LogFilterOperator.Contains },
    { label: 'does not contain', value: LogFilterOperator.DoesNotContain },
    { label: '>', value: LogFilterOperator.GreaterThan },
    { label: '>=', value: LogFilterOperator.GreaterThanOrEqual },
    { label: '<', value: LogFilterOperator.LessThan },
    { label: '<=', value: LogFilterOperator.LessThanOrEqual },
] as const

interface LogAttributeFiltersProps {
    attributes: string[]
    filters: LogAttributeFilter[]
    onChange: (filters: LogAttributeFilter[]) => void
}

const LogAttributeFilters: FC<LogAttributeFiltersProps> = ({ attributes, filters, onChange }) => {
    const attributeLabelId = useId()
    const operatorLabelId = useId()

    const addFilter = (): void => {
        if (attributes.length === 0) {
            return
        }

        onChange([
            ...filters,
            { Attribute: attributes[0], Operator: LogFilterOperator.Exists, Value: null },
        ])
    }

    const updateFilter = (index: number, updatedFilter: LogAttributeFilter): void => {
        onChange(filters.map((filter, filterIndex) => {
            if (filterIndex === index) {
                return updatedFilter
            }

            return filter
        }))
    }

    const removeFilter = (index: number): void => {
        onChange(filters.filter((_filter, filterIndex) => filterIndex !== index))
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {filters.map((filter, index) => (
                <Box
                    key={`${filter.Attribute}-${index}`}
                    sx={{ alignItems: 'center', display: 'grid', gap: 1, gridTemplateColumns: { xs: '1fr auto', md: '2fr 1.5fr 2fr auto' } }}
                >
                    <FormControl fullWidth>
                        <InputLabel id={`${attributeLabelId}-${index}`}>Attribute</InputLabel>
                        <Select
                            label="Attribute"
                            labelId={`${attributeLabelId}-${index}`}
                            onChange={(event: SelectChangeEvent) => updateFilter(index, { ...filter, Attribute: event.target.value })}
                            value={filter.Attribute}
                        >
                            {attributes.map(attribute => <MenuItem key={attribute} value={attribute}>{attribute}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel id={`${operatorLabelId}-${index}`}>Operator</InputLabel>
                        <Select
                            label="Operator"
                            labelId={`${operatorLabelId}-${index}`}
                            onChange={(event: SelectChangeEvent) => {
                                const operator = Number(event.target.value) as LogFilterOperator
                                let value = filter.Value
                                if (!logFilterNeedsValue(operator)) {
                                    value = null
                                }
                                updateFilter(index, { ...filter, Operator: operator, Value: value })
                            }}
                            value={`${filter.Operator}`}
                        >
                            {OPERATORS.map(operator => (
                                <MenuItem key={operator.value} value={`${operator.value}`}>{operator.label}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {logFilterNeedsValue(filter.Operator) && (
                        <TextField
                            fullWidth
                            label="Value"
                            onChange={event => updateFilter(index, { ...filter, Value: event.target.value })}
                            value={filter.Value ?? ''}
                        />
                    )}
                    <IconButton aria-label="Remove attribute filter" onClick={() => removeFilter(index)}>
                        <DeleteIcon />
                    </IconButton>
                </Box>
            ))}
            <Button disabled={attributes.length === 0} onClick={addFilter} startIcon={<AddIcon />} sx={{ alignSelf: 'flex-start' }}>
                Add attribute filter
            </Button>
        </Box>
    )
}

export default LogAttributeFilters
