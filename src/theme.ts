'use client';
import { Roboto } from 'next/font/google';
import { alpha, createTheme } from '@mui/material/styles';

const roboto = Roboto({
    weight: ['300', '400', '500', '700'],
    subsets: ['latin'],
    display: 'swap',
})

const bluePalette = {
    lightest: '#f0f3fa',
    light: '#d5deef',
    stripe: '#b1c9ef',
    muted: '#8aaee0',
    accent: '#628ecb',
    dark: '#395886',
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
                    transition: 'background-color 120ms ease, color 120ms ease, transform 80ms ease',
                    '&:hover': {
                        backgroundColor: bluePalette.stripe,
                        color: bluePalette.dark,
                    },
                    '&.Mui-selected': {
                        backgroundColor: bluePalette.accent,
                        color: '#ffffff',
                    },
                    '&.Mui-selected:hover': {
                        backgroundColor: bluePalette.dark,
                        color: '#ffffff',
                    },
                    '&:active': {
                        backgroundColor: bluePalette.dark,
                        color: '#ffffff',
                        transform: 'translateY(1px) scale(0.98)',
                    },
                },
            },
        },
        MuiListItemIcon: {
            styleOverrides: {
                root: {
                    color: 'inherit',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    transition: 'background-color 120ms ease, border-color 120ms ease, color 120ms ease, transform 80ms ease',
                    '&:not(.Mui-disabled):hover': {
                        transform: 'translateY(-1px)',
                    },
                    '&:not(.Mui-disabled):active': {
                        transform: 'translateY(1px) scale(0.98)',
                    },
                },
            },
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    transition: 'background-color 120ms ease, color 120ms ease, transform 80ms ease',
                    '&:not(.Mui-disabled):hover': {
                        transform: 'translateY(-1px)',
                    },
                    '&:not(.Mui-disabled):active': {
                        transform: 'translateY(1px) scale(0.94)',
                    },
                },
            },
        },
        MuiCardActionArea: {
            styleOverrides: {
                root: {
                    transition: 'background-color 120ms ease, color 120ms ease, transform 80ms ease',
                    '&:hover': {
                        backgroundColor: bluePalette.stripe,
                        color: bluePalette.dark,
                    },
                    '&:active': {
                        backgroundColor: bluePalette.muted,
                        transform: 'translateY(1px) scale(0.99)',
                    },
                },
            },
        },
        MuiTableRow: {
            styleOverrides: {
                root: {
                    '&:nth-of-type(odd)': {
                        backgroundColor: bluePalette.stripe,
                    },
                    '&.MuiTableRow-head': {
                        backgroundColor: bluePalette.dark,
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
        MuiTableSortLabel: {
            styleOverrides: {
                root: {
                    borderRadius: 1,
                    margin: '-2px -6px',
                    padding: '2px 6px',
                    textDecoration: 'underline',
                    textDecorationThickness: '1px',
                    textUnderlineOffset: '0.2em',
                    transition: 'background-color 120ms ease, color 120ms ease, transform 80ms ease',
                    '&:hover': {
                        backgroundColor: alpha('#ffffff', 0.1),
                        color: '#ffffff',
                        textShadow: `0 0 8px ${alpha('#ffffff', 0.4)}`,
                        transform: 'translateY(-1px)',
                    },
                    '&:active': {
                        backgroundColor: alpha('#ffffff', 0.18),
                        color: '#ffffff',
                        transform: 'translateY(1px) scale(0.98)',
                    },
                    '&.Mui-focusVisible': {
                        outline: '2px solid #ffffff',
                        outlineOffset: 2,
                    },
                    '&.Mui-active': {
                        color: '#ffffff',
                    },
                    '&.Mui-active .MuiTableSortLabel-icon': {
                        color: '#ffffff',
                    },
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: bluePalette.dark,
                    color: '#ffffff',
                },
            },
        },
        MuiLink: {
            styleOverrides: {
                root: {
                    transition: 'color 120ms ease, text-decoration-thickness 120ms ease, transform 80ms ease',
                    '&:hover': {
                        color: bluePalette.accent,
                        textDecorationThickness: '2px',
                    },
                    '&:active': {
                        color: '#2d466b',
                    },
                },
            },
        },
    },
    palette: {
        mode: 'light',
        contrastThreshold: 4.5,
        primary: {
            dark: '#2d466b',
            main: bluePalette.dark,
            light: bluePalette.accent,
            contrastText: '#ffffff',
        },
        secondary: {
            dark: bluePalette.accent,
            main: bluePalette.muted,
            light: bluePalette.stripe,
            contrastText: '#263b59',
        },
        info: {
            dark: '#2d466b',
            main: bluePalette.dark,
            light: bluePalette.accent,
            contrastText: '#ffffff',
        },
        background: {
            default: bluePalette.light,
            paper: bluePalette.lightest,
        },
        text: {
            primary: bluePalette.dark,
            secondary: '#4d6385',
        },
        action: {
            active: bluePalette.dark,
            hover: bluePalette.stripe,
            selected: bluePalette.muted,
            focus: bluePalette.accent,
        },
    },
})

export default theme
