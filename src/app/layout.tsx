import theme from "@/theme";
import "./globals.css";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ThemeProvider } from "@mui/material/styles";
import { PleaseWait } from "@/components/PleaseWait";
import ErrorBoundary from "@/components/ErrorBoundary";
import { CssBaseline } from "@mui/material";
import { PleaseWaitProvider } from "@/components/PleaseWaitProvider";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
            <head>
                {/* process.env.NODE_ENV === 'development' && <script src="http://localhost:8097"></script> */}
            </head>
            <body>
                <AppRouterCacheProvider>
                    <ThemeProvider theme={theme}>
                        <CssBaseline />
                        <ErrorBoundary>
                            <PleaseWaitProvider>
                                    <PleaseWait />
                                    {children}
                            </PleaseWaitProvider>
                        </ErrorBoundary>
                    </ThemeProvider>
                </AppRouterCacheProvider>
            </body>
        </html>
    )
}
