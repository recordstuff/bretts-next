'use client'

import { LeftDrawerContext } from "@/components/LeftDrawerProvider"
import { Paper, Stack, Typography } from "@mui/material"
import { FC, useContext, useEffect } from "react"

const Home: FC = () => {
    const { atHome, setPageTitle } = useContext(LeftDrawerContext)

    useEffect(() => {
        setPageTitle('Home')
        //atHome()
        
    }, [setPageTitle, atHome])

    return (
        <Stack spacing={3}>
            <div>
                <Typography variant="h5" gutterBottom>Project options</Typography>
                <Typography>
                    Use the menu to explore examples of common application layouts and, if you are an administrator, manage users and settings.
                </Typography>
            </div>

            <div>
                <Typography variant="h6" gutterBottom>Grid Example</Typography>
                <Typography>
                    Demonstrates a responsive two-column form. Use it as a reference for grouping related fields and adapting a form to different screen sizes.
                </Typography>
            </div>

            <div>
                <Typography variant="h6" gutterBottom>Example Two</Typography>
                <Typography>
                    Shows a larger responsive form split into two sections. Use it when comparing field spacing, section headings, and multi-row layouts.
                </Typography>
            </div>

            <div>
                <Typography variant="h6" gutterBottom>Bacon Ipsum</Typography>
                <Typography>
                    Provides a text-heavy sample page. Use it to review typography, paragraph spacing, links, and how longer content reads within the application shell.
                </Typography>
            </div>

            <Paper
                variant="outlined"
                sx={{ borderColor: 'primary.main', borderWidth: 2, p: 3 }}
            >
                <Typography color="primary" variant="overline">Featured working example</Typography>
                <Typography variant="h5" gutterBottom>Users</Typography>
                <Typography>
                    The project&apos;s most complete working feature manages real user data through a full set of CRUD operations. Administrators can search and filter users, create accounts, edit user details and role assignments, and delete users.
                </Typography>
            </Paper>

            <div>
                <Typography variant="h6" gutterBottom>Settings</Typography>
                <Typography>
                    Available to administrators as the location for application-level configuration and future administrative options.
                </Typography>
            </div>
        </Stack>
    )
}

export default Home
