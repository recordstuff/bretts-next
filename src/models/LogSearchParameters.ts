import { LogAttributeFilter } from './LogAttributeFilter'
import { SortDirection } from './SortDirection'

export interface LogSearchParameters {
    Page: number
    PageSize: number
    SearchText: string | null
    From: string | null
    To: string | null
    Level: string | null
    SortDirection: SortDirection
    AttributeFilters: LogAttributeFilter[]
}
