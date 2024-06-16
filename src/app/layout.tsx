import theme from "@/theme";
import "./globals.css";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ThemeProvider } from "@mui/material/styles";
import { PleaseWait } from "@/components/PleaseWait";
import ErrorBoundary from "@/components/ErrorBoundary";
import { CssBaseline } from "@mui/material";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
            <body>
                <AppRouterCacheProvider>
                    <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <ErrorBoundary>
                        <PleaseWait />
                        {children}
                        </ErrorBoundary>
                    </ThemeProvider>
                </AppRouterCacheProvider>
            </body>
        </html>
    )
}
