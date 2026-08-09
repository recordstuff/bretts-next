'use client'

import { ChangeEvent, FC, useCallback, useContext, useEffect, useState } from "react"
import { roleClient } from "../../../../clients/RoleClient"
import { userClient } from "../../../../clients/UserClient"
import { UserDetail, emptyUserDetail } from "../../../../models/UserDetail"
import { Button, Stack, TextField } from "@mui/material"
import { NameGuidPair } from "../../../../models/NameGuidPair"
import { UserNew } from "../../../../models/UserNew"
import { AxiosError } from "axios"
import { HTTP_STATUS_CODES } from "../../../../clients/HttpClient"
import { useParams, useRouter } from "next/navigation"
import ItemsSelector from "@/components/ItemsSelector"
import { PleaseWaitContext } from "@/components/PleaseWaitProvider"
import { LeftDrawerContext } from "@/components/LeftDrawerProvider"
import AppSnackbar from "@/components/AppSnackbar"
import YesNoDialog from "@/components/YesNoDialog"
import { storeSuccessMessage, takeSuccessMessage } from "@/utils/successMessageStorage"
import { useAppSnackbar } from "@/hooks/useAppSnackbar"
import { AppSnackbarSeverity } from "@/models/AppSnackbarState"

const User: FC = () => {

    const [roles, setRoles] = useState<NameGuidPair[]>([])
    const [user, setUser] = useState<UserDetail>(emptyUserDetail())
    const [password, setPassword] = useState<string>('')
    const [selectedRoles, setSelectedRoles] = useState<NameGuidPair[]>([])
    const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false)
    const {snackbar, showSnackbar, closeSnackbar} = useAppSnackbar()
    const { actions: {clearAllWaits, pleaseWait, doneWaiting} } = useContext(PleaseWaitContext)
    const { addBreadcrumb, setPageTitle } = useContext(LeftDrawerContext)

    const { id } = useParams<{id: string}>()
    const router = useRouter()

    const getRoles = useCallback(async (): Promise<void> => {
        pleaseWait()

        setRoles(await roleClient.getRoles())

        doneWaiting()
    }, [pleaseWait, doneWaiting])

    const getUser = useCallback(async (): Promise<void> => {
        if (id === undefined) return

        pleaseWait()

        setUser(await userClient.getUser(id))

        doneWaiting()
    }, [id, pleaseWait, doneWaiting])

    useEffect(() => {
        let pageTitle
        let url = '/user'

        if (id === undefined) {
            pageTitle = 'Add User'
        }
        else {
            pageTitle = 'Edit User'
            url = `${url}/${id}`
        }

        setPageTitle(pageTitle)
        addBreadcrumb({ title: pageTitle, url })
        getRoles()
        getUser()
    }, [id, setPageTitle, addBreadcrumb, getRoles, getUser])

    useEffect(() => {
        if (id === undefined) {
            return
        }

        const storedSuccessMessage = takeSuccessMessage()

        if (storedSuccessMessage !== null) {
            showSnackbar(storedSuccessMessage, AppSnackbarSeverity.Success)
        }
    }, [id, showSnackbar])

    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        if (event.target.name === 'Password') {
            setPassword(event.target.value)
            return;
        }

        const newUser = { ...user }
        newUser[event.target.name as keyof UserDetail] = event.target.value as string & NameGuidPair[]
        setUser(newUser)
    }

    const upsert = async (): Promise<void> => {
        pleaseWait()

        if (id === undefined) {
            const newUser: UserNew = { ...user, Password: password }
            newUser.Roles = selectedRoles

            try {
                const userDetail = await userClient.insertUser(newUser)
                storeSuccessMessage('This user was created.')
                router.push(`/user/${userDetail.Guid}`)
            }
            catch (ex: unknown) {
                clearAllWaits()
                if (ex instanceof AxiosError 
                 && ex.response?.status === HTTP_STATUS_CODES.CONFLICT) {
                    // email already exists
                    return
                }

                throw ex                
            }
        }
        else {
            const newUser = { ...user }
            newUser.Roles = selectedRoles
            
            setUser(await userClient.updateUser(newUser))
            showSnackbar('This user was saved.', AppSnackbarSeverity.Success)
        }

        doneWaiting()
    }

    const handleCancel = (): void => {
        if (id === undefined) {
            router.back()
        }
        else {
            getUser()
        }
    }

    const handleDelete = async (): Promise<void> => {
        if (id === undefined) {
            return
        }

        setDeleteDialogOpen(false)
        pleaseWait()

        await userClient.deleteUser(id)

        doneWaiting()

        storeSuccessMessage('This user was deleted.')
        router.push('/users')
    }

    return (
        <Stack margin={2} spacing={4}>
            {id !== undefined && <TextField fullWidth label="Id" value={user.Guid} disabled />}
            <TextField fullWidth label="Display Name" name='DisplayName' onChange={handleChange} value={user.DisplayName} />
            <TextField fullWidth label="Email" name='Email' onChange={handleChange} value={user.Email} />
            <TextField fullWidth label="Phone" name='Phone' onChange={handleChange} value={user.Phone} />
            {id === undefined && <TextField fullWidth label="Password" name='Password' onChange={handleChange} value={password} />}
            <ItemsSelector
                label="Roles"
                allItems={roles}
                initiallySelectedItems={user.Roles}
                selected={selectedRoles}
                setSelected={setSelectedRoles}
            />
            <Stack direction='row' spacing={2}>
                <Button onClick={upsert} color='primary' variant="contained">{id === undefined ? 'Add' : 'Save'}</Button>
                <Button color="secondary" onClick={handleCancel}>{id === undefined ? 'Cancel' : 'Reset Form'}</Button>
                {id !== undefined && <Button variant="contained" color="error" onClick={() => setDeleteDialogOpen(true)}>Delete</Button>}
            </Stack>
            <YesNoDialog
                open={deleteDialogOpen}
                question="Are you sure you want to delete this user?"
                onNo={() => setDeleteDialogOpen(false)}
                onYes={handleDelete}
            />
            <AppSnackbar
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={closeSnackbar}
            />
        </Stack>
    )
}

export default User
