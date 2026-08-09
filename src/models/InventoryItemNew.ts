import { AttributeValueDetail } from './AttributeValueDetail'

export interface InventoryItemNew {
    InventoryItemDefinitionGuid: string
    SerialNumber: string | null
    Attributes: AttributeValueDetail[]
}
