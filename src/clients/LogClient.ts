import { HttpClient } from './HttpClient'
import { LogEntry } from '@/models/LogEntry'
import { LogSearchParameters } from '@/models/LogSearchParameters'
import { PaginationResult } from '@/models/PaginationResult'

class LogClient extends HttpClient {
    constructor() {
        super('log')
    }

    public getLogs(searchParameters: LogSearchParameters): Promise<PaginationResult<LogEntry>> {
        return this.post<LogSearchParameters, PaginationResult<LogEntry>>('logs', searchParameters)
    }

    public getAttributes(): Promise<string[]> {
        return this.get<string[]>('attributes')
    }

    public getLog(id: string): Promise<LogEntry> {
        return this.get<LogEntry>(`log/${id}`)
    }

    public insertLog(log: LogEntry): Promise<LogEntry> {
        return this.post<LogEntry, LogEntry>('insert', log)
    }

    public updateLog(log: LogEntry): Promise<LogEntry> {
        return this.post<LogEntry, LogEntry>('update', log)
    }

    public deleteLog(id: string): Promise<boolean> {
        return this.delete(`delete/${id}`)
    }
}

export const logClient = new LogClient()
