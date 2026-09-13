import { LogDetail } from './LogDetail'

export type LogNew = Omit<LogDetail, 'Guid'>

export const toLogNew = (logDetail: LogDetail): LogNew => ({
    Message: logDetail.Message,
    MessageTemplate: logDetail.MessageTemplate,
    Level: logDetail.Level,
    TimeStamp: logDetail.TimeStamp,
    Exception: logDetail.Exception,
    LogEvent: logDetail.LogEvent,
    SourceContext: logDetail.SourceContext,
    ServerName: logDetail.ServerName,
    Environment: logDetail.Environment,
})
