import { InventoryItemComponentDetail } from '@/models/InventoryItemComponentDetail'
import { InventoryItemComponentTemplate } from '@/models/InventoryItemComponentTemplate'

const EMPTY_GUID = '00000000-0000-0000-0000-000000000000'

export const toInventoryItemComponentDetail = (
    template: InventoryItemComponentTemplate
): InventoryItemComponentDetail => ({
    Guid: EMPTY_GUID,
    OrderIndex: template.OrderIndex,
    InventoryItemDefinitionGuid: template.InventoryItemDefinitionGuid,
    InventoryItemDefinitionName: template.InventoryItemDefinitionName,
    SerialNumber: '',
    Attributes: template.Attributes,
    Components: template.Components.map(toInventoryItemComponentDetail),
})
