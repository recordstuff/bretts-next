'use client'

import React, { ErrorInfo } from "react";
import { AxiosError } from "axios";
import { HTTP_STATUS_CODES } from "../clients/HttpClient";
import { Typography } from "@mui/material";

interface Props {
    children?: React.ReactNode
}

interface State {
    hasError: boolean
    suppressMessage : boolean
    message: string
    name: string
}

class ErrorBoundary extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, suppressMessage: false, message: '', name: '' };
    }

    public static getDerivedStateFromError(error: Error) {
        return { hasError: true, supressMessage: false, message: error.message, name: error.name }
    }

    public componentDidMount(): void {
        window.addEventListener('error', (event: ErrorEvent) => {
            this.setState({ hasError: true, suppressMessage: false, message: event.message, name: 'Error' })
        });

        window.addEventListener("unhandledrejection", (event: PromiseRejectionEvent) => {
            const suppressMessage = event.reason instanceof AxiosError 
                                 && event.reason.response?.status === HTTP_STATUS_CODES.FORBIDDEN

            this.setState({ hasError: true, suppressMessage, message: event.reason.toString(), name: event.type })
        });
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {

            if (this.state.suppressMessage)
                return <></>
            
            return (
                <>
                    <Typography variant='h1'>Unfortunate Occurance</Typography>
                    <Typography paragraph>The application experienced a problem.</Typography>
                    <Typography paragraph>Unhandled Error {this.state.name !== "Error" ? `: ${this.state.name}` : ''}</Typography>
                    <Typography paragraph>{this.state.message}</Typography>
                </>
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary