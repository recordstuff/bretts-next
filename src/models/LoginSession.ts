export interface LoginSession
{
    DisplayName: string,
    ExpirationSeconds: bigint,
    Roles: string[],
    Token: string
}