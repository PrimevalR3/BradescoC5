import Typography from "@mui/material/Typography";
import {Paper} from "@mui/material";

export default function WalletStatistics() {
  return (
      <Paper sx={{p: 3, marginTop: 3}}>
        <Typography
            variant="h5"
            color="text.secondary"
            fontWeight="bold"
            sx={{marginBottom: 3}}
        >Statistics</Typography>
        STATS
      </Paper>
  );
}
