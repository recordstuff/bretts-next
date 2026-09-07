import { Grid, Typography } from "@mui/material"
import { FC } from "react"

const NotFound: FC = () => {
  return (
    <Grid
      sx={{
        margin: 4
      }}>
      <Typography variant="h5">404 Error</Typography>
      <Typography sx={{
        marginBottom: "16px"
      }}>The page was not found.</Typography>
    </Grid>
  );
}

export default NotFound