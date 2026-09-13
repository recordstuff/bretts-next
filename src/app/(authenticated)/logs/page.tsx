'use client'

import { Box, TableBody, TableCell, TableHead, TableRow, TextField } from '@mui/material'
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
import { LogEntry } from '@/models/LogEntry'
import { logFilterNeedsValue } from '@/models/LogFilterOperator'
import { SortDirection } from '@/models/SortDirection'
import { LogLevel } from '@/models/LogLevel'
import OptionFilter from '@/components/OptionFilter'

const LOG_LEVEL_OPTIONS = [
    { Name: 'Any', Value: '' },
    ...Object.values(LogLevel).map(logLevel => ({ Name: logLevel, Value: logLevel })),
]

const LOG_ORDER_OPTIONS = [
    { Name: 'Newest first', Value: SortDirection.Descending },
    { Name: 'Oldest first', Value: SortDirection.Ascending },
]

const Logs: FC = () => {
    const [paginationResult, setPaginationResult] = useState<PaginationResult<LogEntry>>(emptyPaginationResult())
    const [page, setPage] = useState(1)
    const [searchText, setSearchText] = useState('')
    const [from, setFrom] = useState('')
    const [to, setTo] = useState('')
    const [level, setLevel] = useState('')
    const [sortDirection, setSortDirection] = useState(SortDirection.Descending)
    const [attributes, setAttributes] = useState<string[]>([])
    const [attributeFilters, setAttributeFilters] = useState<LogAttributeFilter[]>([])
    const { actions: { pleaseWait, doneWaiting } } = useContext(PleaseWaitContext)
    const { firstBreadcrumb, setPageTitle } = useContext(LeftDrawerContext)

    const getLogs = useCallback(async (): Promise<void> => {
        pleaseWait()
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
        if (level.length > 0) {
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

        const response = await logClient.getLogs({
            Page: page,
            PageSize: DEFAULT_PAGE_SIZE,
            SearchText: searchTextValue,
            From: fromValue,
            To: toValue,
            Level: levelValue,
            SortDirection: sortDirection,
            AttributeFilters: completeAttributeFilters,
        })
        setPaginationResult(response)
        doneWaiting()
    }, [page, searchText, from, to, level, sortDirection, attributeFilters, pleaseWait, doneWaiting])

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

    const updateLevel = (value: string): void => {
        setLevel(value)
        setPage(1)
    }

    const updateSortDirection = (value: SortDirection): void => {
        setSortDirection(value)
        setPage(1)
    }

    return (
        <PaginatedEntityList
            addHref="/log"
            addLabel="Add Log"
            filters={(
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '2fr 1fr 1fr' } }}>
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
                        <OptionFilter
                            label="Order"
                            options={LOG_ORDER_OPTIONS}
                            selectedValue={sortDirection}
                            setSelectedValue={updateSortDirection}
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
            <TableHead>
                <TableRow>
                    <TableCell>Id</TableCell>
                    <TableCell>Timestamp</TableCell>
                    <TableCell>Level</TableCell>
                    <TableCell>Message</TableCell>
                    <TableCell>Source</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {paginationResult.Items.map(log => (
                    <TableRow key={log.Id}>
                        <TableCell><Link className="entity-id-link" href={`/log/${log.Id}`}>{log.Id}</Link></TableCell>
                        <TableCell>{log.TimeStamp}</TableCell>
                        <TableCell>{log.Level}</TableCell>
                        <TableCell>{log.Message}</TableCell>
                        <TableCell>{log.SourceContext}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </PaginatedEntityList>
    )
}

export default Logs
