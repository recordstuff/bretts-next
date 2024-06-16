import { Dispatch, FC, SetStateAction } from 'react';
import { Grid, Pagination, Typography } from '@mui/material';
import { PaginationResult } from '../models/PaginationResult';

export interface Props {
    paginationResult: PaginationResult<object>
    setPage: Dispatch<SetStateAction<number>>
}

const Paginator: FC<Props> = ({ paginationResult, setPage }) => {

    const handleChange = (_: React.ChangeEvent<unknown>, value: number) => {
        setPage(value)
    }

    return (
        <Grid container direction='column' alignItems='center'>
            <Grid item>
                <Typography>Page {paginationResult.Page} of {paginationResult.PageCount}</Typography>
            </Grid>
            <Grid item paddingTop={2}>
                <Pagination
                    count={paginationResult.PageCount}
                    showFirstButton
                    showLastButton
                    onChange={handleChange}
                />
            </Grid>
        </Grid>
    )
}

export default Paginator