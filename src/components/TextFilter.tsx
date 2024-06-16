import { Dispatch, FC, SetStateAction } from 'react';
import { TextField } from '@mui/material';

export interface Props {
    label: string
    searchText: string
    setSearchText: Dispatch<SetStateAction<string>>
}

const TextFilter: FC<Props> = ({ label, searchText, setSearchText }) => {

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.target.value);
      }

    return (
        <TextField
            fullWidth
            label={label}
            value={searchText}
            onChange={handleChange}
        />
    )
}

export default TextFilter