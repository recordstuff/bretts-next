'use client'

import { Dispatch, FC, MouseEvent, SetStateAction, useEffect, useState } from 'react';
import { NameGuidPair } from '../models/NameGuidPair';
import FilteredList from './FilteredList';
import { Box, Button, Grid, Stack, Typography } from '@mui/material';

export interface Props {
    allItems: NameGuidPair[]
    initiallySelectedItems: NameGuidPair[]
    label: string
    selected: NameGuidPair[]
    setSelected: Dispatch<SetStateAction<NameGuidPair[]>>,
}

const ItemsSelector: FC<Props> = ({ allItems, initiallySelectedItems, label, selected, setSelected }) => {

    const [available, setAvailable] = useState<NameGuidPair[]>([])

    const handleClick = (event: MouseEvent<HTMLElement>, source: NameGuidPair[], setSource: Dispatch<SetStateAction<NameGuidPair[]>>, destination: NameGuidPair[], setDestination: Dispatch<SetStateAction<NameGuidPair[]>>): void => {
        const clickedName = event.currentTarget.textContent
        const clicked = source.find(s => s.Name === clickedName)

        if (clicked === undefined) return

        setSource(source.filter(s => s.Name !== clickedName))
        setDestination([...destination, clicked]
            .sort((a, b) => a.Name.localeCompare(b.Name)))
    }

    const handleClickSelect = (event: MouseEvent<HTMLElement>): void => {
        handleClick(event, available, setAvailable, selected, setSelected)
    }

    const handleClickDeselect = (event: MouseEvent<HTMLElement>): void => {
        handleClick(event, selected, setSelected, available, setAvailable)
    }

    const handleClickSelectAll = (): void => {
        setAvailable([])
        setSelected(allItems);
    }

    const handleClickDeselectAll = (): void => {
        setSelected([]);
        setAvailable(allItems)
    }

    useEffect(() => {
        setSelected(initiallySelectedItems)
        setAvailable(allItems.filter(ai => !initiallySelectedItems.some(isi => isi.Guid === ai.Guid)))
    }, [allItems, initiallySelectedItems, setSelected])

    return (
        <Box>
            <Typography paddingTop={1} paddingBottom={.5}>{label}</Typography>
            <Grid container direction='row'>
                <Grid item sm={12} md={5}>
                    <FilteredList
                        label='Selected'
                        items={selected}
                        handleClick={handleClickDeselect}
                    />
                </Grid>
                <Grid item sm={12} md={2}>
                    <Stack spacing={2} padding={2}>
                        <Button onClick={handleClickSelectAll} variant='outlined'>{'<<'}</Button>
                        <Button onClick={handleClickDeselectAll} variant='outlined'>{'>>'}</Button>
                    </Stack>
                </Grid>
                <Grid item sm={12} md={5}>
                    <FilteredList
                        label='Available'
                        items={available}
                        handleClick={handleClickSelect}
                    />
                </Grid>
            </Grid>
        </Box>
    )
}

export default ItemsSelector