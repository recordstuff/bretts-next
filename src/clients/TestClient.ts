import { HttpClient } from './HttpClient'

class TestClient extends HttpClient {
    constructor() {
        super('test')
    }

    public async throwError(): Promise<void> {
        await this.get<void>('throwerror')
    }

    public async writeLogEntry(): Promise<void> {
        await this.get<void>('structuredlogentry')
    }

    public async shutdown(): Promise<void> {
        await this.delete<void, void>('shutdown')
    }
}

export const testClient = new TestClient()
