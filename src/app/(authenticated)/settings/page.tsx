'use client'

import { LeftDrawerContext } from "@/components/LeftDrawerProvider"
import { FC, useContext, useEffect } from "react"

const Settings: FC = () => {
    const { firstBreadcrumb, setPageTitle } = useContext(LeftDrawerContext)

    useEffect(() => {
        setPageTitle('Settings')
        firstBreadcrumb({title:'Settings', url: 'settings'})
    }, [setPageTitle, firstBreadcrumb])
    
    return (
    <>
      <p>Administrators are fancier than average people.</p>
    </>
  )
}

export default Settings