import { InventoryItemAttributeValueDetail } from './InventoryItemAttributeValueDetail'

export interface InventoryItemNew {
    InventoryItemDefinitionGuid: string
    SerialNumber: string | null
    Attributes: InventoryItemAttributeValueDetail[]
}
