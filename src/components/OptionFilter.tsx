import { Dispatch, SetStateAction, useId } from 'react';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { NameValuePair } from '../models/NameValuePair';

export interface Props<T> {
    label: string,
    options: NameValuePair<T>[],
    setSelectedValue: Dispatch<SetStateAction<T>>,
    selectedValue: T,
}

function OptionFilter<T>({ options, label, setSelectedValue, selectedValue }: Props<T>): JSX.Element {
    const labelId = useId();

    const handleChange = (event: SelectChangeEvent) => {
        setSelectedValue(event.target.value as T)
    }

    return (
        <FormControl fullWidth>
            <InputLabel id={labelId}>{label}</InputLabel>
            <Select
                labelId={labelId}
                label={label}
                onChange={handleChange}
                value={`${selectedValue}`}
            >
                {options.map((row, index) => (
                    <MenuItem key={index} value={`${row.Value}`}>{row.Name}</MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}

export default OptionFilter