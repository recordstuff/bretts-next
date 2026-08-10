export interface InventoryItemSummary {
    Guid: string
    InventoryItemDefinitionGuid: string
    InventoryItemDefinitionName: string
    InventoryItemDefinitionSku: string | null
    SerialNumber: string | null
    AttributeValueCount: number
}
