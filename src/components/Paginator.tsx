import { Dispatch, FC, SetStateAction } from 'react';
import { Pagination, Stack, Typography } from '@mui/material';
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
        <Stack spacing={2} sx={{
            alignItems: 'center'
        }}>
            <Typography>Page {paginationResult.Page} of {paginationResult.PageCount}</Typography>
            <Pagination
                count={paginationResult.PageCount}
                showFirstButton
                showLastButton
                onChange={handleChange}
            />
        </Stack>
    );
}

export default Paginator
