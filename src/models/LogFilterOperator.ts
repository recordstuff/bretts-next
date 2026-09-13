export enum LogFilterOperator {
    Exists = 'Exists',
    DoesNotExist = 'DoesNotExist',
    Equals = 'Equals',
    DoesNotEqual = 'DoesNotEqual',
    Contains = 'Contains',
    DoesNotContain = 'DoesNotContain',
    GreaterThan = 'GreaterThan',
    GreaterThanOrEqual = 'GreaterThanOrEqual',
    LessThan = 'LessThan',
    LessThanOrEqual = 'LessThanOrEqual',
}

export const logFilterNeedsValue = (operator: LogFilterOperator): boolean => {
    return operator !== LogFilterOperator.Exists && operator !== LogFilterOperator.DoesNotExist
}
