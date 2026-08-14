import { HttpClient } from "./HttpClient";
import { NameGuidPair } from "../models/NameGuidPair";

class RoleClient extends HttpClient {
    constructor() {
        super('role')
    }

    public getAllRoles(): Promise<NameGuidPair[]> {
        return this.get<NameGuidPair[]>('allroles')
    }
}

export const roleClient = new RoleClient()
