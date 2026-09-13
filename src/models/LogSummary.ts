import { LogEventLevel } from './LogEventLevel'

export interface LogSummary {
    Guid: string
    Message: string | null
    Level: LogEventLevel | null
    TimeStamp: string | null
    SourceContext: string | null
    ServerName: string | null
    Environment: string | null
}
