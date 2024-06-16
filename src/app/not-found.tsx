import { Grid, Typography } from "@mui/material"
import { FC } from "react"

const NotFound: FC = () => {
  return (
    <Grid item margin={4}>
      <Typography variant="h5">404 Error</Typography>
      <Typography paragraph>The page was not found.</Typography>
    </Grid>
  )
}

export default NotFound