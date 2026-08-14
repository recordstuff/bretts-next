'use client'

import { LeftDrawerContext } from "@/components/LeftDrawerProvider"
import AgricultureIcon from '@mui/icons-material/Agriculture'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import PeopleIcon from '@mui/icons-material/People'
import SettingsIcon from '@mui/icons-material/Settings'
import TableChartIcon from '@mui/icons-material/TableChart'
import TableRowsIcon from '@mui/icons-material/TableRows'
import { Card, CardActionArea, Stack, Typography } from "@mui/material"
import Link from "next/link"
import { FC, useContext, useEffect } from "react"

interface OptionCardProps {
    children: React.ReactNode
    featured?: boolean
    href: string
}

const OptionCard: FC<OptionCardProps> = ({ children, featured = false, href }) => (
    <Card
        variant="outlined"
        sx={featured ? { borderColor: 'primary.main', borderWidth: 2 } : undefined}
    >
        <CardActionArea
            component={Link}
            href={href}
            sx={{ p: featured ? 3 : 2 }}
        >
            {children}
        </CardActionArea>
    </Card>
)

const Home: FC = () => {
    const { firstBreadcrumb, setPageTitle } = useContext(LeftDrawerContext)

    useEffect(() => {
        setPageTitle('Home')
        firstBreadcrumb({ title: 'Home', url: '/' })
    }, [firstBreadcrumb, setPageTitle])

    return (
        <Stack spacing={3}>
            <div>
                <Typography variant="h5" gutterBottom>Project options</Typography>
                <Typography>
                    Use the menu to explore examples of common application layouts and, if you are an administrator, manage users, roles, and settings.
                </Typography>
            </div>

            <OptionCard href="/gridexample">
                <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                    <TableRowsIcon />
                    <Typography variant="h6">Grid Example</Typography>
                </Stack>
                <Typography>
                    Contains two groups of fields: Contact and Address. They appear side by side on larger screens, then move into one column on smaller screens with Contact first and Address below it.
                </Typography>
            </OptionCard>

            <OptionCard href="/exampletwo">
                <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                    <TableChartIcon />
                    <Typography variant="h6">Example Two</Typography>
                </Stack>
                <Typography>
                    Shows a different responsive two-column pattern. Instead of moving whole field groups like Grid Example, its individual fields flow from two columns into a single column as the screen narrows.
                </Typography>
            </OptionCard>

            <OptionCard href="/baconipsum">
                <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                    <AgricultureIcon />
                    <Typography variant="h6">Bacon Ipsum</Typography>
                </Stack>
                <Typography>
                    A placeholder page for now. Its sample text keeps the navigation route and application layout represented until this area is replaced with a functional feature.
                </Typography>
            </OptionCard>

            <OptionCard featured href="/users">
                <Typography color="primary" variant="overline">Featured working example</Typography>
                <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                    <PeopleIcon color="primary" />
                    <Typography variant="h5">Users</Typography>
                </Stack>
                <Typography>
                    The project&apos;s most complete working feature manages real user data through a full set of CRUD operations. Administrators can search and filter users, create accounts, edit user details and role assignments, and delete users.
                </Typography>
            </OptionCard>

            <OptionCard href="/roles">
                <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                    <AdminPanelSettingsIcon />
                    <Typography variant="h6">Roles</Typography>
                </Stack>
                <Typography>
                    Administrators can search and sort roles, create new roles, rename existing roles, and delete roles that are not assigned to users. Duplicate role names are prevented.
                </Typography>
            </OptionCard>

            <OptionCard href="/settings">
                <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                    <SettingsIcon />
                    <Typography variant="h6">Settings</Typography>
                </Stack>
                <Typography>
                    An administrator-only page for testing the global exception handler, writing a structured test log entry, and shutting down the sandbox backend for the more mischievous admins. <span aria-hidden="true">😈</span>
                </Typography>
            </OptionCard>
        </Stack>
    )
}

export default Home
