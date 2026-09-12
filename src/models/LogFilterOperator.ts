export enum LogFilterOperator {
    Exists,
    DoesNotExist,
    Equals,
    DoesNotEqual,
    Contains,
    DoesNotContain,
    GreaterThan,
    GreaterThanOrEqual,
    LessThan,
    LessThanOrEqual,
}

export const logFilterNeedsValue = (operator: LogFilterOperator): boolean => {
    return operator !== LogFilterOperator.Exists && operator !== LogFilterOperator.DoesNotExist
}
