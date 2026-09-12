import { LogAttributeFilter } from './LogAttributeFilter'

export interface LogSearchParameters {
    Page: number
    PageSize: number
    SearchText: string | null
    From: string | null
    To: string | null
    Level: string | null
    NewestFirst: boolean
    AttributeFilters: LogAttributeFilter[]
}
