import { InventoryItemAttributeDefinitionDetail } from './InventoryItemAttributeDefinitionDetail'
import { InventoryItemDefinitionComponentDetail } from './InventoryItemDefinitionComponentDetail'

export interface InventoryItemDefinitionNew {
    Name: string
    Description: string | null
    Attributes: InventoryItemAttributeDefinitionDetail[]
    Components: InventoryItemDefinitionComponentDetail[]
}
