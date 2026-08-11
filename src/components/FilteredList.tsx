'use client'

import { FC, MouseEvent, useState } from 'react';
import { Box, List, ListItemButton } from '@mui/material';
import TextFilter from './TextFilter';
import { NameGuidPair } from '../models/NameGuidPair';

export interface Props {
    label: string
    items: NameGuidPair[]
    handleClick: (event: MouseEvent<HTMLElement>) => void
}

const FilteredList: FC<Props> = ({ label, items, handleClick }) => {
    const [searchText, setSearchText] = useState('')

    return (
        <Box
            sx={{
                border: '1px solid',
                borderColor: 'secondary.main',
                borderRadius: 1,
                minHeight: '9rem',
                overflow: 'hidden',
            }}
        >
            <TextFilter
                label={`Filter ${label}`} searchText={searchText} setSearchText={setSearchText} />
            <List sx={{ paddingY: .5 }}>
                {items.map((item) => (
                    (searchText.length === 0 || item.Name.toLowerCase().includes(searchText.toLowerCase()))
                    && <ListItemButton
                        onClick={handleClick}
                        key={item.Guid}>
                        {item.Name}
                    </ListItemButton>))}
            </List>
        </Box>
    )
}

export default FilteredList
