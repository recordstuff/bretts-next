import { HttpClient } from './HttpClient'
import { InventoryItemDetail } from '@/models/InventoryItemDetail'
import { InventoryItemNew } from '@/models/InventoryItemNew'
import { InventoryItemSummary } from '@/models/InventoryItemSummary'
import { InventoryItemsSortColumn } from '@/models/InventoryItemsSortColumn'
import { NameGuidPair } from '@/models/NameGuidPair'
import { PaginationResult } from '@/models/PaginationResult'
import { SortDirection } from '@/models/SortDirection'
import { InventoryItemTemplate } from '@/models/InventoryItemTemplate'

class InventoryItemClient extends HttpClient {
    constructor() {
        super('inventoryitem')
    }

    public getInventoryItems(
        page: number,
        pageSize: number,
        searchText: string | null = null,
        topLevelOnly: boolean = false,
        sortColumn: InventoryItemsSortColumn = InventoryItemsSortColumn.Definition,
        sortDirection: SortDirection = SortDirection.Ascending
    ): Promise<PaginationResult<InventoryItemSummary>> {
        return this.get<PaginationResult<InventoryItemSummary>>('items', {
            page,
            pageSize,
            searchText,
            topLevelOnly,
            sortColumn,
            sortDirection,
        })
    }

    public getInventoryItemDefinitionOptions(): Promise<NameGuidPair[]> {
        return this.get<NameGuidPair[]>('definitionoptions')
    }

    public getInventoryItemTemplate(inventoryItemDefinitionGuid: string): Promise<InventoryItemTemplate> {
        return this.get<InventoryItemTemplate>(`template/${inventoryItemDefinitionGuid}`)
    }

    public getInventoryItem(id: string): Promise<InventoryItemDetail> {
        return this.get<InventoryItemDetail>(`item/${id}`)
    }

    public insertInventoryItem(item: InventoryItemNew): Promise<InventoryItemDetail> {
        return this.post<InventoryItemNew, InventoryItemDetail>('insert', item)
    }

    public updateInventoryItem(item: InventoryItemDetail): Promise<InventoryItemDetail> {
        return this.post<InventoryItemDetail, InventoryItemDetail>('update', item)
    }

    public deleteInventoryItem(id: string): Promise<boolean> {
        return this.delete<never, boolean>(`delete/${id}`)
    }
}

export const inventoryItemClient = new InventoryItemClient()
