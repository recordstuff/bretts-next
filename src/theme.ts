'use client';
import { Roboto } from 'next/font/google';
import { createTheme } from '@mui/material/styles';

const roboto = Roboto({
    weight: ['300', '400', '500', '700'],
    subsets: ['latin'],
    display: 'swap',
})

const bluePalette = {
    darkest: '#011f4b',
    dark: '#03396c',
    main: '#005b96',
    muted: '#6497b1',
    light: '#b3cde0',
}

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
                        backgroundColor: bluePalette.light,
                    },
                    '&.MuiTableRow-head': {
                        backgroundColor: bluePalette.darkest,
                    },
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                head: {
                    color: '#ffffff',
                    fontWeight: 700,
                },
            },
        },
    },
    palette: {
        mode: 'light',
        contrastThreshold: 4.5,
        primary: {
            dark: bluePalette.darkest,
            main: bluePalette.main,
            light: bluePalette.muted,
            contrastText: '#ffffff',
        },
        secondary: {
            dark: bluePalette.dark,
            main: bluePalette.muted,
            light: bluePalette.light,
            contrastText: bluePalette.darkest,
        },
        info: {
            dark: bluePalette.darkest,
            main: bluePalette.main,
            light: bluePalette.muted,
            contrastText: '#ffffff',
        },
        background: {
            default: bluePalette.light,
            paper: '#f7fbfe',
        },
        text: {
            primary: bluePalette.darkest,
            secondary: bluePalette.dark,
        },
        action: {
            active: bluePalette.dark,
            hover: 'rgba(0, 91, 150, 0.12)',
            selected: 'rgba(0, 91, 150, 0.2)',
            focus: 'rgba(0, 91, 150, 0.22)',
        },
    },
})

export default theme
