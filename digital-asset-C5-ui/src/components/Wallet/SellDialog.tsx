import React from "react";
import {useFormik} from "formik";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Slider,
  Stack,
  TextField
} from "@mui/material";
import {SellMyAssetRequest} from "./MyAssetsQuery.ts";

interface Props {
  dialogProps: SellDialogProps;
  onClose: (data: SellMyAssetRequest | undefined | null) => void;
}

export interface SellDialogProps {
  assetId?: string;
  maxAmount?: number;
  marketPrice?: number;
}

const SellDialog: React.FC<Props> = ({ dialogProps, onClose }) => {
  const sellForm = useFormik({
    initialValues: {
      amount: dialogProps.maxAmount!,
      price: dialogProps.marketPrice!
    },
    onSubmit: (values) => onClose({
      ...values,
      assetId: dialogProps.assetId!,
    })
  });

  const handleBlur = () => {
    if (sellForm.values.amount < 0) {
      sellForm.setFieldValue('amount', 0);
    } else if (sellForm.values.amount > dialogProps.maxAmount!) {
      sellForm.setFieldValue('amount', dialogProps.maxAmount);
    }
  };

  return (
      <Dialog open={!!dialogProps}>
        <DialogTitle>Sell Asset</DialogTitle>
        <form onSubmit={sellForm.handleSubmit}>
          <DialogContent>
            <Stack spacing={2} sx={{ marginTop: 1 }}>
              <Grid container direction="row" justifyContent="flex-end" spacing={4}>
                <Grid item xs>
                  <Slider
                      value={sellForm.values.amount}
                      max={dialogProps.maxAmount}
                      onChange={(_, value) => sellForm.setFieldValue('amount', value)}
                  />
                </Grid>
                <Grid item>
                  <TextField
                      id="amount"
                      name="amount"
                      label="Amount"
                      type="number"
                      size="small"
                      value={sellForm.values.amount}
                      onChange={sellForm.handleChange}
                      onFocus={(event: any) => event.target.value == 0 && event.target.select()}
                      onBlur={handleBlur}
                      inputProps={{
                        min: 0,
                        max: dialogProps.maxAmount,
                        type: 'number',
                        'aria-labelledby': 'input-slider',
                      }}
                  />
                </Grid>
              </Grid>

              <TextField
                  id="price"
                  name="price"
                  label="Price"
                  type="number"
                  value={sellForm.values.price}
                  onChange={sellForm.handleChange}
                  onFocus={(event: any) => event.target.value == 0 && event.target.select()}
              />
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

export default SellDialog;
