export interface LogEntry {
    Id: number
    Message: string | null
    MessageTemplate: string | null
    Level: string | null
    TimeStamp: string | null
    Exception: string | null
    LogEvent: string | null
    SourceContext: string | null
    ServerName: string | null
    Environment: string | null
}

export const emptyLogEntry = (): LogEntry => ({
    Id: 0,
    Message: '',
    MessageTemplate: '',
    Level: 'Information',
    TimeStamp: new Date().toISOString(),
    Exception: '',
    LogEvent: '',
    SourceContext: '',
    ServerName: '',
    Environment: '',
})
