import { FC, ReactNode } from 'react';
import { Grid, useMediaQuery, useTheme } from '@mui/material';

export interface Props {
    leftElement: ReactNode
    rightElement: ReactNode
}

const Paginator: FC<Props> = ({ leftElement, rightElement }) => {
    const theme = useTheme();
    const isXl = useMediaQuery(theme.breakpoints.up('xl'));
    const isMd = useMediaQuery(theme.breakpoints.up('md'));
    const isSm = useMediaQuery(theme.breakpoints.down('md'));
    
    let paddingHorizontal = 0
    
    if (isXl) {
        paddingHorizontal = 4
    }
    else if (isMd) {
        paddingHorizontal = 2
    }
    
    let paddingVertical = 0
    
    if (isSm) {
        paddingVertical = 4
    }

    return (
        <Grid container>
            <Grid item xs={12} md={6} xl={5} paddingRight={paddingHorizontal}>
                {leftElement}
            </Grid>
            <Grid item xs={12} md={6} xl={5} paddingLeft={paddingHorizontal} paddingTop={paddingVertical}>
                {rightElement}
            </Grid>
        </Grid>)
}

export default Paginator