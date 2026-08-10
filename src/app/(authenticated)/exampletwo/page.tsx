'use client'

import { LeftDrawerContext } from "@/components/LeftDrawerProvider"
import { Grid, TextField, Typography } from "@mui/material"
import { FC, useContext, useEffect } from "react"

const ExampleTwo: FC = () => {
    const { firstBreadcrumb, setPageTitle } = useContext(LeftDrawerContext)

    useEffect(() => {
        setPageTitle('Example Two')
        firstBreadcrumb({title:'Example Two', url: 'exampletwo'})
    }, [setPageTitle, firstBreadcrumb])

    return (
        <>
            <Grid container spacing={2} marginTop={.1}>
                <Grid item lg={12} xl={10}>
                    <Typography variant="h6">First Set of Fields</Typography>
                </Grid>
                <Grid item xs={12} lg={6} xl={5}>
                    <TextField fullWidth label="Field 1" />
                </Grid>
                <Grid item xs={12} lg={6} xl={5}>
                    <TextField fullWidth label="Field 2" />
                </Grid>
                <Grid item xs={12} lg={6} xl={5}>
                    <TextField fullWidth label="Field 3" />
                </Grid>
                <Grid item xs={12} lg={6} xl={5}>
                    <TextField fullWidth label="Field 4" />
                </Grid>
                <Grid item xs={12} lg={6} xl={5}>
                    <TextField fullWidth label="Field 5" />
                </Grid>
                <Grid item xs={12} lg={6} xl={5}>
                    <TextField fullWidth label="Field 6" />
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid item lg={12} xl={10} marginTop={4}>
                    <Typography variant="h6">Second Set of Fields</Typography>
                </Grid>
                <Grid item xs={12} lg={6} xl={5}>
                    <TextField fullWidth label="Set 2 Field 1" />
                </Grid>
                <Grid item xs={12} lg={6} xl={5}>
                    <TextField fullWidth label="Set 2 Field 2" />
                </Grid>
                <Grid item xs={12} lg={6} xl={5}>
                    <TextField fullWidth label="Set 2 Field 3" />
                </Grid>
                <Grid item xs={12} lg={6} xl={5}>
                    <TextField fullWidth label="Set 2 Field 4" />
                </Grid>
                <Grid item xs={12} lg={6} xl={5}>
                    <TextField fullWidth label="Set 2 Field 5" />
                </Grid>
                <Grid item xs={12} lg={6} xl={5}>
                    <TextField fullWidth label="Set 2 Field 6" />
                </Grid>
            </Grid>
        </>
    )
}

export default ExampleTwo