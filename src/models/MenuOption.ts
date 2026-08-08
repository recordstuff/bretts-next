import { ComponentType } from "react"
import { JwtRole } from "./Jwt"
import type { VisitedPage } from "../components/LeftDrawerProvider"

export interface MenuOption {
    Text: string
    Route: string
    Icon: ComponentType
    Role: JwtRole
    Breadcrumb: VisitedPage
    ChildRoutes?: string[]
}

export const divider = Symbol("divider")

export type DrawerMenuItem = MenuOption | typeof divider

