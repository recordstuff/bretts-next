import { InventoryItemNew } from './InventoryItemNew'

export interface InventoryItemDetail extends InventoryItemNew {
    Guid: string
    InventoryItemDefinitionName: string
}

export const emptyInventoryItemDetail = (): InventoryItemDetail => ({
    Guid: '00000000-0000-0000-0000-000000000000',
    InventoryItemDefinitionGuid: '',
    InventoryItemDefinitionName: '',
    SerialNumber: '',
    Attributes: [],
})
