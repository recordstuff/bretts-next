'use client'

import { useEffect, useState } from 'react';
import { jwtUtil } from "../helpers/JwtUtil"
import { FC } from "react"
import { useRouter } from 'next/navigation';

interface Props {
    children: React.ReactNode;
}

const PrivateRoute: FC<Props> = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
    const router = useRouter();

    useEffect(() => {
        if (jwtUtil.isExpired) {
            router.replace('/login')
            setIsAuthenticated(false)
        }
        else {
            setIsAuthenticated(true)
        }
    }, [router]);

    return (
        <>
            {isAuthenticated && children}
        </>
    )
}

export default PrivateRoute