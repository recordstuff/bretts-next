import { useCallback, useEffect, useState } from 'react'

interface SessionStorageBoolean {
    isLoaded: boolean
    setValue: (value: boolean) => void
    value: boolean
}

export const useSessionStorageBoolean = (key: string, defaultValue: boolean): SessionStorageBoolean => {
    const [value, setValue] = useState(defaultValue)
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        const storedValue = sessionStorage.getItem(key)
        if (storedValue === null) {
            sessionStorage.setItem(key, String(defaultValue))
        } else {
            setValue(storedValue === 'true')
        }
        setIsLoaded(true)
    }, [defaultValue, key])

    const setStoredValue = useCallback((newValue: boolean): void => {
        sessionStorage.setItem(key, String(newValue))
        setValue(newValue)
    }, [key])

    return {isLoaded, setValue: setStoredValue, value}
}
