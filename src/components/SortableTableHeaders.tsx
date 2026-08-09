import { alpha, TableCell, TableSortLabel } from '@mui/material'
import { SortDirection } from '@/models/SortDirection'

interface SortableColumn<TColumn extends string | number> {
    label: string
    column: TColumn
}

interface SortableTableHeadersProps<TColumn extends string | number> {
    columns: readonly SortableColumn<TColumn>[]
    sortColumn: TColumn
    sortDirection: SortDirection
    onSort: (column: TColumn) => void
}

const SortableTableHeaders = <TColumn extends string | number,>({
    columns,
    sortColumn,
    sortDirection,
    onSort,
}: SortableTableHeadersProps<TColumn>) => (
    <>
        {columns.map(({label, column}) => {
            const active = sortColumn === column
            const direction = sortDirection === SortDirection.Ascending ? 'asc' : 'desc'

            return (
                <TableCell key={column} sortDirection={active ? direction : false}>
                    <TableSortLabel
                        active={active}
                        direction={active ? direction : 'asc'}
                        onClick={() => onSort(column)}
                        sx={(theme) => ({
                            textDecoration: 'underline',
                            textDecorationThickness: '1px',
                            textUnderlineOffset: '0.2em',
                            borderRadius: 1,
                            px: 0.75,
                            py: 0.25,
                            mx: -0.75,
                            my: -0.25,
                            transition: theme.transitions.create([
                                'background-color',
                                'color',
                                'text-shadow',
                                'transform',
                            ], {
                                duration: theme.transitions.duration.shortest,
                            }),
                            '&:hover': {
                                color: theme.palette.common.white,
                                backgroundColor: alpha(theme.palette.common.white, 0.1),
                                textShadow: `0 0 8px ${alpha(theme.palette.common.white, 0.4)}`,
                            },
                            '&:active': {
                                color: theme.palette.common.white,
                                backgroundColor: alpha(theme.palette.common.white, 0.18),
                                transform: 'translateY(1px) scale(0.98)',
                            },
                            '&.Mui-focusVisible': {
                                outline: `2px solid ${theme.palette.common.white}`,
                                outlineOffset: 2,
                            },
                        })}
                    >
                        {label}
                    </TableSortLabel>
                </TableCell>
            )
        })}
    </>
)

export default SortableTableHeaders
