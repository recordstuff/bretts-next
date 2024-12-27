'use client'

import { Box, Button, ButtonGroup, Grid, Snackbar, TextField } from "@mui/material"
import { ChangeEvent, FC, useContext, useEffect, useState } from "react"
import { HTTP_STATUS_CODES } from "../../../clients/HttpClient"
import { jwtUtil } from "../../../helpers/JwtUtil"
import { defaultUserCredentials, UserCredentials } from "../../../models/UserCredentials"
import { AxiosError } from "axios"
import { userClient } from "../../../clients/UserClient"
import { useRouter } from "next/navigation"
import { PleaseWaitContext } from "../../../components/PleaseWaitProvider"

const Layout: FC = () => {

    const [userCredentials, setUserCredentials] = useState<UserCredentials>(defaultUserCredentials());
    const [useErrorCondition, setUseErrorCondition] = useState<boolean>(false)
    const [isInvalidCredentials, setIsInvalidCredentials] = useState<boolean>(false)
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
                setIsInvalidCredentials(true)
                return
            }

            throw ex
        }
    }

    const credentialsChanged = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        setIsInvalidCredentials(false)
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
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
            <Grid item lg={4} container direction="column" margin={2} spacing={2}>
                <Grid item>
                    To login, you may populate with valid credentials.
                </Grid>
                <Grid item sx={{textAlign: 'center'}}>
                    <ButtonGroup variant="text" aria-label="Populate with Credentials">
                        <Button onClick={populateWithAdminAndUserCreds}> Admin and User rights</Button>
                        <Button onClick={populateWithAdminCreds}>Admin rights only</Button>
                        <Button onClick={populateWithUserCreds}>User rights only</Button>
                    </ButtonGroup>
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
                <Snackbar
                    open={isInvalidCredentials}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    autoHideDuration={3000}
                    message="The Email or Password was incorrect."
                />                
            </Grid>
        </Box>
    )
}

export default Layout