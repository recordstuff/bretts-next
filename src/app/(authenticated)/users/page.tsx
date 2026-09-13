'use client'

import { FC, useCallback, useContext, useEffect, useState } from "react"
import { userClient } from "../../../clients/UserClient"
import { PaginationResult, emptyPaginationResult } from "../../../models/PaginationResult"
import { UserSummary } from "../../../models/UserSummary"
import { TableBody, TableCell, TableRow } from "@mui/material"
import { JwtRole } from "../../../models/Jwt"
import Link from "next/link"
import TwoElementGuide from "@/components/TwoElementGuide"
import TextFilter from "@/components/TextFilter"
import OptionFilter from "@/components/OptionFilter"
import { PleaseWaitContext } from "@/components/PleaseWaitProvider"
import { LeftDrawerContext } from "@/components/LeftDrawerProvider"
import { UsersSortColumn } from "@/models/UsersSortColumn"
import PaginatedEntityList from "@/components/PaginatedEntityList"
import SortableTableHead from "@/components/SortableTableHead"
import { useTableSort } from "@/hooks/useTableSort"
import { DEFAULT_PAGE_SIZE } from "@/constants/pagination"

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
    const { handleSort, sortColumn, sortDirection } = useTableSort(UsersSortColumn.DisplayName, setPage)
    const { actions: {waitFor} } = useContext(PleaseWaitContext)
    const { firstBreadcrumb, setPageTitle } = useContext(LeftDrawerContext)

    const getUsers = useCallback(async (): Promise<void> => {
        const response = await waitFor(() => userClient.getUsers(
            page,
            DEFAULT_PAGE_SIZE,
            searchText,
            roleFilter,
            sortColumn,
            sortDirection
        ))

        setPaginationResult(response)
    }, [page, searchText, roleFilter, sortColumn, sortDirection, waitFor])

    useEffect(() => {
        setPageTitle('Users')
        firstBreadcrumb({ title: 'Users', url: '/users' })
        // The response updates state after await; this rule misidentifies async loaders.
        // eslint-disable-next-line react-hooks/set-state-in-effect -- https://github.com/react/react/issues/34905
        getUsers()
    }, [setPageTitle, firstBreadcrumb, getUsers])

    return (
        <PaginatedEntityList
            addHref="/user"
            addLabel="Add User"
            filters={(
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
            )}
            paginationResult={paginationResult}
            setPage={setPage}
        >
            <SortableTableHead
                columns={USER_SORT_COLUMNS}
                onSort={handleSort}
                sortColumn={sortColumn}
                sortDirection={sortDirection}
            />
            <TableBody>
                {paginationResult.Items.map(row => (
                    <TableRow key={row.Guid}>
                        <TableCell>
                            <Link className="entity-id-link" href={`/user/${row.Guid}`}>{row.Guid}</Link>
                        </TableCell>
                        <TableCell>{row.DisplayName}</TableCell>
                        <TableCell>{row.Email}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </PaginatedEntityList>
    )
}

export default Users
