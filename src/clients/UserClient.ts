import { JwtRole } from "../models/Jwt";
import { PaginationResult } from "../models/PaginationResult";
import { UserSummary } from "../models/UserSummary";
import { UserCredentials } from "../models/UserCredentials";
import { HttpClient } from "./HttpClient";
import { UserDetail } from "../models/UserDetail";
import { UserNew } from "../models/UserNew";
import { LoginSession } from "../models/LoginSession";

class UserClient extends HttpClient {
    constructor() {
        super('user')
    }

    public login(userCredentials: UserCredentials): Promise<LoginSession> {
        return this.post<UserCredentials, LoginSession>('login', userCredentials)
    }

    public getUsers(
        page: number,
        pageSize: number,
        searchText: string | null = null,
        roleFilter: JwtRole = JwtRole.Any
    ): Promise<PaginationResult<UserSummary>> {
        return this.get<PaginationResult<UserSummary>>('users', {page, pageSize, searchText, roleFilter})
    }

    public getUser(id: string): Promise<UserDetail> {
        return this.get<UserDetail>(`user/${id}`)
    }

    public updateUser(userDetail: UserDetail): Promise<UserDetail> {
        return this.post<UserDetail, UserDetail>('update', userDetail)
    }

    public insertUser(userNew: UserNew): Promise<UserDetail> {
        return this.post<UserNew, UserDetail>('insert', userNew)
    }
}

export const userClient = new UserClient()