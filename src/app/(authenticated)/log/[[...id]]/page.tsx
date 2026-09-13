'use client'

import { TextField } from '@mui/material'
import EntityForm from '@/components/EntityForm'
import { LeftDrawerContext } from '@/components/LeftDrawerProvider'
import { PleaseWaitContext } from '@/components/PleaseWaitProvider'
import { AppSnackbarSeverity } from '@/models/AppSnackbarState'
import { emptyLogDetail, LogDetail } from '@/models/LogDetail'
import { LOG_EVENT_LEVEL_OPTIONS, LogEventLevel } from '@/models/LogEventLevel'
import { toLogNew } from '@/models/LogNew'
import { NameValuePair } from '@/models/NameValuePair'
import { logClient } from '@/clients/LogClient'
import OptionFilter from '@/components/OptionFilter'
import { useAppSnackbar } from '@/components/AppSnackbarProvider'
import { useParams, useRouter } from 'next/navigation'
import { ChangeEvent, FC, useCallback, useContext, useEffect, useState } from 'react'

const toLocalDateTime = (value: string | null): string => {
    if (value === null || value.length === 0) {
        return ''
    }

    const date = new Date(value)
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
    return date.toISOString().slice(0, 16)
}

const LOG_DETAIL_LEVEL_OPTIONS: NameValuePair<LogEventLevel | ''>[] = [
    { Name: 'None', Value: '' },
    ...LOG_EVENT_LEVEL_OPTIONS,
]

const Log: FC = () => {
    const [log, setLog] = useState<LogDetail>(emptyLogDetail())
    const { showSnackbar } = useAppSnackbar()
    const { actions: { waitFor } } = useContext(PleaseWaitContext)
    const { addBreadcrumb, setPageTitle } = useContext(LeftDrawerContext)
    const { id: idSegments } = useParams<{ id?: string[] }>()
    const id = idSegments?.[0]
    const router = useRouter()
    const isEdit = id !== undefined

    const getLog = useCallback(async (): Promise<void> => {
        if (id === undefined) {
            return
        }

        setLog(await waitFor(() => logClient.getLog(id)))
    }, [id, waitFor])

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
        let value: string | null = event.target.value
        if (event.target.name === 'TimeStamp') {
            if (value.length === 0) {
                value = null
            }
            else {
                value = new Date(value).toISOString()
            }
        }

        setLog(currentLog => ({ ...currentLog, [event.target.name]: value }))
    }

    const upsert = async (): Promise<void> => {
        if (isEdit) {
            setLog(await waitFor(() => logClient.updateLog(log)))
            showSnackbar('This log entry was saved.', AppSnackbarSeverity.Success)
        }
        else {
            const insertedLog = await waitFor(() => logClient.insertLog(toLogNew(log)))
            showSnackbar('This log entry was created.', AppSnackbarSeverity.Success)
            router.push(`/log/${insertedLog.Guid}`)
        }
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
        await waitFor(() => logClient.deleteLog(id))
        showSnackbar('This log entry was deleted.', AppSnackbarSeverity.Success)
        router.push('/logs')
    }

    const updateLevel = (level: LogEventLevel | ''): void => {
        if (level === '') {
            setLog(currentLog => ({ ...currentLog, Level: null }))
            return
        }

        setLog(currentLog => ({ ...currentLog, Level: level }))
    }

    let selectedLevel: LogEventLevel | '' = ''
    if (log.Level !== null) {
        selectedLevel = log.Level
    }

    return (
        <EntityForm entityName="log entry" isEdit={isEdit} onCancel={handleCancel} onDelete={handleDelete} onSave={upsert}>
            {isEdit && <TextField disabled fullWidth label="Identifier" value={log.Guid} />}
            <TextField fullWidth label="Timestamp" name="TimeStamp" onChange={handleChange} slotProps={{ inputLabel: { shrink: true } }} type="datetime-local" value={toLocalDateTime(log.TimeStamp)} />
            <OptionFilter label="Level" options={LOG_DETAIL_LEVEL_OPTIONS} selectedValue={selectedLevel} setSelectedValue={updateLevel} />
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
