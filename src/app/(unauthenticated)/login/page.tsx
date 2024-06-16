'use client'

import { Box, Button, Grid, Snackbar, TextField } from "@mui/material"
import { ChangeEvent, FC, useEffect, useState } from "react"
import { HTTP_STATUS_CODES } from "../../../clients/HttpClient"
import { jwtUtil } from "../../../helpers/JwtUtil"
import { defaultUserCredentials, UserCredentials } from "../../../models/UserCredentials"
import { AxiosError } from "axios"
import { userClient } from "../../../clients/UserClient"
import { useRouter } from "next/navigation"

const Layout: FC = () => {

    const [userCredentials, setUserCredentials] = useState<UserCredentials>(defaultUserCredentials());
    const [useErrorCondition, setUseErrorCondition] = useState<boolean>(false)
    const [isInvalidCredentials, setIsInvalidCredentials] = useState<boolean>(false)
    const router = useRouter()

    const login = async (): Promise<void> => {
        try {
            setUseErrorCondition(true)

            if (userCredentials.Email.length === 0 || userCredentials.Password.length === 0) return

            // dispatch(pleaseWait())

            const result = await userClient.login(userCredentials)

            jwtUtil.token = result.Token

            // dispatch(doneWaiting())

            if (!jwtUtil.isExpired) {
                router.push('/')
            }
        }
        catch (ex: unknown) {
            // dispatch(clearAllWaits())
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

    useEffect(() => {
        jwtUtil.clear();
    }, []);

    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
            <Grid item lg={4} container direction="column" margin={2} spacing={2}>
                <Grid item>
                    <TextField
                        fullWidth
                        name="Email"
                        label="Email"
                        type="email"
                        onChange={credentialsChanged}
                        required
                        error={useErrorCondition && userCredentials.Email.length === 0}
                        helperText={useErrorCondition && userCredentials.Email.length === 0 && "Email cannot be blank."}
                    />
                </Grid>
                <Grid item>
                    <TextField
                        fullWidth
                        name="Password"
                        label="Password"
                        type="password"
                        onChange={credentialsChanged}
                        required
                        error={useErrorCondition && userCredentials.Password.length === 0}
                        helperText={useErrorCondition && userCredentials.Password.length === 0 && "Password cannot be blank."}
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
                <Grid item>
                    <p>
                        This is the React frontend.  Go to the <a href="http://brettdrake.org:8008/">Angular frontend</a>.
                    </p>
                </Grid>
            </Grid>
        </Box>
    )
}

export default Layout