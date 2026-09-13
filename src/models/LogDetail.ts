import { LogEventLevel } from './LogEventLevel'
import { LogSummary } from './LogSummary'

export interface LogDetail extends LogSummary {
    MessageTemplate: string | null
    Exception: string | null
    LogEvent: string | null
}

export const emptyLogDetail = (): LogDetail => ({
    Guid: '00000000-0000-0000-0000-000000000000',
    Message: '',
    MessageTemplate: '',
    Level: LogEventLevel.Information,
    TimeStamp: new Date().toISOString(),
    Exception: '',
    LogEvent: '',
    SourceContext: '',
    ServerName: '',
    Environment: '',
})
