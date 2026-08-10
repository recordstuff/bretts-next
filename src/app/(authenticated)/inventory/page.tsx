'use client'

import { inventoryItemClient } from '@/clients/InventoryItemClient'
import { useAppSnackbar } from '@/components/AppSnackbarProvider'
import { LeftDrawerContext } from '@/components/LeftDrawerProvider'
import Paginator from '@/components/Paginator'
import { PleaseWaitContext } from '@/components/PleaseWaitProvider'
import SortableTableHeaders from '@/components/SortableTableHeaders'
import TextFilter from '@/components/TextFilter'
import { AppSnackbarSeverity } from '@/models/AppSnackbarState'
import { InventoryItemSummary } from '@/models/InventoryItemSummary'
import { InventoryItemsSortColumn } from '@/models/InventoryItemsSortColumn'
import { emptyPaginationResult, PaginationResult } from '@/models/PaginationResult'
import { SortDirection } from '@/models/SortDirection'
import { usePersistentBooleanState } from '@/hooks/usePersistentBooleanState'
import { takeSuccessMessage } from '@/utils/successMessageStorage'
import AddIcon from '@mui/icons-material/Add'
import { Box, Checkbox, FormControlLabel, Grid, IconButton, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import Link from 'next/link'
import { FC, useCallback, useContext, useEffect, useState } from 'react'

const PAGE_SIZE = 5
const TOP_LEVEL_ONLY_STORAGE_KEY = 'inventoryTopLevelOnly'
const SORT_COLUMNS = [
    {label: 'Id', column: InventoryItemsSortColumn.Id},
    {label: 'Definition', column: InventoryItemsSortColumn.Definition},
    {label: 'Serial Number', column: InventoryItemsSortColumn.SerialNumber},
    {label: 'Attribute Values', column: InventoryItemsSortColumn.AttributeValueCount},
] as const

const Inventory: FC = () => {
    const [paginationResult, setPaginationResult] = useState<PaginationResult<InventoryItemSummary>>(emptyPaginationResult())
    const [page, setPage] = useState(1)
    const [searchText, setSearchText] = useState('')
    const {
        isLoaded: topLevelOnlyIsLoaded,
        setValue: setTopLevelOnly,
        value: topLevelOnly,
    } = usePersistentBooleanState(TOP_LEVEL_ONLY_STORAGE_KEY, true)
    const [sortColumn, setSortColumn] = useState(InventoryItemsSortColumn.Definition)
    const [sortDirection, setSortDirection] = useState(SortDirection.Ascending)
    const {showSnackbar} = useAppSnackbar()
    const {actions: {pleaseWait, doneWaiting}} = useContext(PleaseWaitContext)
    const {firstBreadcrumb, setPageTitle} = useContext(LeftDrawerContext)

    const getInventory = useCallback(async (): Promise<void> => {
        if (!topLevelOnlyIsLoaded) return

        pleaseWait()
        const response = await inventoryItemClient.getInventoryItems(
            page,
            PAGE_SIZE,
            searchText,
            topLevelOnly,
            sortColumn,
            sortDirection
        )
        setPaginationResult(response)
        doneWaiting()
    }, [page, searchText, topLevelOnly, topLevelOnlyIsLoaded, sortColumn, sortDirection, pleaseWait, doneWaiting])

    const handleSort = (column: InventoryItemsSortColumn): void => {
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
        setPageTitle('Inventory')
        firstBreadcrumb({title: 'Inventory', url: '/inventory'})
        getInventory()
    }, [setPageTitle, firstBreadcrumb, getInventory])

    useEffect(() => {
        const storedSuccessMessage = takeSuccessMessage()
        if (storedSuccessMessage !== null) {
            showSnackbar(storedSuccessMessage, AppSnackbarSeverity.Success)
        }
    }, [showSnackbar])

    return (
        <>
            <Grid item marginBottom={2} marginLeft={-1} marginTop={1}>
                <IconButton component={Link} href="/inventoryitem" sx={{paddingBottom: '-1'}}>
                    <AddIcon /><Typography variant="body2">Add Inventory Item</Typography>
                </IconButton>
            </Grid>
            <Stack spacing={3}>
                <Stack
                    direction={{xs: 'column', sm: 'row'}}
                    spacing={{xs: 1, sm: 3}}
                    alignItems={{sm: 'center'}}
                    sx={{maxWidth: '60rem'}}
                >
                    <Box sx={{flex: 1, width: '100%'}}>
                        <TextFilter label="Search Text" searchText={searchText} setSearchText={setSearchText} />
                    </Box>
                    <FormControlLabel
                        control={<Checkbox
                            checked={topLevelOnly}
                            onChange={event => {
                                setPage(1)
                                setTopLevelOnly(event.target.checked)
                            }}
                        />}
                        label="Show Top-level Inventory Only"
                    />
                </Stack>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <SortableTableHeaders
                                    columns={SORT_COLUMNS}
                                    sortColumn={sortColumn}
                                    sortDirection={sortDirection}
                                    onSort={handleSort}
                                />
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginationResult.Items.length === 0 && (
                                <TableRow><TableCell colSpan={4}>No inventory items were found.</TableCell></TableRow>
                            )}
                            {paginationResult.Items.map(item => (
                                <TableRow key={item.Guid}>
                                    <TableCell>
                                        <Link className="entity-id-link" href={`/inventoryitem/${item.Guid}`}>{item.Guid}</Link>
                                    </TableCell>
                                    <TableCell>{item.InventoryItemDefinitionName}</TableCell>
                                    <TableCell>{item.SerialNumber ?? '—'}</TableCell>
                                    <TableCell>{item.AttributeValueCount}</TableCell>
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

export default Inventory
