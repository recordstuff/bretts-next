import { AttributeDataType } from './AttributeDataType'

export interface InventoryItemAttributeValueDetail {
    AttributeDefinitionGuid: string
    Name: string
    DataType: AttributeDataType
    StringValue: string | null
    IntegerValue: number | null
    CurrencyValue: number | null
    DecimalValue: number | null
    CheckboxValue: boolean
}
