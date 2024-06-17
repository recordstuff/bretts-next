'use client'

import { FC, createContext, useMemo, useState } from "react"

export interface VisitedPage {
    title: string
    url: string
}

interface Props {
    children?: React.ReactNode
}

export const LeftDrawerContext = createContext({
    atHome: () => { },
    firstBreadcrumb: (visitedPage: VisitedPage) => { },
    addBreadcrumb: (visitedPage: VisitedPage) => { },
    breadcrumbsJSON: JSON.stringify([]),
    pageTitle: '',
    setPageTitle: (title: string) => { }
})

export const LeftDrawerProvider: FC<Props> = ({ children }) => {
    const SESSION_KEY = 'OurBreadcrumbs'

    const initialState = (): string => {
        const persistedBreadcrumbs = localStorage.getItem(SESSION_KEY)

        if (persistedBreadcrumbs !== null) {
            return persistedBreadcrumbs
        }

        return JSON.stringify([])
    }

    const isLastBreadcrumb = (visitedPages: VisitedPage[], pageToCheck: VisitedPage): boolean => {
        if (visitedPages.length === 0) return false

        const lastBreadcrumb = visitedPages[visitedPages.length - 1]

        return lastBreadcrumb.title === pageToCheck.title
            && lastBreadcrumb.url === pageToCheck.url
    }

    const persist = (visitedPage: VisitedPage[]): void => {
        const state = JSON.stringify(visitedPage)
        localStorage.setItem(SESSION_KEY, state)
        setBreadcrumbsJSON(state)
    }

    const [pageTitle, setPageTitle] = useState('')
    const [breadcrumbsJSON, setBreadcrumbsJSON] = useState<string>(initialState())

    const memorized = useMemo(() => ({
        atHome: () => {
            const newState: VisitedPage[] = []
            persist(newState)
        },
        firstBreadcrumb: (visitedPage: VisitedPage) => {
            const newState: VisitedPage[] = [visitedPage]
            persist(newState)
        },
        addBreadcrumb: (visitedPage: VisitedPage) => { 
            const persistedBreadcrumbs = localStorage.getItem(SESSION_KEY)

            if (persistedBreadcrumbs === null) {
                return // should never happen
            }
    
            const breadcrumbs = JSON.parse(persistedBreadcrumbs)
    
            if (isLastBreadcrumb(breadcrumbs, visitedPage)) return
    
            breadcrumbs.push(visitedPage)

            persist(breadcrumbs)
        },
        breadcrumbsJSON,
        pageTitle,
        setPageTitle
    }), [breadcrumbsJSON, pageTitle])

    return (
        <LeftDrawerContext.Provider value={memorized}>
            {children}
        </LeftDrawerContext.Provider>
    )
}