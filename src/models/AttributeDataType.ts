export enum AttributeDataType {
    String = 0,
    Integer = 1,
    Currency = 2,
    Decimal = 3,
    Checkbox = 4,
}

export const ATTRIBUTE_DATA_TYPE_OPTIONS = [
    {label: 'String', value: AttributeDataType.String},
    {label: 'Integer', value: AttributeDataType.Integer},
    {label: 'Currency', value: AttributeDataType.Currency},
    {label: 'Decimal', value: AttributeDataType.Decimal},
    {label: 'Checkbox', value: AttributeDataType.Checkbox},
] as const

export const attributeDataTypeLabel = (dataType: AttributeDataType): string =>
    ATTRIBUTE_DATA_TYPE_OPTIONS.find(option => option.value === dataType)?.label ?? 'Unknown'
