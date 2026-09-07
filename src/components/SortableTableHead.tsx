import { TableCell, TableHead, TableRow, TableSortLabel } from '@mui/material'
import { SortDirection } from '@/models/SortDirection'
import { ReactElement } from 'react'

export interface SortColumnDefinition<TSortColumn> {
    label: string
    column: TSortColumn
}

interface SortableTableHeadProps<TSortColumn extends string | number> {
    columns: readonly SortColumnDefinition<TSortColumn>[]
    onSort: (column: TSortColumn) => void
    sortColumn: TSortColumn
    sortDirection: SortDirection
}

const SortableTableHead = <TSortColumn extends string | number>({
    columns,
    onSort,
    sortColumn,
    sortDirection,
}: SortableTableHeadProps<TSortColumn>): ReactElement => (
    <TableHead>
        <TableRow>
            {columns.map(({ label, column }) => {
                const active = sortColumn === column
                let direction: 'asc' | 'desc' = 'asc'

                if (sortDirection === SortDirection.Descending) {
                    direction = 'desc'
                }

                let tableSortDirection: 'asc' | 'desc' | false = false
                let labelDirection: 'asc' | 'desc' = 'asc'

                if (active) {
                    tableSortDirection = direction
                    labelDirection = direction
                }

                return (
                    <TableCell key={column} sortDirection={tableSortDirection}>
                        <TableSortLabel
                            active={active}
                            direction={labelDirection}
                            onClick={() => onSort(column)}
                        >
                            {label}
                        </TableSortLabel>
                    </TableCell>
                )
            })}
        </TableRow>
    </TableHead>
)

export default SortableTableHead
