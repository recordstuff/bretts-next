import { LogAttributeFilter } from './LogAttributeFilter'
import { LogEventLevel } from './LogEventLevel'
import { SortDirection } from './SortDirection'

export interface LogSearchParameters {
    Page: number
    PageSize: number
    SearchText: string | null
    From: string | null
    To: string | null
    Level: LogEventLevel | null
    SortDirection: SortDirection
    AttributeFilters: LogAttributeFilter[]
}
