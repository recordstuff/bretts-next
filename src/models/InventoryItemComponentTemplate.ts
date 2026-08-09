import { AttributeValueDetail } from './AttributeValueDetail'

export interface InventoryItemComponentTemplate {
    OrderIndex: number
    InventoryItemDefinitionGuid: string
    InventoryItemDefinitionName: string
    Attributes: AttributeValueDetail[]
    Components: InventoryItemComponentTemplate[]
}
