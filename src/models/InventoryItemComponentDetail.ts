import { AttributeValueDetail } from './AttributeValueDetail'

export interface InventoryItemComponentDetail {
    Guid: string
    OrderIndex: number
    InventoryItemDefinitionGuid: string
    InventoryItemDefinitionName: string
    SerialNumber: string | null
    Attributes: AttributeValueDetail[]
    Components: InventoryItemComponentDetail[]
}
