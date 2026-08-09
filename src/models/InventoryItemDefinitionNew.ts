import { AttributeDefinitionDetail } from './AttributeDefinitionDetail'
import { InventoryItemDefinitionComponentDetail } from './InventoryItemDefinitionComponentDetail'

export interface InventoryItemDefinitionNew {
    Name: string
    Description: string | null
    Attributes: AttributeDefinitionDetail[]
    Components: InventoryItemDefinitionComponentDetail[]
}
