import { FC, useContext, useMemo } from "react"
import { Breadcrumbs, Link as MuiLink, Typography } from "@mui/material"
import NextLink from "next/link"
import { LeftDrawerContext, VisitedPage } from "./LeftDrawerProvider"

export const Breadcrumbinator: FC = () => {
    const { breadcrumbsJSON } = useContext(LeftDrawerContext)
    // https://stackoverflow.com/questions/59467758/passing-array-to-useeffect-dependency-list    
    const memorized: VisitedPage[] = useMemo(() => JSON.parse(breadcrumbsJSON), [breadcrumbsJSON])

    return (
        <Breadcrumbs sx={{ paddingBottom: 1 }}>
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
                        <MuiLink
                            component={NextLink}
                            href={page.url}
                            key={index}
                            underline="always"
                            sx={{
                                color: 'primary.main',
                                fontWeight: 500,
                                textDecorationThickness: '1px',
                                textUnderlineOffset: '0.2em',
                                transition: 'color 120ms ease, text-decoration-thickness 120ms ease',
                                '&:hover': {
                                    color: 'primary.light',
                                    textDecorationThickness: '2px',
                                },
                                '&:active': {
                                    color: 'primary.dark',
                                    textDecorationThickness: '3px',
                                },
                            }}
                        >
                            {page.title}
                        </MuiLink>
                    )
                }
            })}
        </Breadcrumbs>
    )
}
