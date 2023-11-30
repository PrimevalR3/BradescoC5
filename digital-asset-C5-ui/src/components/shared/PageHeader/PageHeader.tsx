import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <>
      <Typography variant="h5" gutterBottom>
        {title}
      </Typography>
      {subtitle ? (
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          {subtitle}
        </Typography>
      ) : null}
      <Divider sx={{ mb: 2 }} />
    </>
  );
}

export default PageHeader;
