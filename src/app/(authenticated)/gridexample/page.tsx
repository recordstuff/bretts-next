'use client'

import { LeftDrawerContext } from "@/components/LeftDrawerProvider"
import { Grid, Stack, TextField, Typography } from "@mui/material"
import { FC, useContext, useEffect } from "react"

const GridExample: FC = () => {
    const { firstBreadcrumb, setPageTitle } = useContext(LeftDrawerContext)

    useEffect(() => {
        setPageTitle('Grid Example')
        firstBreadcrumb({title:'Grid Example', url: 'gridexample'})
    }, [setPageTitle, firstBreadcrumb])

    return (
        <Grid container>
            <Grid
                sx={{
                    padding: 2
                }}
                size={{
                    xs: 12,
                    lg: 6,
                    xl: 5
                }}>
                <Stack spacing={2}>
                    <Typography variant="h6">Contact</Typography>
                    <TextField fullWidth label="Name" />
                    <TextField fullWidth label="Email" />
                    <TextField fullWidth label="Phone" />
                </Stack>
            </Grid>
            <Grid
                sx={{
                    padding: 2
                }}
                size={{
                    xs: 12,
                    lg: 6,
                    xl: 5
                }}>
                <Stack spacing={2}>
                    <Typography variant="h6">Address</Typography>
                    <TextField fullWidth label="Street" />
                    <TextField fullWidth label="City" />
                    <TextField fullWidth label="State" />
                    <TextField fullWidth label="Zip Code" />
                </Stack>
            </Grid>
        </Grid>
    );
}

export default GridExample