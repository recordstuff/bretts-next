import { InventoryItemDefinitionComponentDetail } from './InventoryItemDefinitionComponentDetail'

export interface InventoryItemDefinitionNew {
    Name: string
    Description: string | null
    Components: InventoryItemDefinitionComponentDetail[]
}
