'use client'

import { FC, useState } from "react"
import PrivateRoute from "../components/PrivateRoute"
import { AppBar, Box, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack, Toolbar, Typography } from "@mui/material"
import AgricultureIcon from '@mui/icons-material/Agriculture';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import TableChartIcon from '@mui/icons-material/TableChart';
import TableRowsIcon from '@mui/icons-material/TableRows';
import { DrawerMenuItem, MenuOption, divider } from "../models/MenuOption";
import { JwtField, JwtRole } from "../models/Jwt";
import { jwtUtil } from "../helpers/JwtUtil"
import { Breadcrumbinator } from "../components/Breadcruminator";
import Link from "next/link";

const drawerWidth = 200

const menuOptions: DrawerMenuItem[] = [
    {
        Text: "Home",
        Route: "/",
        Icon: HomeIcon,
        Role: JwtRole.Any,
    },
    {
        Text: "Grid Example",
        Route: "/gridexample",
        Icon: TableRowsIcon,
        Role: JwtRole.User,
    },
    {
        Text: "Example Two",
        Route: "/exampletwo",
        Icon: TableChartIcon,
        Role: JwtRole.User,
    },
    {
        Text: "Bacon Ipsum",
        Route: "/baconipsum",
        Icon: AgricultureIcon,
        Role: JwtRole.User,
    },
    divider,
    {
        Text: "Users",
        Route: "/users",
        Icon: PeopleIcon,
        Role: JwtRole.Admin,
        ChildRoutes: ['/user']
    },
    {
        Text: "Settings",
        Route: "/settings",
        Icon: SettingsIcon,
        Role: JwtRole.Admin,
    },
]

type Props = {
    children?: React.ReactNode
  };

const LeftDrawer: FC<Props> = ({children}) => {
    const [pageTitle, setPageTitle] = useState('')

    return (
        <PrivateRoute>
            <Box sx={{ display: 'flex' }}>
                <AppBar
                    position="fixed"
                    sx={{
                        width: `calc(100% - ${drawerWidth}px)`,
                        ml: `${drawerWidth}px`
                    }}
                >
                    <Toolbar>
                        <Typography variant="h6" noWrap component="div">
                            {pageTitle}
                        </Typography>
                        <Box sx={{ marginLeft: 'auto' }}>
                            {localStorage.getItem(JwtField.DisplayName)}
                            <a href="/login" title='Go back to the login screen.'>
                                <Typography sx={{ fontSize: '.9em' }}>Logout</Typography>
                            </a>
                        </Box>
                    </Toolbar>
                </AppBar>
                <Drawer
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            boxSizing: 'border-box',
                        },
                    }}
                    variant="permanent"
                    anchor="left"
                >
                    <List>
                        {menuOptions.map((menuItem, index) => {
                            if (menuItem === divider && jwtUtil.hasMultipleRoles()) {
                                return <Divider key={`divider ${index}`} />
                            }

                            const menuOption = menuItem as MenuOption

                            return jwtUtil.hasRole(menuOption.Role) ? (
                                <ListItem disablePadding component={Link} href={menuOption.Route} key={menuOption.Text}>
                                    <ListItemButton selected={menuOption.Route === window.location.pathname
                                        || menuOption.ChildRoutes?.some(cr => window.location.pathname.startsWith(cr))}>
                                        <ListItemIcon>
                                            <menuOption.Icon />
                                        </ListItemIcon>
                                        <ListItemText primary={menuOption.Text} />
                                    </ListItemButton>
                                </ListItem>
                            ) : null
                        })}
                    </List>
                </Drawer>
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