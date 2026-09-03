import { Dispatch, FC, SetStateAction } from 'react';
import { Grid, Pagination, Stack, Typography } from '@mui/material';
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
        <Stack sx={{
            alignItems: 'center'
        }}>
            <Grid>
                <Typography>Page {paginationResult.Page} of {paginationResult.PageCount}</Typography>
            </Grid>
            <Grid
                sx={{
                    paddingTop: 2
                }}>
                <Pagination
                    count={paginationResult.PageCount}
                    showFirstButton
                    showLastButton
                    onChange={handleChange}
                />
            </Grid>
        </Stack>
    );
}

export default Paginator