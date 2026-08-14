import { SortDirection } from '@/models/SortDirection'
import { Dispatch, SetStateAction, useState } from 'react'

interface TableSort<TSortColumn> {
    handleSort: (column: TSortColumn) => void
    sortColumn: TSortColumn
    sortDirection: SortDirection
}

export const useTableSort = <TSortColumn>(
    initialSortColumn: TSortColumn,
    setPage: Dispatch<SetStateAction<number>>
): TableSort<TSortColumn> => {
    const [sortColumn, setSortColumn] = useState<TSortColumn>(initialSortColumn)
    const [sortDirection, setSortDirection] = useState<SortDirection>(SortDirection.Ascending)

    const handleSort = (column: TSortColumn): void => {
        setPage(1)

        if (column !== sortColumn) {
            setSortColumn(column)
            setSortDirection(SortDirection.Ascending)
            return
        }

        if (sortDirection === SortDirection.Ascending) {
            setSortDirection(SortDirection.Descending)
        }
        else {
            setSortDirection(SortDirection.Ascending)
        }
    }

    return { handleSort, sortColumn, sortDirection }
}
