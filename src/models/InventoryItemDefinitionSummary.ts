export interface InventoryItemDefinitionSummary {
    Guid: string
    Name: string
    Sku: string | null
    Description: string | null
    AttributeCount: number
    ComponentCount: number
}
