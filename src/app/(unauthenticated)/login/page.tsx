'use client'

import { Box, Button, Grid, Link, Paper, TextField } from "@mui/material"
import { ChangeEvent, FC, useContext, useEffect, useState } from "react"
import { HTTP_STATUS_CODES } from "../../../clients/HttpClient"
import { jwtUtil } from "../../../helpers/JwtUtil"
import { defaultUserCredentials, UserCredentials } from "../../../models/UserCredentials"
import { AxiosError } from "axios"
import { userClient } from "../../../clients/UserClient"
import { useRouter } from "next/navigation"
import { PleaseWaitContext } from "../../../components/PleaseWaitProvider"
import { useAppSnackbar } from "@/components/AppSnackbarProvider"
import { AppSnackbarSeverity } from "@/models/AppSnackbarState"

const Layout: FC = () => {

    const [userCredentials, setUserCredentials] = useState<UserCredentials>(defaultUserCredentials());
    const [useErrorCondition, setUseErrorCondition] = useState<boolean>(false)
    const {showSnackbar, closeSnackbar} = useAppSnackbar()
    const router = useRouter()
    const { actions: {pleaseWait, doneWaiting, clearAllWaits} } = useContext(PleaseWaitContext)

    const login = async (): Promise<void> => {
        try {
            setUseErrorCondition(true)

            if (userCredentials.Email.length === 0 || userCredentials.Password.length === 0) return

            pleaseWait()

            const result = await userClient.login(userCredentials)

            jwtUtil.token = result.Token

            doneWaiting()

            if (!jwtUtil.isExpired) {
                router.push('/')
            }
        }
        catch (ex: unknown) {
            clearAllWaits()
            if (ex instanceof AxiosError && ex.response?.status === HTTP_STATUS_CODES.UNAUTHORIZED) {
                showSnackbar('The Email or Password was incorrect.', AppSnackbarSeverity.Warning)
                return
            }

            throw ex
        }
    }

    const credentialsChanged = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        closeSnackbar()
        const newCreds = { ...userCredentials }
        newCreds[event.target.name as keyof UserCredentials] = event.target.value
        setUserCredentials(newCreds)
    }

    const populateWithAdminCreds = (): void => {
        setUserCredentials({Email: 'adminonly@brettdrake.org', Password: 'test123'})
    }

    const populateWithUserCreds = (): void => {
        setUserCredentials({Email: 'useronly@brettdrake.org', Password: 'test123'})
    }

    const populateWithAdminAndUserCreds = (): void => {
        setUserCredentials(defaultUserCredentials())
    }

    useEffect(() => {
        jwtUtil.clear();
    }, []);

    return (
        <Box
            component="main"
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: { xs: '50vh', xl: '100dvh' },
                boxSizing: 'border-box',
                padding: 2,
                paddingTop: { xs: 4, sm: 2 },
            }}>
            <Paper
                variant="outlined"
                sx={{
                    width: '100%',
                    maxWidth: '36rem',
                    padding: { xs: 2, sm: 3 },
                    borderColor: 'primary.main',
                    transform: { xl: 'translateY(-4rem)' },
                }}>
                <Grid container direction="column" spacing={2}>
                    <Grid item>
                        This is a React sample using NextJS.  Log in with Admin and User rights to see all the options including Users CRUD operations.
                    </Grid>
                    <Grid item>
                        <Box
                            role="group"
                            aria-label="Populate with Credentials"
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
                            }}>
                            <Button onClick={populateWithAdminAndUserCreds}> Admin and User rights</Button>
                            <Button onClick={populateWithAdminCreds}>Admin rights only</Button>
                            <Button onClick={populateWithUserCreds}>User rights only</Button>
                        </Box>
                    </Grid>
                    <Grid item>
                        <TextField
                            fullWidth
                            name="Email"
                            label="Email"
                            type="email"
                            value={userCredentials.Email}
                            onChange={credentialsChanged}
                            required
                            error={useErrorCondition && userCredentials.Email.length === 0}
                            helperText={useErrorCondition && userCredentials.Email.length === 0 && "Email cannot be blank."}
                            InputLabelProps={{shrink: true}} /* "fix" issue with chrome autofill */
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            fullWidth
                            name="Password"
                            label="Password"
                            type="password"
                            value={userCredentials.Password}
                            onChange={credentialsChanged}
                            required
                            error={useErrorCondition && userCredentials.Password.length === 0}
                            helperText={useErrorCondition && userCredentials.Password.length === 0 && "Password cannot be blank."}
                            InputLabelProps={{shrink: true}} /* "fix" issue with chrome autofill */
                        />
                    </Grid>
                    <Grid item>
                        <Button
                            fullWidth
                            variant="outlined"
                            color="primary"
                            onClick={login}
                            disabled={useErrorCondition && (userCredentials.Email.length === 0 || userCredentials.Password.length === 0)}>
                            Login
                        </Button>
                    </Grid>
                    <Grid item sx={{textAlign: 'right'}}>
                        <Link
                            href="https://brettdrake.org/"
                            target="_blank"
                            rel="noopener noreferrer"
                            color="primary">
                            brettdrake.org
                        </Link>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    )
}

export default Layout
