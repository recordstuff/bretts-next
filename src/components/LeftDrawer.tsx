'use client'

import { FC, useContext, useMemo, useState } from "react"
import PrivateRoute from "../components/PrivateRoute"
import { AppBar, Box, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack, Toolbar, Typography } from "@mui/material"
import DashboardIcon from '@mui/icons-material/Dashboard';
import MenuIcon from '@mui/icons-material/Menu';
import PeopleIcon from '@mui/icons-material/People';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import LabelIcon from '@mui/icons-material/Label';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
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
        Text: "Dashboard",
        Route: "/",
        Icon: DashboardIcon,
        Role: JwtRole.Any,
        Breadcrumb: { title: "Dashboard", url: "/" },
    },
    {
        Text: "Inventory",
        Route: "/inventory",
        Icon: WarehouseIcon,
        Role: JwtRole.User,
        Breadcrumb: { title: "Inventory", url: "/inventory" },
        ChildRoutes: ['/inventoryitem']
    },
    divider,
    {
        Text: "Inventory Definitions",
        Route: "/inventoryitemdefinitions",
        Icon: Inventory2Icon,
        Role: JwtRole.Admin,
        Breadcrumb: { title: "Inventory Item Definitions", url: "/inventoryitemdefinitions" },
        ChildRoutes: ['/inventoryitemdefinition']
    },
    {
        Text: "Attribute Definitions",
        Route: "/attributedefinitions",
        Icon: LabelIcon,
        Role: JwtRole.Admin,
        Breadcrumb: { title: "Attribute Definitions", url: "/attributedefinitions" },
        ChildRoutes: ['/attributedefinition']
    },
    {
        Text: "Users",
        Route: "/users",
        Icon: PeopleIcon,
        Role: JwtRole.Admin,
        Breadcrumb: { title: "Users", url: "/users" },
        ChildRoutes: ['/user']
    },
    {
        Text: "Roles",
        Route: "/roles",
        Icon: AdminPanelSettingsIcon,
        Role: JwtRole.Admin,
        Breadcrumb: { title: "Roles", url: "/roles" },
        ChildRoutes: ['/role']
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
        <List>
            {menuOptions.map((menuItem, index) => {
                if (menuItem === divider && jwtUtil.hasMultipleRoles()) {
                    return <Divider key={`divider ${index}`} />
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
