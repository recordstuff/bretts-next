import { useCallback, useEffect, useState } from 'react'

interface LocalStorageBoolean {
    isLoaded: boolean
    setValue: (value: boolean) => void
    value: boolean
}

export const useLocalStorageBoolean = (key: string, defaultValue: boolean): LocalStorageBoolean => {
    const [value, setValue] = useState(defaultValue)
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        const storedValue = localStorage.getItem(key)
        if (storedValue === null) {
            localStorage.setItem(key, String(defaultValue))
        } else {
            setValue(storedValue === 'true')
        }
        setIsLoaded(true)
    }, [defaultValue, key])

    const setStoredValue = useCallback((newValue: boolean): void => {
        localStorage.setItem(key, String(newValue))
        setValue(newValue)
    }, [key])

    return {isLoaded, setValue: setStoredValue, value}
}
