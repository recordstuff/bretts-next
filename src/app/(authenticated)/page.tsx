'use client'

import { LeftDrawerContext } from "@/components/LeftDrawerProvider"
import { inventoryItemClient } from '@/clients/InventoryItemClient'
import { PleaseWaitContext } from '@/components/PleaseWaitProvider'
import { Card, CardContent, Typography } from "@mui/material"
import { FC, useCallback, useContext, useEffect, useState } from "react"
import { jwtUtil } from '@/helpers/JwtUtil'
import { JwtRole } from '@/models/Jwt'

const Dashboard: FC = () => {
    const [totalInventoryItems, setTotalInventoryItems] = useState<number | null>(null)
    const { firstBreadcrumb, setPageTitle } = useContext(LeftDrawerContext)
    const {actions: {pleaseWait, doneWaiting}} = useContext(PleaseWaitContext)

    const loadTotalInventoryItems = useCallback(async (): Promise<void> => {
        if (!jwtUtil.hasRole(JwtRole.User)) return

        pleaseWait()
        const inventory = await inventoryItemClient.getInventoryItems(1, 1)
        setTotalInventoryItems(inventory.ItemCount)
        doneWaiting()
    }, [pleaseWait, doneWaiting])

    useEffect(() => {
        setPageTitle('Inventory Dashboard')
        firstBreadcrumb({ title: 'Dashboard', url: '/' })
        loadTotalInventoryItems()
    }, [firstBreadcrumb, setPageTitle, loadTotalInventoryItems])

    return (
        jwtUtil.hasRole(JwtRole.User) && (
            <Card variant="outlined" sx={{maxWidth: '24rem', width: '100%'}}>
                <CardContent>
                    <Typography color="text.secondary" variant="h6">Total Inventory Items</Typography>
                    <Typography aria-live="polite" color="primary" variant="h3">
                        {totalInventoryItems ?? '—'}
                    </Typography>
                </CardContent>
            </Card>
        )
    )
}

export default Dashboard
