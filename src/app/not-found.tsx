import { Stack, Typography } from "@mui/material"
import { FC } from "react"

const NotFound: FC = () => {
  return (
    <Stack
      sx={{
        margin: 4
      }}>
      <Typography variant="h5">404 Error</Typography>
      <Typography sx={{
        marginBottom: "16px"
      }}>The page was not found.</Typography>
    </Stack>
  );
}

export default NotFound
