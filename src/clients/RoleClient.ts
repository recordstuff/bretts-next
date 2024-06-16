import { HttpClient } from "./HttpClient";
import { NameGuidPair } from "../models/NameGuidPair";

class RoleClient extends HttpClient {
    constructor() {
        super('role')
    }

    public getRoles(): Promise<NameGuidPair[]> {
        return this.get<NameGuidPair[]>('roles')
    }
}

export const roleClient = new RoleClient()