export enum AppSnackbarSeverity {
    Success = 'success',
    Info = 'info',
    Warning = 'warning',
    Error = 'error',
}

export interface AppSnackbarState {
    message: string | null
    severity: AppSnackbarSeverity
}
