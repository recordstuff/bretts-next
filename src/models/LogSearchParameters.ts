import { LogAttributeFilter } from './LogAttributeFilter'
import { LogEventLevel } from './LogEventLevel'
import { LogsSortColumn } from './LogsSortColumn'
import { SortDirection } from './SortDirection'

export interface LogSearchParameters {
    Page: number
    PageSize: number
    SearchText: string | null
    From: string | null
    To: string | null
    Level: LogEventLevel | null
    SortColumn: LogsSortColumn
    SortDirection: SortDirection
    AttributeFilters: LogAttributeFilter[]
}
