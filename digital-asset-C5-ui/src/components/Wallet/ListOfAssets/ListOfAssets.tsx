import {MyAsset, MyAssetStatus} from "../MyAssetsQuery.ts";
import {SellDialogProps} from "../SellDialog.tsx";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import {OwnershipProgressBar} from "../../shared/OwnershipProgressBar/OwnershipProgressBar.tsx";
import Profit from "../shared/Profit.tsx";
import {Button, Grid, Paper, Stack} from "@mui/material";
import {History, Sell} from "@mui/icons-material";
import Typography from "@mui/material/Typography";
import {useEffect, useState} from "react";

export default function ListOfAssets(props: {myAssets: MyAsset[], handleOpenSellDialog: (props: SellDialogProps) => void}) {
  const [showHistory, setShowHistory] = useState(false);
  const [filteredAssets, setFilteredAssets] = useState([] as MyAsset[]);

  useEffect(() => {
    setFilteredAssets(showHistory
        ? props.myAssets
        : props.myAssets.filter(asset => asset.status !== MyAssetStatus.SOLD));
  }, [showHistory])

  return (
      <Paper sx={{p: 5, marginTop: 3}}>
        <Stack spacing={3}>
          <Typography
              variant="h5"
              color="text.secondary"
              fontWeight="bold"
          >List of assets</Typography>
          <Grid container direction='row' justifyContent='flex-end'>
            <Button variant='text' startIcon={<History/>} onClick={() => setShowHistory(!showHistory)}>
              {showHistory ? 'Hide' : 'Show'} history
            </Button>
          </Grid>
          <MyAssetsTable assets={filteredAssets} onSell={props.handleOpenSellDialog}/>
          <Stack alignSelf="self-end" spacing={0} alignItems="flex-end">
            <Typography
                variant="subtitle2"
                fontWeight="bold"
            >Total profit</Typography>
            <Profit
                value={filteredAssets
                    .map(asset => asset.marketPrice * asset.amount - asset.purchasePrice * asset.amount)
                    .reduce((a, b) => a + b, 0)
                    .toLocaleString()}
                variant="h4"
            />
          </Stack>
        </Stack>
      </Paper>
  );
};

function MyAssetsTable(props: {assets: MyAsset[], onSell: (props: SellDialogProps) => void}) {
  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Name',
      width: 280
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120
    },
    {
      field: 'amount',
      headerName: 'Amount',
      width: 110,
      type: 'number'
    },
    {
      field: 'ownership',
      headerName: 'Ownership',
      width: 160,
      type: 'number',
      renderCell: params => (
          params.value && <OwnershipProgressBar ownership={params.value}/>
      )
    },
    {
      field: 'purchasePrice',
      headerName: 'Purchase Price',
      width: 160,
      type: 'number'
    },
    {
      field: 'marketPrice',
      headerName: 'Market Price',
      description: 'Last sell price on the market',
      width: 160,
      type: 'number'
    },
    {
      field: 'rateOfReturn',
      headerName: 'Rate of return',
      width: 130,
      type: 'number',
      valueGetter: params => {
        const result = (params.row.marketPrice / params.row.purchasePrice - 1) * 100;
        return `${result.toFixed(2)}%`;
      },
      renderCell: params => <Profit value={params.value}/>
    },
    {
      field: 'profit',
      headerName: 'Profit',
      width: 160,
      type: 'number',
      valueGetter: params => {
        const row = params.row;
        const amount = row.amount;

        return (row.marketPrice * amount - row.purchasePrice * amount).toLocaleString();
      },
      renderCell: params => <Profit value={params.value}/>
    },
    {
      field: 'action',
      headerName: '',
      width: 100,
      renderCell: params =>
          params.row.status === MyAssetStatus.PURCHASED && <Button
              onClick={() => props.onSell({
                assetId: params.row.assetId,
                maxAmount: params.row.amount,
                marketPrice: params.row.marketPrice
              })}
              startIcon={<Sell/>}
          >Sell</Button>
    }
  ];
  return (
      <DataGrid
          columns={columns}
          rows={props.assets.map((asset, index) => {
            return {id: index, ...asset}
          })}
      />
  );
}
