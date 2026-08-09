'use client'

import { attributeDefinitionClient } from '@/clients/AttributeDefinitionClient'
import { useAppSnackbar } from '@/components/AppSnackbarProvider'
import { LeftDrawerContext } from '@/components/LeftDrawerProvider'
import Paginator from '@/components/Paginator'
import { PleaseWaitContext } from '@/components/PleaseWaitProvider'
import SortableTableHeaders from '@/components/SortableTableHeaders'
import TextFilter from '@/components/TextFilter'
import { AppSnackbarSeverity } from '@/models/AppSnackbarState'
import { attributeDataTypeLabel } from '@/models/AttributeDataType'
import { AttributeDefinitionSummary } from '@/models/AttributeDefinitionSummary'
import { AttributeDefinitionsSortColumn } from '@/models/AttributeDefinitionsSortColumn'
import { emptyPaginationResult, PaginationResult } from '@/models/PaginationResult'
import { SortDirection } from '@/models/SortDirection'
import { takeSuccessMessage } from '@/utils/successMessageStorage'
import AddIcon from '@mui/icons-material/Add'
import { Box, Grid, IconButton, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import Link from 'next/link'
import { FC, useCallback, useContext, useEffect, useState } from 'react'

const PAGE_SIZE = 5
const SORT_COLUMNS = [
    {label: 'Id', column: AttributeDefinitionsSortColumn.Id},
    {label: 'Name', column: AttributeDefinitionsSortColumn.Name},
    {label: 'Data Type', column: AttributeDefinitionsSortColumn.DataType},
] as const

const AttributeDefinitions: FC = () => {
    const [paginationResult, setPaginationResult] = useState<PaginationResult<AttributeDefinitionSummary>>(emptyPaginationResult())
    const [page, setPage] = useState(1)
    const [searchText, setSearchText] = useState('')
    const [sortColumn, setSortColumn] = useState(AttributeDefinitionsSortColumn.Name)
    const [sortDirection, setSortDirection] = useState(SortDirection.Ascending)
    const {showSnackbar} = useAppSnackbar()
    const {actions: {pleaseWait, doneWaiting}} = useContext(PleaseWaitContext)
    const {firstBreadcrumb, setPageTitle} = useContext(LeftDrawerContext)

    const getDefinitions = useCallback(async (): Promise<void> => {
        pleaseWait()

        const response = await attributeDefinitionClient.getAttributeDefinitions(
            page,
            PAGE_SIZE,
            searchText,
            sortColumn,
            sortDirection
        )

        setPaginationResult(response)
        doneWaiting()
    }, [page, searchText, sortColumn, sortDirection, pleaseWait, doneWaiting])

    const handleSort = (column: AttributeDefinitionsSortColumn): void => {
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
        setPageTitle('Attribute Definitions')
        firstBreadcrumb({title: 'Attribute Definitions', url: '/attributedefinitions'})
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
                <IconButton component={Link} href="/attributedefinition" sx={{paddingBottom: '-1'}}>
                    <AddIcon /><Typography variant="body2">Add Attribute Definition</Typography>
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
                                <TableCell>Inventory Definitions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginationResult.Items.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4}>No attribute definitions were found.</TableCell>
                                </TableRow>
                            )}
                            {paginationResult.Items.map(definition => (
                                <TableRow key={definition.Guid}>
                                    <TableCell>
                                        <Link className="entity-id-link" href={`/attributedefinition/${definition.Guid}`}>
                                            {definition.Guid}
                                        </Link>
                                    </TableCell>
                                    <TableCell>{definition.Name}</TableCell>
                                    <TableCell>{attributeDataTypeLabel(definition.DataType)}</TableCell>
                                    <TableCell>{definition.InventoryItemDefinitionCount}</TableCell>
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

export default AttributeDefinitions
