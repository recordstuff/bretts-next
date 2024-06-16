export const ENCODED_TOKEN_NAME: string = "accessToken"

export type Jwt = Map<JwtField, string | number | string[]>

export enum JwtField {
    Email               = "sub",
    Guid                = "jti",
    DisplayName         = "displayName",
    ExpirationSeconds   = "exp",
    Issuer              = "issuer",
    Audience            = "aud",
    Roles               = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
}

export enum JwtRole {
    Any = "Any",
    Admin = "Admin",
    User = "User",
}
