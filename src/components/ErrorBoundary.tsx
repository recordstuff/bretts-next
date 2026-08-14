'use client'

import React, { ErrorInfo } from "react";
import { HTTP_STATUS_CODES, isHttpStatusError } from "../clients/HttpClient";
import { Box, Paper, Stack, Typography } from "@mui/material";

interface Props {
    children?: React.ReactNode
}

interface State {
    hasError: boolean
    suppressMessage: boolean
    message: string
    name: string
}

class ErrorBoundary extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, suppressMessage: false, message: '', name: '' };
    }

    public static getDerivedStateFromError(error: Error) {
        return { hasError: true, suppressMessage: false, message: error.message, name: error.name }
    }

    public componentDidMount(): void {
        window.addEventListener('error', this.handleError);
        window.addEventListener('unhandledrejection', this.handleUnhandledRejection);
    }

    public componentWillUnmount(): void {
        window.removeEventListener('error', this.handleError);
        window.removeEventListener('unhandledrejection', this.handleUnhandledRejection);
    }

    private readonly handleError = (event: ErrorEvent): void => {
        const error = event.error instanceof Error ? event.error : null

        this.setState({
            hasError: true,
            suppressMessage: false,
            message: event.message || error?.message || 'Unknown error',
            name: error?.name ?? 'Error',
        })
    }

    private readonly handleUnhandledRejection = (event: PromiseRejectionEvent): void => {
        const suppressMessage = isHttpStatusError(event.reason, HTTP_STATUS_CODES.FORBIDDEN)
        const reason = event.reason instanceof Error ? event.reason : null

        this.setState({
            hasError: true,
            suppressMessage,
            message: reason?.message ?? String(event.reason),
            name: reason?.name ?? event.type,
        })
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {

            if (this.state.suppressMessage)
                return <></>
            
            return (
                <Box
                    component="main"
                    role="alert"
                    sx={{
                        alignItems: 'center',
                        bgcolor: 'background.default',
                        boxSizing: 'border-box',
                        display: 'flex',
                        justifyContent: 'center',
                        minHeight: '100dvh',
                        p: { xs: 2, sm: 3 },
                    }}
                >
                    <Paper
                        variant="outlined"
                        sx={{
                            borderColor: 'primary.main',
                            borderRadius: 2,
                            borderWidth: 2,
                            boxShadow: 8,
                            maxWidth: '48rem',
                            p: { xs: 3, sm: 6 },
                            width: '100%',
                        }}
                    >
                        <Stack spacing={2}>
                            <Typography component="h1" variant="h2">Unfortunate Occurrence</Typography>
                            <Typography>The application experienced a problem.</Typography>
                            <Typography>{`Unhandled Error${this.state.name !== "Error" ? `: ${this.state.name}` : ''}`}</Typography>
                            <Typography sx={{ overflowWrap: 'anywhere' }}>{this.state.message}</Typography>
                        </Stack>
                    </Paper>
                </Box>
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary
