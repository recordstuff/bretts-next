'use client'

import { TableBody, TableCell, TableRow } from '@mui/material'
import { LeftDrawerContext } from '@/components/LeftDrawerProvider'
import PaginatedEntityList from '@/components/PaginatedEntityList'
import { PleaseWaitContext } from '@/components/PleaseWaitProvider'
import TextFilter from '@/components/TextFilter'
import { roleClient } from '@/clients/RoleClient'
import { NameGuidPair } from '@/models/NameGuidPair'
import { emptyPaginationResult, PaginationResult } from '@/models/PaginationResult'
import { RolesSortColumn } from '@/models/RolesSortColumn'
import SortableTableHead from '@/components/SortableTableHead'
import { useTableSort } from '@/hooks/useTableSort'
import { DEFAULT_PAGE_SIZE } from '@/constants/pagination'
import Link from 'next/link'
import { FC, useCallback, useContext, useEffect, useState } from 'react'

const ROLE_SORT_COLUMNS = [
    { label: 'Id', column: RolesSortColumn.Id },
    { label: 'Name', column: RolesSortColumn.Name },
] as const

const Roles: FC = () => {
    const [paginationResult, setPaginationResult] = useState<PaginationResult<NameGuidPair>>(emptyPaginationResult())
    const [page, setPage] = useState(1)
    const [searchText, setSearchText] = useState('')
    const { handleSort, sortColumn, sortDirection } = useTableSort(RolesSortColumn.Name, setPage)
    const { actions: { pleaseWait, doneWaiting } } = useContext(PleaseWaitContext)
    const { firstBreadcrumb, setPageTitle } = useContext(LeftDrawerContext)

    const getRoles = useCallback(async (): Promise<void> => {
        pleaseWait()

        const response = await roleClient.getRoles(
            page,
            DEFAULT_PAGE_SIZE,
            searchText,
            sortColumn,
            sortDirection
        )

        setPaginationResult(response)
        doneWaiting()
    }, [page, searchText, sortColumn, sortDirection, pleaseWait, doneWaiting])

    useEffect(() => {
        setPageTitle('Roles')
        firstBreadcrumb({ title: 'Roles', url: '/roles' })
        getRoles()
    }, [setPageTitle, firstBreadcrumb, getRoles])

    return (
        <PaginatedEntityList
            addHref="/role"
            addLabel="Add Role"
            filters={(
                <TextFilter
                    label="Search Text"
                    searchText={searchText}
                    setSearchText={setSearchText}
                />
            )}
            paginationResult={paginationResult}
            setPage={setPage}
        >
            <SortableTableHead
                columns={ROLE_SORT_COLUMNS}
                onSort={handleSort}
                sortColumn={sortColumn}
                sortDirection={sortDirection}
            />
            <TableBody>
                {paginationResult.Items.map(role => (
                    <TableRow key={role.Guid}>
                        <TableCell>
                            <Link className="entity-id-link" href={`/role/${role.Guid}`}>{role.Guid}</Link>
                        </TableCell>
                        <TableCell>{role.Name}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </PaginatedEntityList>
    )
}

export default Roles
