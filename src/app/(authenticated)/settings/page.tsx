'use client'

import { LeftDrawerContext } from "@/components/LeftDrawerProvider"
import { testClient } from "@/clients/TestClient"
import { Button, Stack, Typography } from "@mui/material"
import { alpha } from "@mui/material/styles"
import { FC, useContext, useEffect } from "react"

const Settings: FC = () => {
    const { firstBreadcrumb, setPageTitle } = useContext(LeftDrawerContext)

    useEffect(() => {
        setPageTitle('Settings')
        firstBreadcrumb({title:'Settings', url: 'settings'})
    }, [setPageTitle, firstBreadcrumb])

    const throwError = async (): Promise<void> => {
        await testClient.throwError()
    }

    const writeLogEntry = async (): Promise<void> => {
        await testClient.writeLogEntry()
    }

    const shutdown = async (): Promise<void> => {
        await testClient.shutdown()
    }
    
    return (
        <Stack spacing={2}>
            <Typography>Administrators are fancier than average people.</Typography>
            <Stack
                alignItems={{ xs: 'stretch', sm: 'center' }}
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
            >
                <Typography>Write a test log entry:</Typography>
                <Button onClick={writeLogEntry} variant="contained">Write Log Entry</Button>
            </Stack>
            <Stack
                alignItems={{ xs: 'stretch', sm: 'center' }}
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
            >
                <Typography>Test the global exception handler:</Typography>
                <Button onClick={throwError} variant="contained">Throw Error</Button>
            </Stack>
            <Stack
                alignItems={{ xs: 'stretch', sm: 'center' }}
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
            >
                <Typography>I don&apos;t mind. This is a sandbox. If anyone really does attack me, I&apos;ll hide it.</Typography>
                <Button
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
            </Stack>
        </Stack>
    )
}

export default Settings
