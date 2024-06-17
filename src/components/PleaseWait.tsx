'use client'

import { Backdrop, CircularProgress } from "@mui/material"
import { FC, useContext } from "react"
import { PleaseWaitContext } from "./PleaseWaitProvider"

export const PleaseWait: FC = () => {
    const {waitCount} = useContext(PleaseWaitContext)

    return (
        <Backdrop
            sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={waitCount > 0}
        >
            <CircularProgress />
        </Backdrop>
    )
}
