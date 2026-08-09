'use client'

import { LeftDrawerContext } from "@/components/LeftDrawerProvider"
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import Inventory2Icon from '@mui/icons-material/Inventory2'
import LabelIcon from '@mui/icons-material/Label'
import PeopleIcon from '@mui/icons-material/People'
import SettingsIcon from '@mui/icons-material/Settings'
import WarehouseIcon from '@mui/icons-material/Warehouse'
import { Card, CardActionArea, Stack, Typography } from "@mui/material"
import Link from "next/link"
import { FC, useContext, useEffect } from "react"
import { jwtUtil } from '@/helpers/JwtUtil'
import { JwtRole } from '@/models/Jwt'

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

const Dashboard: FC = () => {
    const { firstBreadcrumb, setPageTitle } = useContext(LeftDrawerContext)

    useEffect(() => {
        setPageTitle('Dashboard')
        firstBreadcrumb({ title: 'Dashboard', url: '/' })
    }, [firstBreadcrumb, setPageTitle])

    return (
        <Stack spacing={3}>
            <div>
                <Typography variant="h5" gutterBottom>Dashboard</Typography>
                <Typography>
                    Select an option to manage inventory or, if you are an administrator, configure the application.
                </Typography>
            </div>

            {jwtUtil.hasRole(JwtRole.User) && (
                <OptionCard featured href="/inventory">
                    <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                        <WarehouseIcon color="primary" />
                        <Typography variant="h5">Inventory</Typography>
                    </Stack>
                    <Typography>Manage physical inventory items and their definition-driven attribute values.</Typography>
                </OptionCard>
            )}

            {jwtUtil.hasRole(JwtRole.Admin) && (<>
                <OptionCard href="/inventoryitemdefinitions">
                    <Stack direction="row" spacing={1} alignItems="center" mb={1}><Inventory2Icon /><Typography variant="h6">Inventory Definitions</Typography></Stack>
                    <Typography>Define reusable inventory item types, attributes, and component relationships.</Typography>
                </OptionCard>
                <OptionCard href="/attributedefinitions">
                    <Stack direction="row" spacing={1} alignItems="center" mb={1}><LabelIcon /><Typography variant="h6">Attribute Definitions</Typography></Stack>
                    <Typography>Manage reusable typed attributes for inventory item definitions.</Typography>
                </OptionCard>
                <OptionCard href="/users">
                    <Stack direction="row" spacing={1} alignItems="center" mb={1}><PeopleIcon /><Typography variant="h6">Users</Typography></Stack>
                    <Typography>Manage user accounts and their assigned roles.</Typography>
                </OptionCard>
                <OptionCard href="/roles">
                    <Stack direction="row" spacing={1} alignItems="center" mb={1}><AdminPanelSettingsIcon /><Typography variant="h6">Roles</Typography></Stack>
                    <Typography>Manage the roles available for user assignment.</Typography>
                </OptionCard>
                <OptionCard href="/settings">
                    <Stack direction="row" spacing={1} alignItems="center" mb={1}><SettingsIcon /><Typography variant="h6">Settings</Typography></Stack>
                    <Typography>An administrator-only page for testing the global exception handler, writing a structured test log entry, and shutting down the sandbox backend for the more mischievous admins. <span aria-hidden="true">😈</span></Typography>
                </OptionCard>
            </>)}
        </Stack>
    )
}

export default Dashboard
