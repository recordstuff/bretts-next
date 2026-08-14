'use client'

import AddIcon from '@mui/icons-material/Add'
import { alpha } from '@mui/material/styles'
import { Grid, IconButton, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Typography } from '@mui/material'
import { AppSnackbarSeverity } from '@/models/AppSnackbarState'
import { LeftDrawerContext } from '@/components/LeftDrawerProvider'
import Paginator from '@/components/Paginator'
import { PleaseWaitContext } from '@/components/PleaseWaitProvider'
import TextFilter from '@/components/TextFilter'
import { roleClient } from '@/clients/RoleClient'
import { NameGuidPair } from '@/models/NameGuidPair'
import { emptyPaginationResult, PaginationResult } from '@/models/PaginationResult'
import { RolesSortColumn } from '@/models/RolesSortColumn'
import { SortDirection } from '@/models/SortDirection'
import { takeSuccessMessage } from '@/utils/successMessageStorage'
import { useAppSnackbar } from '@/components/AppSnackbarProvider'
import Link from 'next/link'
import { FC, useCallback, useContext, useEffect, useState } from 'react'

const PAGE_SIZE = 5
const ROLE_SORT_COLUMNS = [
    { label: 'Id', column: RolesSortColumn.Id },
    { label: 'Name', column: RolesSortColumn.Name },
] as const

const Roles: FC = () => {
    const [paginationResult, setPaginationResult] = useState<PaginationResult<NameGuidPair>>(emptyPaginationResult())
    const [page, setPage] = useState(1)
    const [searchText, setSearchText] = useState('')
    const [sortColumn, setSortColumn] = useState<RolesSortColumn>(RolesSortColumn.Name)
    const [sortDirection, setSortDirection] = useState<SortDirection>(SortDirection.Ascending)
    const { showSnackbar } = useAppSnackbar()
    const { actions: { pleaseWait, doneWaiting } } = useContext(PleaseWaitContext)
    const { firstBreadcrumb, setPageTitle } = useContext(LeftDrawerContext)

    const getRoles = useCallback(async (): Promise<void> => {
        pleaseWait()

        const response = await roleClient.getRoles(
            page,
            PAGE_SIZE,
            searchText,
            sortColumn,
            sortDirection
        )

        setPaginationResult(response)
        doneWaiting()
    }, [page, searchText, sortColumn, sortDirection, pleaseWait, doneWaiting])

    const handleSort = (column: RolesSortColumn): void => {
        setPage(1)

        if (column === sortColumn) {
            if (sortDirection === SortDirection.Ascending) {
                setSortDirection(SortDirection.Descending)
            }
            else {
                setSortDirection(SortDirection.Ascending)
            }

            return
        }

        setSortColumn(column)
        setSortDirection(SortDirection.Ascending)
    }

    useEffect(() => {
        setPageTitle('Roles')
        firstBreadcrumb({ title: 'Roles', url: '/roles' })
        getRoles()
    }, [setPageTitle, firstBreadcrumb, getRoles])

    useEffect(() => {
        const storedSuccessMessage = takeSuccessMessage()

        if (storedSuccessMessage !== null) {
            showSnackbar(storedSuccessMessage, AppSnackbarSeverity.Success)
        }
    }, [showSnackbar])

    return (
        <>
            <Grid item marginBottom={2} marginLeft={-1} marginTop={1}>
                <IconButton component={Link} href='/role' sx={{ paddingBottom: '-1' }}>
                    <AddIcon /><Typography variant='body2'>Add Role</Typography>
                </IconButton>
            </Grid>
            <Stack spacing={3}>
                <TextFilter
                    label="Search Text"
                    searchText={searchText}
                    setSearchText={setSearchText}
                />
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {ROLE_SORT_COLUMNS.map(({ label, column }) => {
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
                                                onClick={() => handleSort(column)}
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
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginationResult.Items.map(role => (
                                <TableRow key={role.Guid}>
                                    <TableCell>
                                        <Link href={`/role/${role.Guid}`}>{role.Guid}</Link>
                                    </TableCell>
                                    <TableCell>{role.Name}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Paginator paginationResult={paginationResult} setPage={setPage} />
            </Stack>
        </>
    )
}

export default Roles
