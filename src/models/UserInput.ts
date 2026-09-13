import { NameGuidPair } from './NameGuidPair'

export interface UserInput {
    Email: string
    DisplayName: string
    Phone: string | null
    Roles: NameGuidPair[]
}
