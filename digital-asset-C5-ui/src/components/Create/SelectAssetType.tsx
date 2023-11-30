import Container from "@mui/material/Container";
import PageHeader from "../shared/PageHeader/PageHeader.tsx";
import {Button, Card, CardActions, CardContent, Grid} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {CREATE_FORM} from "../../routes/routeNames.ts";
import {assetTypes} from "./createDescriptor.ts";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

export default function SelectAssetType() {
  const navigate = useNavigate();

  const handleOnSubmit = (key: string) => {
    navigate(CREATE_FORM.replace(':assetTypeKey', key));
  }

  return (
      <Container maxWidth="xl">
        <PageHeader
            title="Select Asset Type"
        />

        <div className="mt-5">
          <Grid container spacing={3} direction="row" justifyContent="center" align-items="center">
            {assetTypes.map(assetType => (
                <Grid key={assetType.key} item>
                  <Card sx={{ width: 400, height: 300 }} className="flex flex-col justify-between">
                    <CardContent>
                      <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                        Asset Type
                      </Typography>
                      <Typography variant="h5" component="div">
                        {assetType.label}
                      </Typography>
                      <Divider sx={{ mb: 2, mt: 1 }} />
                      <Typography variant="body2">
                        {assetType.message}
                      </Typography>
                    </CardContent>
                    <CardActions className="flex justify-end">
                      <Button
                          color="secondary"
                          onClick={() => handleOnSubmit(assetType.key)}
                      >Select</Button>
                    </CardActions>
                  </Card>
                </Grid>
            ))}
          </Grid>
        </div>

      </Container>
  );
}
