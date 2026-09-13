import { NameValuePair } from './NameValuePair'

export enum LogEventLevel {
    Verbose = 0,
    Debug = 1,
    Information = 2,
    Warning = 3,
    Error = 4,
    Fatal = 5,
}

const LOG_EVENT_LEVEL_NAMES: Record<LogEventLevel, string> = {
    [LogEventLevel.Verbose]: 'Verbose',
    [LogEventLevel.Debug]: 'Debug',
    [LogEventLevel.Information]: 'Information',
    [LogEventLevel.Warning]: 'Warning',
    [LogEventLevel.Error]: 'Error',
    [LogEventLevel.Fatal]: 'Fatal',
}

export const LOG_EVENT_LEVEL_OPTIONS: NameValuePair<LogEventLevel>[] = Object.entries(LOG_EVENT_LEVEL_NAMES)
    .map(([value, name]) => ({ Name: name, Value: Number(value) as LogEventLevel }))

export const getLogEventLevelName = (level: LogEventLevel | null): string => {
    if (level === null) {
        return ''
    }

    return LOG_EVENT_LEVEL_NAMES[level]
}
