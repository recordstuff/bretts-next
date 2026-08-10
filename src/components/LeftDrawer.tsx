'use client'

import { FC, useContext, useMemo, useState } from "react"
import PrivateRoute from "../components/PrivateRoute"
import { AppBar, Box, Divider, Drawer, IconButton, Link as MuiLink, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack, Toolbar, Typography } from "@mui/material"
import AgricultureIcon from '@mui/icons-material/Agriculture';
import GitHubIcon from '@mui/icons-material/GitHub';
import HomeIcon from '@mui/icons-material/Home';
import MenuIcon from '@mui/icons-material/Menu';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import TableChartIcon from '@mui/icons-material/TableChart';
import TableRowsIcon from '@mui/icons-material/TableRows';
import { DrawerMenuItem, MenuOption, divider } from "../models/MenuOption";
import { JwtField, JwtRole } from "../models/Jwt";
import { jwtUtil } from "../helpers/JwtUtil"
import { Breadcrumbinator } from "../components/Breadcruminator";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LeftDrawerContext } from "./LeftDrawerProvider";

const drawerWidth = 200

const menuOptions: DrawerMenuItem[] = [
    {
        Text: "Home",
        Route: "/",
        Icon: HomeIcon,
        Role: JwtRole.Any,
        Breadcrumb: { title: "Home", url: "/" },
    },
    {
        Text: "Grid Example",
        Route: "/gridexample",
        Icon: TableRowsIcon,
        Role: JwtRole.User,
        Breadcrumb: { title: "Grid Example", url: "/gridexample" },
    },
    {
        Text: "Example Two",
        Route: "/exampletwo",
        Icon: TableChartIcon,
        Role: JwtRole.User,
        Breadcrumb: { title: "Example Two", url: "/exampletwo" },
    },
    {
        Text: "Bacon Ipsum",
        Route: "/baconipsum",
        Icon: AgricultureIcon,
        Role: JwtRole.User,
        Breadcrumb: { title: "Bacon Ipsum", url: "/baconipsum" },
    },
    divider,
    {
        Text: "Users",
        Route: "/users",
        Icon: PeopleIcon,
        Role: JwtRole.Admin,
        Breadcrumb: { title: "Users", url: "/users" },
        ChildRoutes: ['/user']
    },
    {
        Text: "Settings",
        Route: "/settings",
        Icon: SettingsIcon,
        Role: JwtRole.Admin,
        Breadcrumb: { title: "Settings", url: "/settings" },
    },
]

interface Props {
    children?: React.ReactNode
}

const LeftDrawer: FC<Props> = ({ children }) => {
    const pathname = usePathname()
    const { firstBreadcrumb, pageTitle } = useContext(LeftDrawerContext)
    const [mobileOpen, setMobileOpen] = useState(false)

    const selectedMenuOption = useMemo(() => menuOptions.find(menuOption =>
        menuOption !== divider
        && ((menuOption as MenuOption).Route === pathname
            || (menuOption as MenuOption).ChildRoutes?.some(cr => pathname.startsWith(cr)))) ?? menuOptions[0], [pathname])

    const handleDrawerToggle = (): void => {
        setMobileOpen(isOpen => !isOpen)
    }

    const handleDrawerClose = (): void => {
        setMobileOpen(false)
    }

    const handleMenuOptionClick = (menuOption: MenuOption): void => {
        firstBreadcrumb(menuOption.Breadcrumb)
        handleDrawerClose()
    }

    const drawerContent = (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
            <List
                disablePadding
                sx={{
                    '& .MuiListItemButton-root': {
                        paddingBottom: 'calc(.9em + 1px)',
                        paddingTop: 'calc(.9em + 1px)',
                    },
                }}
            >
                {menuOptions.map((menuItem, index) => {
                    if (menuItem === divider && jwtUtil.hasMultipleRoles()) {
                        return <Divider key={`divider ${index}`} sx={{ borderColor: 'primary.main' }} />
                    }

                    const menuOption = menuItem as MenuOption

                    return jwtUtil.hasRole(menuOption.Role) ? (
                        <ListItem disablePadding component={Link} href={menuOption.Route} key={menuOption.Text}>
                            <ListItemButton
                                onClick={() => handleMenuOptionClick(menuOption)}
                                selected={menuOption === selectedMenuOption}
                            >
                                <ListItemIcon>
                                    <menuOption.Icon />
                                </ListItemIcon>
                                <ListItemText primary={menuOption.Text} />
                            </ListItemButton>
                        </ListItem>
                    ) : null
                })}
            </List>
            <Stack component="footer" sx={{ mt: 'auto', px: 2, py: 2 }}>
                <MuiLink
                    href="https://github.com/recordstuff/bretts-next"
                    onClick={handleDrawerClose}
                    rel="noopener noreferrer"
                    sx={{ alignItems: 'center', alignSelf: 'center', display: 'flex', gap: 0.5, pb: 1, pt: 0.5, width: 'fit-content' }}
                    target="_blank"
                >
                    <GitHubIcon aria-hidden="true" fontSize="small" />
                    GitHub Repo
                </MuiLink>
                <MuiLink
                    href="https://brettdrake.org/"
                    onClick={handleDrawerClose}
                    rel="noopener noreferrer"
                    sx={{ alignSelf: 'center', py: 1, width: 'fit-content' }}
                    target="_blank"
                >
                    brettdrake.org
                </MuiLink>
            </Stack>
        </Box>
    )

    return (
        <PrivateRoute>
            <Box sx={{ display: 'flex' }}>
                <AppBar
                    position="fixed"
                    sx={{
                        ml: { sm: `${drawerWidth}px` },
                        width: { sm: `calc(100% - ${drawerWidth}px)` },
                    }}
                >
                    <Toolbar>
                        <IconButton
                            aria-controls="mobile-navigation-drawer"
                            aria-expanded={mobileOpen}
                            aria-label="toggle navigation menu"
                            color="inherit"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ display: { sm: 'none' }, mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" noWrap component="div">
                            {pageTitle}
                        </Typography>
                        <Box sx={{ marginLeft: 'auto' }}>
                            {sessionStorage.getItem(JwtField.DisplayName)}
                            <Typography
                                className="logout-link"
                                component={Link}
                                href="/login"
                                title='Go back to the login screen.'
                            >
                                Logout
                            </Typography>
                        </Box>
                    </Toolbar>
                </AppBar>
                <Box
                    aria-label="main navigation"
                    component="nav"
                    sx={{ flexShrink: { sm: 0 }, width: { sm: drawerWidth } }}
                >
                    <Drawer
                        id="mobile-navigation-drawer"
                        ModalProps={{ keepMounted: true }}
                        onClose={handleDrawerClose}
                        open={mobileOpen}
                        sx={{
                            display: { xs: 'block', sm: 'none' },
                            '& .MuiDrawer-paper': {
                                boxSizing: 'border-box',
                                width: drawerWidth,
                            },
                        }}
                        variant="temporary"
                    >
                        {drawerContent}
                    </Drawer>
                    <Drawer
                        open
                        sx={{
                            display: { xs: 'none', sm: 'block' },
                            '& .MuiDrawer-paper': {
                                boxSizing: 'border-box',
                                width: drawerWidth,
                            },
                        }}
                        variant="permanent"
                    >
                        {drawerContent}
                    </Drawer>
                </Box>
                <Box
                    component="main"
                    sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
                >
                    <Stack>
                        <Toolbar />
                        <Breadcrumbinator />
                        {children}
                    </Stack>
                </Box>
            </Box>
        </PrivateRoute>
    )
}

export default LeftDrawer
