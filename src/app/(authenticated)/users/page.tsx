'use client'

import { FC, useCallback, useContext, useEffect, useState } from "react"
import { userClient } from "../../../clients/UserClient"
import { PaginationResult, emptyPaginationResult } from "../../../models/PaginationResult"
import { UserSummary } from "../../../models/UserSummary"
import { Grid, IconButton, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import { JwtRole } from "../../../models/Jwt"
import AddIcon from '@mui/icons-material/Add';
import Link from "next/link"
import TwoElementGuide from "@/components/TwoElementGuide"
import TextFilter from "@/components/TextFilter"
import OptionFilter from "@/components/OptionFilter"
import Paginator from "@/components/Paginator"
import { PleaseWaitContext } from "@/components/PleaseWaitProvider"

const PAGE_SIZE = 5

const Users: FC = () => {
    const [paginationResult, setPaginationResult] = useState<PaginationResult<UserSummary>>(emptyPaginationResult())
    const [page, setPage] = useState(1)
    const [searchText, setSearchText] = useState('')
    const [roleFilter, setRoleFilter] = useState<JwtRole>(JwtRole.Any)
    const { pleaseWait, doneWaiting } = useContext(PleaseWaitContext)

    const getUsers = useCallback(async (): Promise<void> => {
        pleaseWait()

        const response = await userClient.getUsers(page, PAGE_SIZE, searchText, roleFilter)

        setPaginationResult(response)

        doneWaiting()
    }, [page, searchText, roleFilter])

    useEffect(() => {
        //setPageTitle('Users')
        //dispatch(firstBreadcrumb({title:'Users', url: '/users'}))
        getUsers()
    }, [getUsers])

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
                                <TableCell>
                                    Id
                                </TableCell>
                                <TableCell>
                                    Display Name
                                </TableCell>
                                <TableCell>
                                    Email
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginationResult.Items.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <Link href={`/user/${row.Guid}`}>{row.Guid}</Link>
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
        </>
    )
}

export default Users
