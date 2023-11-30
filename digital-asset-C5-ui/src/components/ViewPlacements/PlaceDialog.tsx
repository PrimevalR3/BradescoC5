import {PlaceRequest} from "./AssetsQuery.ts";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  Stack,
  TextField
} from "@mui/material";
import React from "react";
import {useFormik} from "formik";
import MenuItem from "@mui/material/MenuItem";

const issuers = [
    'CN=Bank2, OU=Test Dept, O=R3, L=London, C=GB',
    'CN=Bank1, OU=Test Dept, O=R3, L=London, C=GB',
    'CN=Bank, OU=Test Dept, O=R3, L=London, C=GB',
];

const cnFromIssuer = (issuer: string): string => issuer.substring(
    issuer.indexOf('CN=') + 3,
    issuer.indexOf(',')
)

interface Props {
  dialogProps: PlaceDialogProps;
  onClose: (data: PlaceRequest | undefined | null) => void;
}

export interface PlaceDialogProps {
  assetId: string;
}

const PlaceDialog: React.FC<Props> = ({ dialogProps, onClose }) => {
  const placeForm = useFormik({
    initialValues: {
      amount: 0,
      issuer: ''
    },
    onSubmit: (values) => onClose({
      ...values,
      assetId: dialogProps.assetId,
      symbol: 'SYM123'
    })
  });

  return (
      <Dialog open={!!dialogProps}>
        <DialogTitle>Place Asset</DialogTitle>
        <form onSubmit={placeForm.handleSubmit}>
          <DialogContent>
            <Stack spacing={2} sx={{ marginTop: 1 }}>
                <TextField
                    id="amount"
                    name="amount"
                    label="Amount"
                    type="number"
                    value={placeForm.values.amount}
                    onChange={placeForm.handleChange}
                    onFocus={(event: any) => event.target.value == 0 && event.target.select()}
                />
                <FormControl fullWidth>
                  <InputLabel id="issuer-label">Issuer</InputLabel>
                  <Select
                      id="issuer"
                      name="issuer"
                      labelId="issuer-label"
                      value={placeForm.values.issuer}
                      label="Issuer"
                      onChange={placeForm.handleChange}
                  >
                    {
                      issuers.sort((a, b) => a.localeCompare(b)).map((issuer) => (
                        <MenuItem
                            key={issuer}
                            value={issuer}
                        >{cnFromIssuer(issuer)}</MenuItem>
                      ))
                    }
                  </Select>
                </FormControl>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => onClose(null)} variant="outlined">Close</Button>
            <Button type="submit" variant="contained">Submit</Button>
          </DialogActions>
        </form>
      </Dialog>
  );
}

export default PlaceDialog;
