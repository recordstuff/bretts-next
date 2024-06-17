import { FC, useContext, useMemo } from "react"
import { Breadcrumbs, Typography } from "@mui/material"
import Link from "next/link"
import { LeftDrawerContext, VisitedPage } from "./LeftDrawerProvider"

export const Breadcrumbinator: FC = () => {
    const { breadcrumbsJSON } = useContext(LeftDrawerContext)
    // https://stackoverflow.com/questions/59467758/passing-array-to-useeffect-dependency-list    
    const memorized: VisitedPage[] = useMemo(() => JSON.parse(breadcrumbsJSON), [breadcrumbsJSON])

    return (
        <Breadcrumbs sx={{ paddingBottom: 1 }}>
            <Link href='/'>
                Home
            </Link>
            {memorized.map((page, index) => {
                if (index === memorized.length - 1) {
                    return (
                        <Typography key={index}>
                            {page.title}
                        </Typography>
                    )
                }
                else {
                    return (
                        <Link href={page.url} key={index}>
                            {page.title}
                        </Link>
                    )
                }
            })}
        </Breadcrumbs>
    )
}
