import { AttributeDefinitionDetail } from './AttributeDefinitionDetail'
import { InventoryItemDefinitionComponentDetail } from './InventoryItemDefinitionComponentDetail'
import { InventoryItemDefinitionSummary } from './InventoryItemDefinitionSummary'

export interface InventoryItemDefinitionDetail extends InventoryItemDefinitionSummary {
    Attributes: AttributeDefinitionDetail[]
    Components: InventoryItemDefinitionComponentDetail[]
}

export const emptyInventoryItemDefinitionDetail = (): InventoryItemDefinitionDetail => ({
    Guid: '00000000-0000-0000-0000-000000000000',
    Name: '',
    Sku: '',
    Description: '',
    AttributeCount: 0,
    ComponentCount: 0,
    Attributes: [],
    Components: [],
})
