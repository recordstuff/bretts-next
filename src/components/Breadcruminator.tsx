import { FC } from "react"
import { Breadcrumbs, Typography } from "@mui/material"
import { VisitedPage } from "@/models/VisitedPage"
import Link from "next/link"

export const Breadcrumbinator: FC = () => {
//    const breadcrumbs = useSelector((state: RootState) => state.breadcrumbs.visitedPages)

    const breadcrumbs: VisitedPage[] = []

    return (    
        <Breadcrumbs sx={{paddingBottom: 1}}>
            <Link href='/'>
                Home
            </Link>
            {breadcrumbs.map((page, index) => {
                if (index === breadcrumbs.length - 1) {
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
