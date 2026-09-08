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

const isAuthenticated = () => !jwtUtil.isExpired
const serverIsAuthenticated = () => false

const PrivateRoute: FC<Props> = ({children}) => {
    const authenticated = useSyncExternalStore(subscribe, isAuthenticated, serverIsAuthenticated)
    const router = useRouter();

    useEffect(() => {
        if (jwtUtil.isExpired) {
            router.replace('/login')
        }
    }, [router, authenticated]);

    return (
        <>
            {authenticated && children}
        </>
    )
}

export default PrivateRoute
