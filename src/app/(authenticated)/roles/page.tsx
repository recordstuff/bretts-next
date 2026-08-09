'use client'

import { roleClient } from '@/clients/RoleClient'
import { useAppSnackbar } from '@/components/AppSnackbarProvider'
import { LeftDrawerContext } from '@/components/LeftDrawerProvider'
import Paginator from '@/components/Paginator'
import { PleaseWaitContext } from '@/components/PleaseWaitProvider'
import SortableTableHeaders from '@/components/SortableTableHeaders'
import TextFilter from '@/components/TextFilter'
import { AppSnackbarSeverity } from '@/models/AppSnackbarState'
import { emptyPaginationResult, PaginationResult } from '@/models/PaginationResult'
import { RoleSummary } from '@/models/RoleSummary'
import { RolesSortColumn } from '@/models/RolesSortColumn'
import { SortDirection } from '@/models/SortDirection'
import { takeSuccessMessage } from '@/utils/successMessageStorage'
import AddIcon from '@mui/icons-material/Add'
import { Box, Grid, IconButton, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import Link from 'next/link'
import { FC, useCallback, useContext, useEffect, useState } from 'react'

const PAGE_SIZE = 5
const SORT_COLUMNS = [
    {label: 'Id', column: RolesSortColumn.Id},
    {label: 'Name', column: RolesSortColumn.Name},
    {label: 'Users', column: RolesSortColumn.UserCount},
] as const

const Roles: FC = () => {
    const [paginationResult, setPaginationResult] = useState<PaginationResult<RoleSummary>>(emptyPaginationResult())
    const [page, setPage] = useState(1)
    const [searchText, setSearchText] = useState('')
    const [sortColumn, setSortColumn] = useState(RolesSortColumn.Name)
    const [sortDirection, setSortDirection] = useState(SortDirection.Ascending)
    const {showSnackbar} = useAppSnackbar()
    const {actions: {pleaseWait, doneWaiting}} = useContext(PleaseWaitContext)
    const {firstBreadcrumb, setPageTitle} = useContext(LeftDrawerContext)

    const getRoles = useCallback(async (): Promise<void> => {
        pleaseWait()
        setPaginationResult(await roleClient.getRoleItems(page, PAGE_SIZE, searchText, sortColumn, sortDirection))
        doneWaiting()
    }, [page, searchText, sortColumn, sortDirection, pleaseWait, doneWaiting])

    const handleSort = (column: RolesSortColumn): void => {
        setPage(1)
        if (column === sortColumn) {
            setSortDirection(sortDirection === SortDirection.Ascending
                ? SortDirection.Descending
                : SortDirection.Ascending)
            return
        }
        setSortColumn(column)
        setSortDirection(SortDirection.Ascending)
    }

    useEffect(() => {
        setPageTitle('Roles')
        firstBreadcrumb({title: 'Roles', url: '/roles'})
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
                <IconButton component={Link} href="/role" sx={{paddingBottom: '-1'}}>
                    <AddIcon /><Typography variant="body2">Add Role</Typography>
                </IconButton>
            </Grid>
            <Stack spacing={3}>
                <Box sx={{maxWidth: '40rem'}}>
                    <TextFilter label="Search Text" searchText={searchText} setSearchText={setSearchText} />
                </Box>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead><TableRow>
                            <SortableTableHeaders
                                columns={SORT_COLUMNS}
                                sortColumn={sortColumn}
                                sortDirection={sortDirection}
                                onSort={handleSort}
                            />
                        </TableRow></TableHead>
                        <TableBody>
                            {paginationResult.Items.length === 0 && (
                                <TableRow><TableCell colSpan={3}>No roles were found.</TableCell></TableRow>
                            )}
                            {paginationResult.Items.map(role => (
                                <TableRow key={role.Guid}>
                                    <TableCell><Link className="entity-id-link" href={`/role/${role.Guid}`}>{role.Guid}</Link></TableCell>
                                    <TableCell>{role.Name}</TableCell>
                                    <TableCell>{role.UserCount}</TableCell>
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
