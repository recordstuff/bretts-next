'use client'

import { TextField } from '@mui/material'
import EntityForm from '@/components/EntityForm'
import { LeftDrawerContext } from '@/components/LeftDrawerProvider'
import { PleaseWaitContext } from '@/components/PleaseWaitProvider'
import { AppSnackbarSeverity } from '@/models/AppSnackbarState'
import { emptyLogEntry, LogEntry } from '@/models/LogEntry'
import { logClient } from '@/clients/LogClient'
import { useAppSnackbar } from '@/components/AppSnackbarProvider'
import { useParams, useRouter } from 'next/navigation'
import { ChangeEvent, FC, useCallback, useContext, useEffect, useState } from 'react'

const toLocalDateTime = (value: string | null): string => {
    if (value === null || value.length === 0) {
        return ''
    }

    const date = new Date(value)
    const timezoneOffset = date.getTimezoneOffset() * 60_000
    return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 16)
}

const Log: FC = () => {
    const [log, setLog] = useState<LogEntry>(emptyLogEntry())
    const { showSnackbar } = useAppSnackbar()
    const { actions: { pleaseWait, doneWaiting } } = useContext(PleaseWaitContext)
    const { addBreadcrumb, setPageTitle } = useContext(LeftDrawerContext)
    const { id } = useParams<{ id: string }>()
    const router = useRouter()
    const isEdit = id !== undefined

    const getLog = useCallback(async (): Promise<void> => {
        if (id === undefined) {
            return
        }

        pleaseWait()
        setLog(await logClient.getLog(id))
        doneWaiting()
    }, [id, pleaseWait, doneWaiting])

    useEffect(() => {
        let pageTitle = 'Add Log'
        let url = '/log'
        if (isEdit) {
            pageTitle = 'Edit Log'
            url = `${url}/${id}`
        }

        setPageTitle(pageTitle)
        addBreadcrumb({ title: pageTitle, url })
        // The response updates state after await; this rule misidentifies async loaders.
        // eslint-disable-next-line react-hooks/set-state-in-effect -- https://github.com/react/react/issues/34905
        getLog()
    }, [id, isEdit, setPageTitle, addBreadcrumb, getLog])

    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        const updatedLog = { ...log }
        const property = event.target.name as keyof LogEntry
        if (property === 'TimeStamp') {
            updatedLog.TimeStamp = new Date(event.target.value).toISOString()
        }
        else {
            updatedLog[property] = event.target.value as never
        }
        setLog(updatedLog)
    }

    const upsert = async (): Promise<void> => {
        pleaseWait()
        if (isEdit) {
            setLog(await logClient.updateLog(log))
            showSnackbar('This log entry was saved.', AppSnackbarSeverity.Success)
        }
        else {
            const insertedLog = await logClient.insertLog(log)
            showSnackbar('This log entry was created.', AppSnackbarSeverity.Success)
            router.push(`/log/${insertedLog.Id}`)
        }
        doneWaiting()
    }

    const handleCancel = async (): Promise<void> => {
        if (!isEdit) {
            router.back()
            return
        }
        await getLog()
    }

    const handleDelete = async (): Promise<void> => {
        if (id === undefined) {
            return
        }
        pleaseWait()
        await logClient.deleteLog(id)
        doneWaiting()
        showSnackbar('This log entry was deleted.', AppSnackbarSeverity.Success)
        router.push('/logs')
    }

    return (
        <EntityForm entityName="log entry" isEdit={isEdit} onCancel={handleCancel} onDelete={handleDelete} onSave={upsert}>
            {isEdit && <TextField disabled fullWidth label="Id" value={log.Id} />}
            <TextField fullWidth label="Timestamp" name="TimeStamp" onChange={handleChange} slotProps={{ inputLabel: { shrink: true } }} type="datetime-local" value={toLocalDateTime(log.TimeStamp)} />
            <TextField fullWidth label="Level" name="Level" onChange={handleChange} value={log.Level ?? ''} />
            <TextField fullWidth label="Message" multiline name="Message" onChange={handleChange} value={log.Message ?? ''} />
            <TextField fullWidth label="Message Template" multiline name="MessageTemplate" onChange={handleChange} value={log.MessageTemplate ?? ''} />
            <TextField fullWidth label="Exception" minRows={3} multiline name="Exception" onChange={handleChange} value={log.Exception ?? ''} />
            <TextField fullWidth label="Log Event JSON" minRows={4} multiline name="LogEvent" onChange={handleChange} value={log.LogEvent ?? ''} />
            <TextField fullWidth label="Source Context" name="SourceContext" onChange={handleChange} value={log.SourceContext ?? ''} />
            <TextField fullWidth label="Server Name" name="ServerName" onChange={handleChange} value={log.ServerName ?? ''} />
            <TextField fullWidth label="Environment" name="Environment" onChange={handleChange} value={log.Environment ?? ''} />
        </EntityForm>
    )
}

export default Log
