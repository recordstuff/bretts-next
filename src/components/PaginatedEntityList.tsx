import AddIcon from '@mui/icons-material/Add'
import { IconButton, Paper, Table, TableContainer, Typography } from '@mui/material'
import { Dispatch, ReactElement, ReactNode, SetStateAction } from 'react'
import { PaginationResult } from '@/models/PaginationResult'
import Paginator from '@/components/Paginator'
import Link from 'next/link'
import styles from './PaginatedEntityList.module.css'

interface PaginatedEntityListProps<TEntity extends object> {
    addHref: string
    addLabel: string
    children: ReactNode
    filters: ReactNode
    paginationResult: PaginationResult<TEntity>
    setPage: Dispatch<SetStateAction<number>>
}

const PaginatedEntityList = <TEntity extends object>({
    addHref,
    addLabel,
    children,
    filters,
    paginationResult,
    setPage,
}: PaginatedEntityListProps<TEntity>): ReactElement => (
    <>
        <div className={styles.addLink}>
            <IconButton component={Link} href={addHref} aria-label={addLabel}>
                <AddIcon />
                <Typography variant="body2">{addLabel}</Typography>
            </IconButton>
        </div>
        <div className={styles.content}>
            {filters}
            <TableContainer component={Paper}>
                <Table>{children}</Table>
            </TableContainer>
            <Paginator paginationResult={paginationResult} setPage={setPage} />
        </div>
    </>
)

export default PaginatedEntityList
