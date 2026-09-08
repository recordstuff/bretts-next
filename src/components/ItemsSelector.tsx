'use client'

import { Dispatch, FC, MouseEvent, SetStateAction } from 'react';
import { NameGuidPair } from '../models/NameGuidPair';
import FilteredList from './FilteredList';
import { Box, Button, Grid, Stack, Typography } from '@mui/material';

export interface Props {
    allItems: NameGuidPair[]
    label: string
    selected: NameGuidPair[]
    setSelected: Dispatch<SetStateAction<NameGuidPair[]>>,
}

const ItemsSelector: FC<Props> = ({ allItems, label, selected, setSelected }) => {

    const available = allItems.filter(item => !selected.some(selection => selection.Guid === item.Guid))

    const handleClickSelect = (event: MouseEvent<HTMLElement>): void => {
        const clickedName = event.currentTarget.textContent
        const clicked = available.find(item => item.Name === clickedName)

        if (clicked === undefined) return

        setSelected([...selected, clicked]
            .sort((a, b) => a.Name.localeCompare(b.Name)))
    }

    const handleClickDeselect = (event: MouseEvent<HTMLElement>): void => {
        setSelected(selected.filter(item => item.Name !== event.currentTarget.textContent))
    }

    const handleClickSelectAll = (): void => {
        setSelected(allItems);
    }

    const handleClickDeselectAll = (): void => {
        setSelected([]);
    }

    return (
        <Box
            component='fieldset'
            sx={{
                border: '1px solid',
                borderColor: 'primary.light',
                borderRadius: 1,
                margin: 0,
                minWidth: 0,
                padding: 2,
            }}
        >
            <Typography
                component='legend'
                sx={{
                    color: 'text.primary',
                    fontWeight: 500,
                    paddingX: .75
                }}>{label}</Typography>
            <Grid container direction='row'>
                <Grid
                    size={{
                        sm: 12,
                        md: 5
                    }}>
                    <FilteredList
                        label='Selected'
                        items={selected}
                        handleClick={handleClickDeselect}
                    />
                </Grid>
                <Grid
                    size={{
                        sm: 12,
                        md: 2
                    }}>
                    <Stack spacing={2} sx={{
                        padding: 2
                    }}>
                        <Button onClick={handleClickSelectAll} variant='outlined'>{'<<'}</Button>
                        <Button onClick={handleClickDeselectAll} variant='outlined'>{'>>'}</Button>
                    </Stack>
                </Grid>
                <Grid
                    size={{
                        sm: 12,
                        md: 5
                    }}>
                    <FilteredList
                        label='Available'
                        items={available}
                        handleClick={handleClickSelect}
                    />
                </Grid>
            </Grid>
        </Box>
    );
}

export default ItemsSelector
