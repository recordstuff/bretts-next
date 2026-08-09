import { HttpClient } from './HttpClient'
import { AttributeDefinitionDetail } from '@/models/AttributeDefinitionDetail'
import { AttributeDefinitionNew } from '@/models/AttributeDefinitionNew'
import { AttributeDefinitionSummary } from '@/models/AttributeDefinitionSummary'
import { AttributeDefinitionsSortColumn } from '@/models/AttributeDefinitionsSortColumn'
import { PaginationResult } from '@/models/PaginationResult'
import { SortDirection } from '@/models/SortDirection'

class AttributeDefinitionClient extends HttpClient {
    constructor() {
        super('attributedefinition')
    }

    public getAttributeDefinitions(
        page: number,
        pageSize: number,
        searchText: string | null = null,
        sortColumn: AttributeDefinitionsSortColumn = AttributeDefinitionsSortColumn.Name,
        sortDirection: SortDirection = SortDirection.Ascending
    ): Promise<PaginationResult<AttributeDefinitionSummary>> {
        return this.get<PaginationResult<AttributeDefinitionSummary>>('definitions', {
            page,
            pageSize,
            searchText,
            sortColumn,
            sortDirection,
        })
    }

    public getAttributeDefinitionOptions(): Promise<AttributeDefinitionDetail[]> {
        return this.get<AttributeDefinitionDetail[]>('options')
    }

    public getAttributeDefinition(id: string): Promise<AttributeDefinitionDetail> {
        return this.get<AttributeDefinitionDetail>(`definition/${id}`)
    }

    public insertAttributeDefinition(definition: AttributeDefinitionNew): Promise<AttributeDefinitionDetail> {
        return this.post<AttributeDefinitionNew, AttributeDefinitionDetail>('insert', definition)
    }

    public updateAttributeDefinition(definition: AttributeDefinitionDetail): Promise<AttributeDefinitionDetail> {
        return this.post<AttributeDefinitionDetail, AttributeDefinitionDetail>('update', definition)
    }

    public deleteAttributeDefinition(id: string): Promise<boolean> {
        return this.delete<never, boolean>(`delete/${id}`)
    }
}

export const attributeDefinitionClient = new AttributeDefinitionClient()
