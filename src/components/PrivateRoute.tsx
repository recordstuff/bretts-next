'use client'

import { useEffect, useSyncExternalStore } from 'react';
import { jwtUtil } from "../helpers/JwtUtil"
import { FC } from "react"
import { useRouter } from 'next/navigation';

interface Props {
    children: React.ReactNode;
}

const subscribe = (onChange: () => void) => {
    window.addEventListener('storage', onChange)
    return () => window.removeEventListener('storage', onChange)
}

const checkIsAuthenticated = () => !jwtUtil.isExpired
const serverIsAuthenticated = () => false

const PrivateRoute: FC<Props> = ({children}) => {
    // Read authentication from browser session storage instead of duplicating it in React state.
    // subscribe asks React to recheck when a storage event arrives; checkIsAuthenticated reads the JWT.
    // The server snapshot is false because session storage is only available in the browser.
    // Storage events do not fire in the tab that writes the value, so this is not a same-tab notification.
    const isAuthenticated = useSyncExternalStore(subscribe, checkIsAuthenticated, serverIsAuthenticated)
    const router = useRouter();

    useEffect(() => {
        if (jwtUtil.isExpired) {
            router.replace('/login')
        }
    }, [router, isAuthenticated]);

    return (
        <>
            {isAuthenticated && children}
        </>
    )
}

export default PrivateRoute
