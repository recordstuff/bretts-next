import { HttpClient } from './HttpClient'
import { LogDetail } from '@/models/LogDetail'
import { LogSearchParameters } from '@/models/LogSearchParameters'
import { LogSummary } from '@/models/LogSummary'
import { PaginationResult } from '@/models/PaginationResult'

class LogClient extends HttpClient {
    constructor() {
        super('log')
    }

    public getLogs(searchParameters: LogSearchParameters): Promise<PaginationResult<LogSummary>> {
        return this.post<LogSearchParameters, PaginationResult<LogSummary>>('logs', searchParameters)
    }

    public getAttributes(): Promise<string[]> {
        return this.get<string[]>('attributes')
    }

    public getLog(guid: string): Promise<LogDetail> {
        return this.get<LogDetail>(`log/${guid}`)
    }

    public insertLog(log: LogDetail): Promise<LogDetail> {
        return this.post<LogDetail, LogDetail>('insert', log)
    }

    public updateLog(log: LogDetail): Promise<LogDetail> {
        return this.post<LogDetail, LogDetail>('update', log)
    }

    public deleteLog(guid: string): Promise<boolean> {
        return this.delete(`delete/${guid}`)
    }
}

export const logClient = new LogClient()
