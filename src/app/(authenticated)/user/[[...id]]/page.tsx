'use client'

import { ChangeEvent, FC, useCallback, useContext, useEffect, useState } from "react"
import { roleClient } from "../../../../clients/RoleClient"
import { userClient } from "../../../../clients/UserClient"
import { UserDetail, emptyUserDetail } from "../../../../models/UserDetail"
import { TextField } from "@mui/material"
import { NameGuidPair } from "../../../../models/NameGuidPair"
import { UserNew } from "../../../../models/UserNew"
import { HTTP_STATUS_CODES, isHttpStatusError } from "../../../../clients/HttpClient"
import { useParams, useRouter } from "next/navigation"
import ItemsSelector from "@/components/ItemsSelector"
import { PleaseWaitContext } from "@/components/PleaseWaitProvider"
import { LeftDrawerContext } from "@/components/LeftDrawerProvider"
import { useAppSnackbar } from "@/components/AppSnackbarProvider"
import { AppSnackbarSeverity } from "@/models/AppSnackbarState"
import EntityForm from "@/components/EntityForm"

const User: FC = () => {

    const [roles, setRoles] = useState<NameGuidPair[]>([])
    const [user, setUser] = useState<UserDetail>(emptyUserDetail())
    const [password, setPassword] = useState<string>('')
    const [selectedRoles, setSelectedRoles] = useState<NameGuidPair[]>([])
    const {showSnackbar} = useAppSnackbar()
    const { actions: {clearAllWaits, pleaseWait, doneWaiting} } = useContext(PleaseWaitContext)
    const { addBreadcrumb, setPageTitle } = useContext(LeftDrawerContext)

    const { id } = useParams<{id: string}>()
    const router = useRouter()
    const isEdit = id !== undefined

    const getAllRoles = useCallback(async (): Promise<void> => {
        pleaseWait()

        setRoles(await roleClient.getAllRoles())

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
        getAllRoles()
        getUser()
    }, [id, setPageTitle, addBreadcrumb, getAllRoles, getUser])

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

        try {
            if (!isEdit) {
                const newUser: UserNew = { ...user, Password: password }
                newUser.Roles = selectedRoles

                const userDetail = await userClient.insertUser(newUser)
                showSnackbar('This user was created.', AppSnackbarSeverity.Success)
                router.push(`/user/${userDetail.Guid}`)
            }
            else {
                const updatedUser = { ...user }
                updatedUser.Roles = selectedRoles

                setUser(await userClient.updateUser(updatedUser))
                showSnackbar('This user was saved.', AppSnackbarSeverity.Success)
            }

            doneWaiting()
        }
        catch (ex: unknown) {
            clearAllWaits()

            if (isHttpStatusError(ex, HTTP_STATUS_CODES.CONFLICT)) {
                showSnackbar('A user with this email already exists.', AppSnackbarSeverity.Warning)
                return
            }

            throw ex
        }
    }

    const handleCancel = (): void => {
        if (!isEdit) {
            router.back()
            return
        }

        getUser()
    }

    const handleDelete = async (): Promise<void> => {
        if (id === undefined) {
            return
        }

        pleaseWait()

        await userClient.deleteUser(id)

        doneWaiting()

        showSnackbar('This user was deleted.', AppSnackbarSeverity.Success)
        router.push('/users')
    }

    return (
        <EntityForm
            entityName="user"
            isEdit={isEdit}
            onCancel={handleCancel}
            onDelete={handleDelete}
            onSave={upsert}
        >
            {isEdit && <TextField fullWidth label="Id" value={user.Guid} disabled />}
            <TextField fullWidth label="Display Name" name='DisplayName' onChange={handleChange} value={user.DisplayName} />
            <TextField fullWidth label="Email" name='Email' onChange={handleChange} value={user.Email} />
            <TextField fullWidth label="Phone" name='Phone' onChange={handleChange} value={user.Phone} />
            {!isEdit && <TextField fullWidth label="Password" name='Password' onChange={handleChange} value={password} />}
            <ItemsSelector
                label="Roles"
                allItems={roles}
                initiallySelectedItems={user.Roles}
                selected={selectedRoles}
                setSelected={setSelectedRoles}
            />
        </EntityForm>
    )
}

export default User
