import { InventoryItemAttributeDefinitionDetail } from './InventoryItemAttributeDefinitionDetail'
import { InventoryItemDefinitionComponentDetail } from './InventoryItemDefinitionComponentDetail'
import { InventoryItemDefinitionSummary } from './InventoryItemDefinitionSummary'

export interface InventoryItemDefinitionDetail extends InventoryItemDefinitionSummary {
    Attributes: InventoryItemAttributeDefinitionDetail[]
    Components: InventoryItemDefinitionComponentDetail[]
}

export const emptyInventoryItemDefinitionDetail = (): InventoryItemDefinitionDetail => ({
    Guid: '00000000-0000-0000-0000-000000000000',
    Name: '',
    Description: '',
    AttributeCount: 0,
    ComponentCount: 0,
    Attributes: [],
    Components: [],
})
