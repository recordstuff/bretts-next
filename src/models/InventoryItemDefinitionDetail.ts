import { InventoryItemDefinitionComponentDetail } from './InventoryItemDefinitionComponentDetail'
import { InventoryItemDefinitionSummary } from './InventoryItemDefinitionSummary'

export interface InventoryItemDefinitionDetail extends InventoryItemDefinitionSummary {
    Components: InventoryItemDefinitionComponentDetail[]
}

export const emptyInventoryItemDefinitionDetail = (): InventoryItemDefinitionDetail => ({
    Guid: '00000000-0000-0000-0000-000000000000',
    Name: '',
    Description: '',
    ComponentCount: 0,
    Components: [],
})
