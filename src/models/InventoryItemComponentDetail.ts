import { AttributeValueDetail } from './AttributeValueDetail'

export interface InventoryItemComponentDetail {
    Guid: string
    InventoryItemDefinitionGuid: string
    InventoryItemDefinitionName: string
    SerialNumber: string | null
    Attributes: AttributeValueDetail[]
    Components: InventoryItemComponentDetail[]
}
