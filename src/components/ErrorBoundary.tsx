import React, { ErrorInfo } from "react";
import { AxiosError } from "axios";
import { HTTP_STATUS_CODES } from "../clients/HttpClient";

interface Props {
    children?: React.ReactNode,
    clearAllWaits: () => void
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
                    <h1>Unfortunate Occurance</h1>
                    <p>The application experienced a problem.</p>
                    <p>Unhandled Error {this.state.name !== "Error" ? `: ${this.state.name}` : ''}</p>
                    <p>{this.state.message}</p>
                </>
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary