import PageHeader from "../shared/PageHeader/PageHeader.tsx";
import Container from "@mui/material/Container";
import {useNavigate, useParams} from "react-router-dom";
import {
  AssetDetailsQuery,
  Offer,
  OwnershipHistoryEntry,
  PrizeHistoryMetric
} from "./AssetDetailsQuery.ts";
import {Button, Chip, CircularProgress, Grid, Input, Paper, Slider, Stack} from "@mui/material";
import {Line, LineConfig, Liquid} from "@ant-design/plots";
import Typography from "@mui/material/Typography";
import {ChevronLeft, ShoppingBasket} from "@mui/icons-material";
import {MARKET} from "../../routes/routeNames.ts";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import {ChangeEvent, useState} from "react";

export default function MarketDetails() {
  const {assetId} = useParams();
  let {data: assetDetails, isLoading: isAssetDetailsLoading} = AssetDetailsQuery(assetId!);
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(MARKET);
  }

  const handleBid = (offerId: string, amount: number) => {
    console.log(`Bid: ${offerId} : ${amount}`);
  }

  return (
      <Container maxWidth="xl">
        <PageHeader
            title="Asset Details"
            subtitle={assetDetails?.name}
        />

        {isAssetDetailsLoading && <CircularProgress/>}

        {!isAssetDetailsLoading && assetDetails &&
            <Stack>
              <Grid container justifyContent="flex-start">
                <Grid item xs={1}>
                  <Button
                      startIcon={<ChevronLeft color="inherit"/>}
                      variant='text'
                      onClick={handleBack}
                  >Back</Button>
                </Grid>
              </Grid>
              <Paper sx={{p: 3, marginTop: 3}}>
                <Typography
                    variant="h5"
                    color="text.secondary"
                    fontWeight="bold"
                    sx={{marginBottom: 3}}
                >Details</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <img alt="Asset Image" src="/sunflowers.jpg" className="h-96"/>
                  </Grid>
                  <Grid item xs={8}>
                    <Stack spacing={2}>
                      <AssetProperty label="Name" value={assetDetails.name}/>
                      <AssetProperty label="Description" value={assetDetails.description}/>
                      <AssetProperty label="Valuation" value={assetDetails.valuation.toString()}/>
                    </Stack>
                  </Grid>
                </Grid>
              </Paper>
              <Paper sx={{p: 5, marginTop: 3}}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <OwnershipChart value={assetDetails.ownership}/>
                  </Grid>
                  <Grid item xs={6}>
                    <PrizeHistoryChart metrics={assetDetails?.prizeHistory!}/>
                  </Grid>
                </Grid>
              </Paper>
              <Paper sx={{p: 5, marginTop: 3}}>
                <Typography
                    variant="h5"
                    color="text.secondary"
                    fontWeight="bold"
                    sx={{marginBottom: 3}}
                >Offers</Typography>
                <OffersTable offers={assetDetails.offers} onBid={handleBid}/>
              </Paper>
              <Paper sx={{p: 5, marginTop: 3}}>
                <Typography
                    variant="h5"
                    color="text.secondary"
                    fontWeight="bold"
                    sx={{marginBottom: 3}}
                >Ownership Breakdown</Typography>
                <OwnershipHistoryTable ownershipHistory={assetDetails.ownershipHistory}/>
              </Paper>
            </Stack>
        }
      </Container>
  );
};

function AssetProperty(props: { label: string, value: string }) {
  return (
      <div>
        <Typography
            variant="caption"
            color="text.secondary"
            fontWeight="bold"
        >{props.label}</Typography>
        <Typography variant="body2">
          {props.value}
        </Typography>
      </div>
  );
}

function OwnershipChart(props: { value: number }) {
  const config = {
    percent: props.value,
    outline: {
      border: 4,
      distance: 8,
    },
    wave: {
      length: 128,
    },
  };

  return (
      <div className="w-full">
        <Typography className="text-center" variant="subtitle2" gutterBottom>
          Ownership
        </Typography>
        <Liquid {...config} />
      </div>
  );
}

