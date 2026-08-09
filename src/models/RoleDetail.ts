import { RoleNew } from './RoleNew'

export interface RoleDetail extends RoleNew {
    Guid: string
    UserCount: number
}

export const emptyRoleDetail = (): RoleDetail => ({
    Guid: '00000000-0000-0000-0000-000000000000',
    Name: '',
    UserCount: 0,
})
