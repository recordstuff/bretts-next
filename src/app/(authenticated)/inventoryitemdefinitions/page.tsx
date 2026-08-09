'use client'

import { inventoryItemDefinitionClient } from '@/clients/InventoryItemDefinitionClient'
import { LeftDrawerContext } from '@/components/LeftDrawerProvider'
import Paginator from '@/components/Paginator'
import { PleaseWaitContext } from '@/components/PleaseWaitProvider'
import SortableTableHeaders from '@/components/SortableTableHeaders'
import TextFilter from '@/components/TextFilter'
import { useAppSnackbar } from '@/components/AppSnackbarProvider'
import { AppSnackbarSeverity } from '@/models/AppSnackbarState'
import { InventoryItemDefinitionsSortColumn } from '@/models/InventoryItemDefinitionsSortColumn'
import { InventoryItemDefinitionSummary } from '@/models/InventoryItemDefinitionSummary'
import { emptyPaginationResult, PaginationResult } from '@/models/PaginationResult'
import { SortDirection } from '@/models/SortDirection'
import { takeSuccessMessage } from '@/utils/successMessageStorage'
import AddIcon from '@mui/icons-material/Add'
import { Box, Grid, IconButton, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import Link from 'next/link'
import { FC, useCallback, useContext, useEffect, useState } from 'react'

const PAGE_SIZE = 5
const SORT_COLUMNS = [
    {label: 'Id', column: InventoryItemDefinitionsSortColumn.Id},
    {label: 'Name', column: InventoryItemDefinitionsSortColumn.Name},
    {label: 'Description', column: InventoryItemDefinitionsSortColumn.Description},
    {label: 'Attributes', column: InventoryItemDefinitionsSortColumn.AttributeCount},
    {label: 'Components', column: InventoryItemDefinitionsSortColumn.ComponentCount},
] as const

const InventoryItemDefinitions: FC = () => {
    const [paginationResult, setPaginationResult] = useState<PaginationResult<InventoryItemDefinitionSummary>>(emptyPaginationResult())
    const [page, setPage] = useState(1)
    const [searchText, setSearchText] = useState('')
    const [sortColumn, setSortColumn] = useState(InventoryItemDefinitionsSortColumn.Name)
    const [sortDirection, setSortDirection] = useState(SortDirection.Ascending)
    const {showSnackbar} = useAppSnackbar()
    const {actions: {pleaseWait, doneWaiting}} = useContext(PleaseWaitContext)
    const {firstBreadcrumb, setPageTitle} = useContext(LeftDrawerContext)

    const getDefinitions = useCallback(async (): Promise<void> => {
        pleaseWait()

        const response = await inventoryItemDefinitionClient.getInventoryItemDefinitions(
            page,
            PAGE_SIZE,
            searchText,
            sortColumn,
            sortDirection
        )

        setPaginationResult(response)
        doneWaiting()
    }, [page, searchText, sortColumn, sortDirection, pleaseWait, doneWaiting])

    const handleSort = (column: InventoryItemDefinitionsSortColumn): void => {
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
        setPageTitle('Inventory Item Definitions')
        firstBreadcrumb({title: 'Inventory Item Definitions', url: '/inventoryitemdefinitions'})
        getDefinitions()
    }, [setPageTitle, firstBreadcrumb, getDefinitions])

    useEffect(() => {
        const storedSuccessMessage = takeSuccessMessage()

        if (storedSuccessMessage !== null) {
            showSnackbar(storedSuccessMessage, AppSnackbarSeverity.Success)
        }
    }, [showSnackbar])

    return (
        <>
            <Grid item marginBottom={2} marginLeft={-1} marginTop={1}>
                <IconButton component={Link} href="/inventoryitemdefinition" sx={{paddingBottom: '-1'}}>
                    <AddIcon /><Typography variant="body2">Add Inventory Definition</Typography>
                </IconButton>
            </Grid>
            <Stack spacing={3}>
                <Box sx={{maxWidth: '40rem'}}>
                    <TextFilter label="Search Text" searchText={searchText} setSearchText={setSearchText} />
                </Box>
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
                                <TableRow>
                                    <TableCell colSpan={5}>No inventory item definitions were found.</TableCell>
                                </TableRow>
                            )}
                            {paginationResult.Items.map(definition => (
                                <TableRow key={definition.Guid}>
                                    <TableCell>
                                        <Link className="entity-id-link" href={`/inventoryitemdefinition/${definition.Guid}`}>
                                            {definition.Guid}
                                        </Link>
                                    </TableCell>
                                    <TableCell>{definition.Name}</TableCell>
                                    <TableCell>{definition.Description ?? '—'}</TableCell>
                                    <TableCell>{definition.AttributeCount}</TableCell>
                                    <TableCell>{definition.ComponentCount}</TableCell>
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

export default InventoryItemDefinitions
