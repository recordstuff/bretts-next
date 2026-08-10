import { AttributeDataType } from '@/models/AttributeDataType'
import { AttributeValueDetail } from '@/models/AttributeValueDetail'
import { Checkbox, FormControlLabel, Stack, TextField } from '@mui/material'
import { FC } from 'react'
import NumberTextField from './NumberTextField'

interface AttributeValueFieldsProps {
    attributes: AttributeValueDetail[]
    onChange: (attributes: AttributeValueDetail[]) => void
}

const AttributeValueFields: FC<AttributeValueFieldsProps> = ({attributes, onChange}) => {
    const updateAttribute = (
        attributeGuid: string,
        updates: Partial<AttributeValueDetail>
    ): void => onChange(attributes.map(attribute => attribute.AttributeDefinitionGuid === attributeGuid
        ? {...attribute, ...updates}
        : attribute))

    return (
        <Stack spacing={2}>
            {attributes.map(attribute => {
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
                const valueProperty = attribute.DataType === AttributeDataType.Integer
                    ? 'IntegerValue'
                    : attribute.DataType === AttributeDataType.Currency
                        ? 'CurrencyValue'
                        : 'DecimalValue'
                return (
                    <NumberTextField
                        allowDecimal={attribute.DataType !== AttributeDataType.Integer}
                        fullWidth
                        key={attribute.AttributeDefinitionGuid}
                        label={attribute.Name}
                        onValueChange={newValue => updateAttribute(attribute.AttributeDefinitionGuid, {
                            [valueProperty]: newValue,
                        })}
                        value={value}
                    />
                )
            })}
        </Stack>
    )
}

export default AttributeValueFields
