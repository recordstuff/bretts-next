import { AttributeValueDetail } from './AttributeValueDetail'
import { InventoryItemComponentDetail } from './InventoryItemComponentDetail'

export interface InventoryItemNew {
    InventoryItemDefinitionGuid: string
    SerialNumber: string | null
    Attributes: AttributeValueDetail[]
    Components: InventoryItemComponentDetail[]
}
