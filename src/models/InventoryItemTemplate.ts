import { AttributeValueDetail } from './AttributeValueDetail'
import { InventoryItemComponentTemplate } from './InventoryItemComponentTemplate'

export interface InventoryItemTemplate {
    InventoryItemDefinitionGuid: string
    InventoryItemDefinitionName: string
    Attributes: AttributeValueDetail[]
    Components: InventoryItemComponentTemplate[]
}
