'use client'

import { FC, useCallback, useContext, useEffect, useState } from "react"
import { userClient } from "../../../clients/UserClient"
import { PaginationResult, emptyPaginationResult } from "../../../models/PaginationResult"
import { UserSummary } from "../../../models/UserSummary"
import { Grid, IconButton, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Typography } from "@mui/material"
import { JwtRole } from "../../../models/Jwt"
import AddIcon from '@mui/icons-material/Add';
import Link from "next/link"
import TwoElementGuide from "@/components/TwoElementGuide"
import TextFilter from "@/components/TextFilter"
import OptionFilter from "@/components/OptionFilter"
import Paginator from "@/components/Paginator"
import { PleaseWaitContext } from "@/components/PleaseWaitProvider"
import { LeftDrawerContext } from "@/components/LeftDrawerProvider"
import AppSnackbar from "@/components/AppSnackbar"
import { takeSuccessMessage } from "@/utils/successMessageStorage"
import { UsersSortColumn } from "@/models/UsersSortColumn"
import { SortDirection } from "@/models/SortDirection"

const PAGE_SIZE = 5
const USER_SORT_COLUMNS = [
    { label: 'Id', column: UsersSortColumn.Id },
    { label: 'Display Name', column: UsersSortColumn.DisplayName },
    { label: 'Email', column: UsersSortColumn.Email },
] as const

const Users: FC = () => {
    const [paginationResult, setPaginationResult] = useState<PaginationResult<UserSummary>>(emptyPaginationResult())
    const [page, setPage] = useState(1)
    const [searchText, setSearchText] = useState('')
    const [roleFilter, setRoleFilter] = useState<JwtRole>(JwtRole.Any)
    const [sortColumn, setSortColumn] = useState<UsersSortColumn>(UsersSortColumn.DisplayName)
    const [sortDirection, setSortDirection] = useState<SortDirection>(SortDirection.Ascending)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)
    const { actions: {pleaseWait, doneWaiting} } = useContext(PleaseWaitContext)
    const { firstBreadcrumb, setPageTitle } = useContext(LeftDrawerContext)

    const getUsers = useCallback(async (): Promise<void> => {
        pleaseWait()

        const response = await userClient.getUsers(
            page,
            PAGE_SIZE,
            searchText,
            roleFilter,
            sortColumn,
            sortDirection
        )

        setPaginationResult(response)

        doneWaiting()
    }, [page, searchText, roleFilter, sortColumn, sortDirection, pleaseWait, doneWaiting])

    const handleSort = (column: UsersSortColumn): void => {
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
        setPageTitle('Users')
        firstBreadcrumb({ title: 'Users', url: '/users' })
        getUsers()
    }, [setPageTitle, firstBreadcrumb, getUsers])

    useEffect(() => {
        const storedSuccessMessage = takeSuccessMessage()

        if (storedSuccessMessage !== null) {
            setSuccessMessage(storedSuccessMessage)
        }
    }, [])

    return (
        <>
            <Grid item marginBottom={2} marginLeft={-1} marginTop={1}>
                <IconButton component={Link} href='/user' sx={{ paddingBottom: '-1' }}>
                    <AddIcon /><Typography variant='body2'>Add User</Typography>
                </IconButton>
            </Grid>
            <Stack spacing={3}>
                <TwoElementGuide
                    leftElement={<TextFilter
                        label="Search Text"
                        searchText={searchText}
                        setSearchText={setSearchText}

                    />
                    }
                    rightElement={<OptionFilter
                        label="Has Role"
                        options={[
                            { Name: 'Any', Value: JwtRole.Any },
                            { Name: 'User', Value: JwtRole.User },
                            { Name: 'Admin', Value: JwtRole.Admin },
                        ]}
                        selectedValue={roleFilter}
                        setSelectedValue={setRoleFilter}
                    />
                    } />
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {USER_SORT_COLUMNS.map(({ label, column }) => {
                                    const active = sortColumn === column
                                    const direction = sortDirection === SortDirection.Ascending ? 'asc' : 'desc'

                                    return (
                                        <TableCell key={column} sortDirection={active ? direction : false}>
                                            <TableSortLabel
                                                active={active}
                                                direction={active ? direction : 'asc'}
                                                onClick={() => handleSort(column)}
                                                sx={{
                                                    textDecoration: 'underline',
                                                    textDecorationThickness: '1px',
                                                    textUnderlineOffset: '0.2em',
                                                }}
                                            >
                                                {label}
                                            </TableSortLabel>
                                        </TableCell>
                                    )
                                })}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginationResult.Items.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <Link className="user-id-link" href={`/user/${row.Guid}`}>{row.Guid}</Link>
                                    </TableCell>
                                    <TableCell>
                                        {row.DisplayName}
                                    </TableCell>
                                    <TableCell>
                                        {row.Email}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Paginator
                    paginationResult={paginationResult}
                    setPage={setPage}
                />
            </Stack>
            <AppSnackbar
                message={successMessage}
                severity="success"
                onClose={() => setSuccessMessage(null)}
            />
        </>
    )
}

export default Users
