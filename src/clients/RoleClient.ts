import { HttpClient } from "./HttpClient";
import { NameGuidPair } from "../models/NameGuidPair";
import { PaginationResult } from '@/models/PaginationResult'
import { RoleDetail } from '@/models/RoleDetail'
import { RoleNew } from '@/models/RoleNew'
import { RoleSummary } from '@/models/RoleSummary'
import { RolesSortColumn } from '@/models/RolesSortColumn'
import { SortDirection } from '@/models/SortDirection'

class RoleClient extends HttpClient {
    constructor() {
        super('role')
    }

    public getRoles(): Promise<NameGuidPair[]> {
        return this.get<NameGuidPair[]>('roles')
    }

    public getRoleItems(
        page: number,
        pageSize: number,
        searchText: string | null = null,
        sortColumn: RolesSortColumn = RolesSortColumn.Name,
        sortDirection: SortDirection = SortDirection.Ascending
    ): Promise<PaginationResult<RoleSummary>> {
        return this.get<PaginationResult<RoleSummary>>('items', {
            page,
            pageSize,
            searchText,
            sortColumn,
            sortDirection,
        })
    }

    public getRole(id: string): Promise<RoleDetail> {
        return this.get<RoleDetail>(`role/${id}`)
    }

    public insertRole(role: RoleNew): Promise<RoleDetail> {
        return this.post<RoleNew, RoleDetail>('insert', role)
    }

    public updateRole(role: RoleDetail): Promise<RoleDetail> {
        return this.post<RoleDetail, RoleDetail>('update', role)
    }

    public deleteRole(id: string): Promise<boolean> {
        return this.delete<never, boolean>(`delete/${id}`)
    }
}

export const roleClient = new RoleClient()
