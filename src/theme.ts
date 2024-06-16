'use client';
import { Roboto } from 'next/font/google';
import { createTheme } from '@mui/material/styles';

const roboto = Roboto({
    weight: ['300', '400', '500', '700'],
    subsets: ['latin'],
    display: 'swap',
})

const theme = createTheme({
    typography: {
        fontFamily: roboto.style.fontFamily,
    }, components: {
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    paddingTop: '.9em',
                    paddingBottom: '.9em',
                },
            },
        },
        MuiTableRow: {
            styleOverrides: {
                root: {
                    '&:nth-of-type(odd)': {
                        backgroundColor: '#121212',
                    },
                    '&.MuiTableRow-head': {
                        backgroundColor: '#1e1e1e',
                    },
                },
            },
        },
    },
    palette: {
        mode: 'dark'
    },
})

export default theme
