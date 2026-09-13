import { UserInput } from './UserInput'

export interface UserDetail extends UserInput {
    Guid: string
}

export const emptyUserDetail = (): UserDetail => ({
    DisplayName: '',
    Guid: '00000000-0000-0000-0000-000000000000',
    Email: '',
    Phone: '',
    Roles: [],
})
