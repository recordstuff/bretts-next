'use client'

import { Backdrop, CircularProgress } from "@mui/material"
import { FC, useContext, useMemo } from "react"
import { PleaseWaitContext } from "./PleaseWaitProvider"

export const PleaseWait: FC = () => {
    const {state} = useContext(PleaseWaitContext)

    const areWeWaiting = useMemo(() => state.waitCount > 0, [state])
    
    return (
        <Backdrop
            sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={areWeWaiting}
        >
            <CircularProgress />
        </Backdrop>
    )
}
