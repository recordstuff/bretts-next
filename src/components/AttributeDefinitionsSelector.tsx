import { ATTRIBUTE_DATA_TYPE_OPTIONS, AttributeDataType } from '@/models/AttributeDataType'
import { AttributeDefinitionDetail } from '@/models/AttributeDefinitionDetail'
import { AttributeDefinitionNew } from '@/models/AttributeDefinitionNew'
import AddIcon from '@mui/icons-material/Add'
import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormHelperText,
    InputLabel,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Select,
    SelectChangeEvent,
    Stack,
    TextField,
    Typography,
} from '@mui/material'
import { FC, useState } from 'react'

interface AttributeDefinitionsSelectorProps {
    allAttributes: AttributeDefinitionDetail[]
    selectedAttributes: AttributeDefinitionDetail[]
    onChange: (attributes: AttributeDefinitionDetail[]) => void
    onQuickAdd: (definition: AttributeDefinitionNew) => Promise<boolean>
}

const AttributeDefinitionsSelector: FC<AttributeDefinitionsSelectorProps> = ({
    allAttributes,
    selectedAttributes,
    onChange,
    onQuickAdd,
}) => {
    const [dialogOpen, setDialogOpen] = useState(false)
    const [name, setName] = useState('')
    const [dataType, setDataType] = useState(AttributeDataType.String)
    const [showValidation, setShowValidation] = useState(false)
    const [adding, setAdding] = useState(false)
    const selectedGuids = selectedAttributes.map(attribute => attribute.Guid)

    const handleSelectionChange = (event: SelectChangeEvent<string[]>): void => {
        const guids = typeof event.target.value === 'string'
            ? event.target.value.split(',')
            : event.target.value

        onChange(allAttributes.filter(attribute => guids.includes(attribute.Guid)))
    }

    const closeDialog = (): void => {
        if (adding) return

        setDialogOpen(false)
        setName('')
        setDataType(AttributeDataType.String)
        setShowValidation(false)
    }

    const addAttribute = async (): Promise<void> => {
        setShowValidation(true)

        if (name.trim().length === 0) return

        setAdding(true)

        try {
            if (await onQuickAdd({Name: name, DataType: dataType})) {
                setDialogOpen(false)
                setName('')
                setDataType(AttributeDataType.String)
                setShowValidation(false)
            }
        } finally {
            setAdding(false)
        }
    }

    return (
        <Stack spacing={2}>
            <Typography component="h2" variant="h6">Attributes</Typography>
            <Stack direction={{xs: 'column', sm: 'row'}} spacing={2} alignItems={{sm: 'flex-start'}}>
                <FormControl fullWidth>
                    <InputLabel id="attribute-definitions-label">Attribute Definitions</InputLabel>
                    <Select<string[]>
                        labelId="attribute-definitions-label"
                        multiple
                        value={selectedGuids}
                        onChange={handleSelectionChange}
                        input={<OutlinedInput label="Attribute Definitions" />}
                        renderValue={guids => guids
                            .map(guid => allAttributes.find(attribute => attribute.Guid === guid)?.Name)
                            .filter(name => name !== undefined)
                            .join(', ')}
                    >
                        {allAttributes.map(attribute => (
                            <MenuItem key={attribute.Guid} value={attribute.Guid}>
                                <Checkbox checked={selectedGuids.includes(attribute.Guid)} />
                                <ListItemText primary={attribute.Name} />
                            </MenuItem>
                        ))}
                    </Select>
                    <FormHelperText>Select the reusable attributes available to instances of this definition.</FormHelperText>
                </FormControl>
                <Button
                    onClick={() => setDialogOpen(true)}
                    startIcon={<AddIcon />}
                    variant="outlined"
                    sx={{minWidth: {sm: '13rem'}}}
                >
                    New Attribute
                </Button>
            </Stack>
            <Dialog open={dialogOpen} onClose={closeDialog} fullWidth maxWidth="sm">
                <DialogTitle>Add Attribute Definition</DialogTitle>
                <DialogContent>
                    <Stack spacing={3} paddingTop={1}>
                        <TextField
                            autoFocus
                            required
                            error={showValidation && name.trim().length === 0}
                            helperText={showValidation && name.trim().length === 0 ? 'Name is required.' : undefined}
                            label="Name"
                            value={name}
                            onChange={event => setName(event.target.value)}
                        />
                        <TextField
                            select
                            label="Data Type"
                            value={dataType}
                            onChange={event => setDataType(Number(event.target.value) as AttributeDataType)}
                        >
                            {ATTRIBUTE_DATA_TYPE_OPTIONS.map(option => (
                                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                            ))}
                        </TextField>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button color="secondary" disabled={adding} onClick={closeDialog}>Cancel</Button>
                    <Button disabled={adding} onClick={addAttribute} variant="contained">Add</Button>
                </DialogActions>
            </Dialog>
        </Stack>
    )
}

export default AttributeDefinitionsSelector
