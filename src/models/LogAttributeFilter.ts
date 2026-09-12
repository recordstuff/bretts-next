import { LogFilterOperator } from './LogFilterOperator'

export interface LogAttributeFilter {
    Attribute: string
    Operator: LogFilterOperator
    Value: string | null
}
