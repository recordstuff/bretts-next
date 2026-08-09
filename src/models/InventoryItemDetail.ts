import { InventoryItemNew } from './InventoryItemNew'
import { InventoryItemSummary } from './InventoryItemSummary'

export interface InventoryItemDetail extends InventoryItemNew {
    Guid: string
    InventoryItemDefinitionName: string
    Components: InventoryItemSummary[]
}

export const emptyInventoryItemDetail = (): InventoryItemDetail => ({
    Guid: '00000000-0000-0000-0000-000000000000',
    InventoryItemDefinitionGuid: '',
    InventoryItemDefinitionName: '',
    SerialNumber: '',
    Attributes: [],
    Components: [],
})
