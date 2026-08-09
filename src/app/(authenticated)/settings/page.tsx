'use client'

import { LeftDrawerContext } from "@/components/LeftDrawerProvider"
import { testClient } from "@/clients/TestClient"
import AppSnackbar from "@/components/AppSnackbar"
import { Button, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import { alpha } from "@mui/material/styles"
import { FC, useContext, useEffect } from "react"
import { useAppSnackbar } from "@/hooks/useAppSnackbar"
import { AppSnackbarSeverity } from "@/models/AppSnackbarState"

const Settings: FC = () => {
    const {snackbar, showSnackbar, closeSnackbar} = useAppSnackbar()
    const { firstBreadcrumb, setPageTitle } = useContext(LeftDrawerContext)

    useEffect(() => {
        setPageTitle('Settings')
        firstBreadcrumb({title:'Settings', url: 'settings'})
    }, [setPageTitle, firstBreadcrumb])

    const throwError = async (): Promise<void> => {
        await testClient.throwError()
    }

    const writeLogEntry = async (): Promise<void> => {
        try {
            await testClient.writeLogEntry()
            showSnackbar('The test log entry was written.', AppSnackbarSeverity.Success)
        } catch {
            showSnackbar('The test log entry could not be written.', AppSnackbarSeverity.Error)
        }
    }

    const shutdown = async (): Promise<void> => {
        try {
            await testClient.shutdown()
            showSnackbar('The backend shutdown was requested.', AppSnackbarSeverity.Success)
        } catch {
            showSnackbar('The backend shutdown could not be requested.', AppSnackbarSeverity.Error)
        }
    }
    
    return (
        <Stack spacing={2}>
            <Typography>Administrators are fancier than average people.</Typography>
            <TableContainer component={Paper} sx={{ maxWidth: '56rem', mx: 'auto', width: '100%' }}>
                <Table aria-label="Administrator tasks" sx={{ tableLayout: 'fixed' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ width: { xs: '52%', sm: '65%' } }}>Admin Task</TableCell>
                            <TableCell aria-label="Action" />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>Write a test log entry</TableCell>
                            <TableCell><Button fullWidth onClick={writeLogEntry} variant="contained">Write Log Entry</Button></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Test the global exception handler</TableCell>
                            <TableCell><Button fullWidth onClick={throwError} variant="contained">Throw Error</Button></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>I don&apos;t mind. This is a sandbox. If anyone really does attack me, I&apos;ll hide it.</TableCell>
                            <TableCell>
                                <Button
                                    fullWidth
                                    onClick={shutdown}
                                    startIcon={<span aria-hidden="true">😈</span>}
                                    variant="contained"
                                    sx={(theme) => ({
                                        background: `linear-gradient(135deg, ${theme.palette.error.dark} 0%, ${theme.palette.error.main} 52%, ${theme.palette.error.light} 100%)`,
                                        border: `1px solid ${theme.palette.error.light}`,
                                        boxShadow: `0 0 0.8rem ${alpha(theme.palette.error.main, 0.55)}, 0 0.4rem 0.8rem ${alpha(theme.palette.error.dark, 0.35)}`,
                                        color: theme.palette.common.white,
                                        fontWeight: 700,
                                        letterSpacing: '0.025em',
                                        lineHeight: 1.3,
                                        whiteSpace: 'normal',
                                        transition: 'background 140ms ease, box-shadow 140ms ease, transform 100ms ease',
                                        '&:hover': {
                                            background: `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.error.light} 52%, ${theme.palette.error.main} 100%)`,
                                            boxShadow: `0 0 1.1rem ${alpha(theme.palette.error.light, 0.75)}, 0 0.55rem 1rem ${alpha(theme.palette.error.dark, 0.45)}`,
                                            transform: 'translateY(-1px)',
                                        },
                                        '&:active': {
                                            background: `linear-gradient(135deg, ${theme.palette.error.dark} 0%, ${theme.palette.error.main} 60%, ${theme.palette.error.dark} 100%)`,
                                            boxShadow: `0 0 0.45rem ${alpha(theme.palette.error.dark, 0.65)}`,
                                            transform: 'translateY(1px)',
                                        },
                                    })}
                                >
                                    Shutdown the Backend!!!
                                </Button>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <AppSnackbar
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={closeSnackbar}
            />
        </Stack>
    )
}

export default Settings
