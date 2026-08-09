import { AttributeDataType } from './AttributeDataType'

export interface AttributeDefinitionSummary {
    Guid: string
    Name: string
    DataType: AttributeDataType
    InventoryItemDefinitionCount: number
}
