'use client'

import { Box, TableBody, TableCell, TableRow, TextField } from '@mui/material'
import Link from 'next/link'
import LogAttributeFilters from '@/components/LogAttributeFilters'
import { DEFAULT_PAGE_SIZE } from '@/constants/pagination'
import { LeftDrawerContext } from '@/components/LeftDrawerProvider'
import PaginatedEntityList from '@/components/PaginatedEntityList'
import { PleaseWaitContext } from '@/components/PleaseWaitProvider'
import { emptyPaginationResult, PaginationResult } from '@/models/PaginationResult'
import { FC, useCallback, useContext, useEffect, useState } from 'react'
import { logClient } from '@/clients/LogClient'
import { LogAttributeFilter } from '@/models/LogAttributeFilter'
import { getLogEventLevelName, LOG_EVENT_LEVEL_OPTIONS, LogEventLevel } from '@/models/LogEventLevel'
import { logFilterNeedsValue } from '@/models/LogFilterOperator'
import { LogSummary } from '@/models/LogSummary'
import { NameValuePair } from '@/models/NameValuePair'
import { LogsSortColumn } from '@/models/LogsSortColumn'
import { SortDirection } from '@/models/SortDirection'
import OptionFilter from '@/components/OptionFilter'
import SortableTableHead from '@/components/SortableTableHead'
import { useTableSort } from '@/hooks/useTableSort'

const LOG_LEVEL_OPTIONS: NameValuePair<LogEventLevel | ''>[] = [
    { Name: 'Any', Value: '' },
    ...LOG_EVENT_LEVEL_OPTIONS,
]

const LOG_SORT_COLUMNS = [
    { label: 'Id', column: LogsSortColumn.Id },
    { label: 'Timestamp', column: LogsSortColumn.TimeStamp },
    { label: 'Level', column: LogsSortColumn.Level },
    { label: 'Message', column: LogsSortColumn.Message },
    { label: 'Source', column: LogsSortColumn.SourceContext },
] as const

const Logs: FC = () => {
    const [paginationResult, setPaginationResult] = useState<PaginationResult<LogSummary>>(emptyPaginationResult())
    const [page, setPage] = useState(1)
    const [searchText, setSearchText] = useState('')
    const [from, setFrom] = useState('')
    const [to, setTo] = useState('')
    const [level, setLevel] = useState<LogEventLevel | ''>('')
    const { handleSort, sortColumn, sortDirection } = useTableSort(
        LogsSortColumn.TimeStamp,
        setPage,
        SortDirection.Descending
    )
    const [attributes, setAttributes] = useState<string[]>([])
    const [attributeFilters, setAttributeFilters] = useState<LogAttributeFilter[]>([])
    const { actions: { waitFor } } = useContext(PleaseWaitContext)
    const { firstBreadcrumb, setPageTitle } = useContext(LeftDrawerContext)

    const getLogs = useCallback(async (): Promise<void> => {
        let fromValue = null
        let toValue = null
        let levelValue = null
        let searchTextValue = null

        if (from.length > 0) {
            fromValue = new Date(from).toISOString()
        }
        if (to.length > 0) {
            toValue = new Date(to).toISOString()
        }
        if (level !== '') {
            levelValue = level
        }
        if (searchText.trim().length > 0) {
            searchTextValue = searchText.trim()
        }

        const completeAttributeFilters = attributeFilters.filter(filter => {
            if (!logFilterNeedsValue(filter.Operator)) {
                return true
            }

            return filter.Value !== null && filter.Value.trim().length > 0
        })

        const response = await waitFor(() => logClient.getLogs({
                Page: page,
                PageSize: DEFAULT_PAGE_SIZE,
                SearchText: searchTextValue,
                From: fromValue,
                To: toValue,
                Level: levelValue,
                SortColumn: sortColumn,
                SortDirection: sortDirection,
                AttributeFilters: completeAttributeFilters,
            }))
        setPaginationResult(response)
    }, [page, searchText, from, to, level, sortColumn, sortDirection, attributeFilters, waitFor])

    useEffect(() => {
        setPageTitle('Log Viewer')
        firstBreadcrumb({ title: 'Log Viewer', url: '/logs' })
        logClient.getAttributes().then(setAttributes)
    }, [setPageTitle, firstBreadcrumb])

    useEffect(() => {
        // The response updates state after await; this rule misidentifies async loaders.
        // eslint-disable-next-line react-hooks/set-state-in-effect -- https://github.com/react/react/issues/34905
        getLogs()
    }, [getLogs])

    const updateLevel = (value: LogEventLevel | ''): void => {
        setLevel(value)
        setPage(1)
    }

    return (
        <PaginatedEntityList
            addHref="/log"
            addLabel="Add Log"
            filters={(
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' } }}>
                        <TextField
                            fullWidth
                            label="Text search"
                            onChange={event => { setSearchText(event.target.value); setPage(1) }}
                            value={searchText}
                        />
                        <OptionFilter
                            label="Level"
                            options={LOG_LEVEL_OPTIONS}
                            selectedValue={level}
                            setSelectedValue={updateLevel}
                        />
                    </Box>
                    <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
                        <TextField
                            label="From"
                            onChange={event => { setFrom(event.target.value); setPage(1) }}
                            slotProps={{ inputLabel: { shrink: true } }}
                            type="datetime-local"
                            value={from}
                        />
                        <TextField
                            label="To"
                            onChange={event => { setTo(event.target.value); setPage(1) }}
                            slotProps={{ inputLabel: { shrink: true } }}
                            type="datetime-local"
                            value={to}
                        />
                    </Box>
                    <LogAttributeFilters
                        attributes={attributes}
                        filters={attributeFilters}
                        onChange={filters => { setAttributeFilters(filters); setPage(1) }}
                    />
                </Box>
            )}
            paginationResult={paginationResult}
            setPage={setPage}
        >
            <SortableTableHead
                columns={LOG_SORT_COLUMNS}
                onSort={handleSort}
                sortColumn={sortColumn}
                sortDirection={sortDirection}
            />
            <TableBody>
                {paginationResult.Items.map(log => (
                    <TableRow key={log.Guid}>
                        <TableCell><Link className="entity-id-link" href={`/log/${log.Guid}`}>{log.Guid}</Link></TableCell>
                        <TableCell>{log.TimeStamp}</TableCell>
                        <TableCell>{getLogEventLevelName(log.Level)}</TableCell>
                        <TableCell>{log.Message}</TableCell>
                        <TableCell>{log.SourceContext}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </PaginatedEntityList>
    )
}

export default Logs
