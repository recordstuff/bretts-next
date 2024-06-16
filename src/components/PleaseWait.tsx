import { Backdrop, CircularProgress } from "@mui/material"
import { FC } from "react"

export const PleaseWait: FC = () => {
    const waitCount: number = 0 // useSelector((state: RootState) => state.waitSpinner.waitCount)

    return (
        <Backdrop
            sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={waitCount > 0}
        >
            <CircularProgress />
        </Backdrop>
    )
}