function PrizeHistoryChart(props: { metrics: PrizeHistoryMetric[] }) {
  const groupedByDate = Object.values(props.metrics
      .reduce((r, a) => {
        let date = a.date.toLocaleDateString();
        r[date] = r[date] || [];
        r[date].push(a);
        return r;
      }, Object.create(null))) as PrizeHistoryMetric[][];
  const chartRecords = groupedByDate
      .map((v: PrizeHistoryMetric[]) => {
        const length = v.length;
        const summed = v.reduce((a, b) => {
          return {
            date: b.date,
            prize: a.prize + b.prize
          }
        });
        summed.prize = summed.prize / length;
        return {
          name: 'Prize',
          date: summed.date.toLocaleDateString(),
          prize: summed.prize
        }
      });
  const config: LineConfig = {
    data: chartRecords,
    xField: "date",
    yField: "prize",
    seriesField: "name",
    yAxis: {
      label: {
        formatter: (v: any) => `${v} $`,
      },
    },
    smooth: false,
    animation: {
      appear: {
        animation: "path-in",
        duration: 2000,
      },
    },
  };

  return (
      <div className="w-full">
        <Typography className="text-center" variant="subtitle2" gutterBottom>
          Prize History
        </Typography>
        <Line {...config} />
      </div>
  );
}

function OwnershipHistoryTable(props: { ownershipHistory: OwnershipHistoryEntry[] }) {
  const columns: GridColDef[] = [
    {
      field: 'seller',
      headerName: 'Seller',
      width: 430
    },
    {
      field: 'buyer',
      headerName: 'Buyer',
      width: 430
    },
    {
      field: 'date',
      headerName: 'Date',
      description: 'Date of transaction',
      width: 100,
      type: 'date'
    },
    {
      field: 'prize',
      headerName: 'Prize',
      width: 160,
      type: 'number'
    },
    {
      field: 'amount',
      headerName: 'Amount',
      description: 'Amount of tokens sold',
      width: 130,
      type: 'number'
    }
  ];
  return (
      <DataGrid
          columns={columns}
          rows={props.ownershipHistory.map((ownership, index) => {
            return {id: index, ...ownership}
          })}
      />
  );
}

function OffersTable(props: { offers: Offer[], onBid: (id: string, amount: number) => void }) {
  const columns: GridColDef[] = [
    {
      field: 'seller',
      headerName: 'Seller',
      width: 430
    },
    {
      field: 'date',
      headerName: 'Date',
      description: 'Date of transaction',
      width: 100,
      type: 'date'
    },
    {
      field: 'amount',
      headerName: 'Amount',
      description: 'Amount of tokens sold',
      width: 130,
      type: 'number'
    },
    {
      field: 'prize',
      headerName: 'Prize',
      width: 160,
      type: 'number'
    },
    {
      field: 'action',
      headerName: '',
      width: 560,
      renderCell: params => (
          <OfferAction
              offerId={params.row.offerId}
              max={params.row.amount}
              prize={params.row.prize}
              onBid={props.onBid}
          />
      )
    }
  ];
  return (
      <DataGrid
          columns={columns}
          rows={props.offers.sort((a, b) => a.prize - b.prize)
              .map((offer, index) => {
                return {id: index, ...offer}
              })}
      />
  );
}

function OfferAction(props: {offerId: string, max: number, prize: number, onBid: (id: string, amount: number) => void }) {
  const [amount, setAmount] = useState(0);
  const { offerId, max, prize, onBid } = props;

  const handleSliderChange = (_: any, newValue: number | number[]) => {
    setAmount(newValue as number);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.value === '' ? 0 : Number(event.target.value));
  };

  const handleBlur = () => {
    if (amount < 0) {
      setAmount(0);
    } else if (amount > max) {
      setAmount(max);
    }
  };

  const handleDeleteTotal = () => {
    setAmount(0);
  }

  return (
      <Grid container direction="row" justifyContent="flex-end" spacing={4}>
        <Grid item xs>
          <Slider
              value={amount}
              onChange={handleSliderChange}
              max={max}
          />
        </Grid>
        <Grid item>
          <Input
              value={amount}
              size="small"
              onChange={handleInputChange}
              onBlur={handleBlur}
              inputProps={{
                min: 0,
                max,
                type: 'number',
                'aria-labelledby': 'input-slider',
              }}
          />
        </Grid>
        <Grid item>
          <Button
              variant="contained"
              size="small"
              onClick={() => onBid(offerId, amount)}
              startIcon={<ShoppingBasket />}
          >
            Buy
          </Button>
        </Grid>
        <Grid item>
          <Chip
            color={amount > 0 ? "primary" : "default"}
            label={amount * prize}
            onDelete={handleDeleteTotal}
          />
        </Grid>
      </Grid>
  )
}
