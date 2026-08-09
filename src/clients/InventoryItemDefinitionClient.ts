import { HttpClient } from './HttpClient'
import { InventoryItemDefinitionDetail } from '@/models/InventoryItemDefinitionDetail'
import { InventoryItemDefinitionNew } from '@/models/InventoryItemDefinitionNew'
import { InventoryItemDefinitionSummary } from '@/models/InventoryItemDefinitionSummary'
import { InventoryItemDefinitionsSortColumn } from '@/models/InventoryItemDefinitionsSortColumn'
import { NameGuidPair } from '@/models/NameGuidPair'
import { PaginationResult } from '@/models/PaginationResult'
import { SortDirection } from '@/models/SortDirection'

class InventoryItemDefinitionClient extends HttpClient {
    constructor() {
        super('inventoryitemdefinition')
    }

    public getInventoryItemDefinitions(
        page: number,
        pageSize: number,
        searchText: string | null = null,
        sortColumn: InventoryItemDefinitionsSortColumn = InventoryItemDefinitionsSortColumn.Name,
        sortDirection: SortDirection = SortDirection.Ascending
    ): Promise<PaginationResult<InventoryItemDefinitionSummary>> {
        return this.get<PaginationResult<InventoryItemDefinitionSummary>>('definitions', {
            page,
            pageSize,
            searchText,
            sortColumn,
            sortDirection,
        })
    }

    public getInventoryItemDefinitionOptions(): Promise<NameGuidPair[]> {
        return this.get<NameGuidPair[]>('options')
    }

    public getInventoryItemDefinition(id: string): Promise<InventoryItemDefinitionDetail> {
        return this.get<InventoryItemDefinitionDetail>(`definition/${id}`)
    }

    public insertInventoryItemDefinition(definition: InventoryItemDefinitionNew): Promise<InventoryItemDefinitionDetail> {
        return this.post<InventoryItemDefinitionNew, InventoryItemDefinitionDetail>('insert', definition)
    }

    public updateInventoryItemDefinition(definition: InventoryItemDefinitionDetail): Promise<InventoryItemDefinitionDetail> {
        return this.post<InventoryItemDefinitionDetail, InventoryItemDefinitionDetail>('update', definition)
    }

    public deleteInventoryItemDefinition(id: string): Promise<boolean> {
        return this.delete<never, boolean>(`delete/${id}`)
    }
}

export const inventoryItemDefinitionClient = new InventoryItemDefinitionClient()
