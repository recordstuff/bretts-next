import { HttpClient } from "./HttpClient";
import { NameGuidPair } from "../models/NameGuidPair";
import { PaginationResult } from "../models/PaginationResult";
import { RoleNew } from "../models/RoleNew";
import { RolesSortColumn } from "../models/RolesSortColumn";
import { SortDirection } from "../models/SortDirection";

class RoleClient extends HttpClient {
    constructor() {
        super('role')
    }

    public getAllRoles(): Promise<NameGuidPair[]> {
        return this.get<NameGuidPair[]>('allroles')
    }

    public getRoles(
        page: number,
        pageSize: number,
        searchText: string | null = null,
        sortColumn: RolesSortColumn = RolesSortColumn.Name,
        sortDirection: SortDirection = SortDirection.Ascending
    ): Promise<PaginationResult<NameGuidPair>> {
        return this.get<PaginationResult<NameGuidPair>>('roles', {
            page,
            pageSize,
            searchText,
            sortColumn,
            sortDirection,
        })
    }

    public getRole(id: string): Promise<NameGuidPair> {
        return this.get<NameGuidPair>(`role/${id}`)
    }

    public updateRole(role: NameGuidPair): Promise<NameGuidPair> {
        return this.post<NameGuidPair, NameGuidPair>('update', role)
    }

    public insertRole(role: RoleNew): Promise<NameGuidPair> {
        return this.post<RoleNew, NameGuidPair>('insert', role)
    }

    public deleteRole(id: string): Promise<boolean> {
        return this.delete(`delete/${id}`)
    }
}

export const roleClient = new RoleClient()
