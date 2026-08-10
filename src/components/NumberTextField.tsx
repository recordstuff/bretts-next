import { TextField, TextFieldProps } from '@mui/material'
import { ChangeEvent, FC, FocusEvent, useEffect, useRef, useState } from 'react'

type NumberTextFieldProps = Omit<TextFieldProps, 'onChange' | 'type' | 'value'> & {
    allowDecimal?: boolean
    onValueChange: (value: number | null) => void
    value: number | null
}

const formatValue = (value: number | null): string => value === null ? '' : String(value)

const NumberTextField: FC<NumberTextFieldProps> = ({
    allowDecimal = false,
    inputProps,
    onBlur,
    onValueChange,
    value,
    ...textFieldProps
}) => {
    const [displayValue, setDisplayValue] = useState(formatValue(value))
    const lastReportedValue = useRef(value)

    useEffect(() => {
        if (!Object.is(value, lastReportedValue.current)) {
            setDisplayValue(formatValue(value))
        }

        lastReportedValue.current = value
    }, [value])

    const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
        const nextValue = event.target.value
        const numberPattern = allowDecimal ? /^-?\d*(\.\d*)?$/ : /^-?\d*$/

        if (!numberPattern.test(nextValue)) return

        setDisplayValue(nextValue)

        const parsedValue = nextValue === '' || nextValue === '-' || nextValue === '.' || nextValue === '-.'
            ? null
            : Number(nextValue)

        lastReportedValue.current = parsedValue
        onValueChange(parsedValue)
    }

    const handleBlur = (event: FocusEvent<HTMLInputElement>): void => {
        setDisplayValue(formatValue(value))
        onBlur?.(event)
    }

    return (
        <TextField
            {...textFieldProps}
            inputProps={{
                ...inputProps,
                inputMode: allowDecimal ? 'decimal' : 'numeric',
            }}
            onBlur={handleBlur}
            onChange={handleChange}
            type="text"
            value={displayValue}
        />
    )
}

export default NumberTextField
