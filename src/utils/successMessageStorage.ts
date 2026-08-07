const SUCCESS_MESSAGE_STORAGE_KEY = 'bretts-next-success-message'

export const storeSuccessMessage = (message: string): void => {
    sessionStorage.setItem(SUCCESS_MESSAGE_STORAGE_KEY, message)
}

export const takeSuccessMessage = (): string | null => {
    const message = sessionStorage.getItem(SUCCESS_MESSAGE_STORAGE_KEY)

    sessionStorage.removeItem(SUCCESS_MESSAGE_STORAGE_KEY)

    return message
}
