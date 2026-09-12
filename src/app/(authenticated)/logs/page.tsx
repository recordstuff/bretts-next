'use client'

import { Box, FormControl, InputLabel, MenuItem, Select, TableBody, TableCell, TableHead, TableRow, TextField } from '@mui/material'
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

const LEVELS = ['Verbose', 'Debug', 'Information', 'Warning', 'Error', 'Fatal']

const Logs: FC = () => {
    const [paginationResult, setPaginationResult] = useState<PaginationResult<LogEntry>>(emptyPaginationResult())
    const [page, setPage] = useState(1)
    const [searchText, setSearchText] = useState('')
    const [from, setFrom] = useState('')
    const [to, setTo] = useState('')
    const [level, setLevel] = useState('')
    const [newestFirst, setNewestFirst] = useState(true)
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
            NewestFirst: newestFirst,
            AttributeFilters: completeAttributeFilters,
        })
        setPaginationResult(response)
        doneWaiting()
    }, [page, searchText, from, to, level, newestFirst, attributeFilters, pleaseWait, doneWaiting])

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

    const filtersChanged = (): void => {
        setPage(1)
    }

    let orderValue = 'oldest'
    if (newestFirst) {
        orderValue = 'newest'
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
                            onChange={event => { setSearchText(event.target.value); filtersChanged() }}
                            value={searchText}
                        />
                        <FormControl fullWidth>
                            <InputLabel id="log-level-label">Level</InputLabel>
                            <Select
                                label="Level"
                                labelId="log-level-label"
                                onChange={event => { setLevel(event.target.value); filtersChanged() }}
                                value={level}
                            >
                                <MenuItem value="">Any</MenuItem>
                                {LEVELS.map(logLevel => <MenuItem key={logLevel} value={logLevel}>{logLevel}</MenuItem>)}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel id="log-sort-label">Order</InputLabel>
                            <Select
                                label="Order"
                                labelId="log-sort-label"
                                onChange={event => { setNewestFirst(event.target.value === 'newest'); filtersChanged() }}
                                value={orderValue}
                            >
                                <MenuItem value="newest">Newest first</MenuItem>
                                <MenuItem value="oldest">Oldest first</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
                        <TextField
                            label="From"
                            onChange={event => { setFrom(event.target.value); filtersChanged() }}
                            slotProps={{ inputLabel: { shrink: true } }}
                            type="datetime-local"
                            value={from}
                        />
                        <TextField
                            label="To"
                            onChange={event => { setTo(event.target.value); filtersChanged() }}
                            slotProps={{ inputLabel: { shrink: true } }}
                            type="datetime-local"
                            value={to}
                        />
                    </Box>
                    <LogAttributeFilters
                        attributes={attributes}
                        filters={attributeFilters}
                        onChange={filters => { setAttributeFilters(filters); filtersChanged() }}
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
