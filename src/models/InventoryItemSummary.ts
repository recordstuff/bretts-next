export interface InventoryItemSummary {
    Guid: string
    InventoryItemDefinitionGuid: string
    InventoryItemDefinitionName: string
    SerialNumber: string | null
    AttributeValueCount: number
}
