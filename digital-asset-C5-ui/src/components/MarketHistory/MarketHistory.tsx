import PageHeader from "../shared/PageHeader/PageHeader.tsx";
import Container from "@mui/material/Container";
import {useNavigate, useParams} from "react-router-dom";
import {AssetHistoryQuery, PrizeHistoryMetric} from "./AssetHistoryQuery.ts";
import {Button, CircularProgress, Grid, Paper, Stack} from "@mui/material";
import {Line, LineConfig, Liquid} from "@ant-design/plots";
import Typography from "@mui/material/Typography";
import {ChevronLeft, Gavel} from "@mui/icons-material";
import {MARKET} from "../../routes/routeNames.ts";

export default function MarketHistory() {
  const {assetId} = useParams();
  let {data: assetHistory, isLoading: isAssetHistoryLoading} = AssetHistoryQuery(assetId!);
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(MARKET);
  }

  const handleBid = () => {
    console.log('Bid');
  }

  return (
      <Container maxWidth="xl">
        <PageHeader
            title="Asset History"
            subtitle={assetHistory?.name}
        />

        {isAssetHistoryLoading && <CircularProgress/>}

        {!isAssetHistoryLoading && assetHistory &&
            <Stack>
              <Grid container justifyContent="space-between">
                <Grid item xs={1}>
                  <Button
                      startIcon={<ChevronLeft color="inherit"/>}
                      variant='text'
                      onClick={handleBack}
                  >Back</Button>
                </Grid>
                <Grid item>
                  <Button
                      startIcon={<Gavel color="inherit"/>}
                      variant='contained'
                      onClick={handleBid}
                  >Bid</Button>
                </Grid>
              </Grid>
              <Paper sx={{p: 3, marginTop: 3}}>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <img alt="Asset Image" src="/sunflowers.jpg" className="h-96"/>
                  </Grid>
                  <Grid item xs={8}>
                    <Stack spacing={2}>
                      <AssetProperty label="Name" value={assetHistory.name}/>
                      <AssetProperty label="Description" value={assetHistory.description}/>
                      <AssetProperty label="Valuation" value={assetHistory.valuation.toString()}/>
                    </Stack>
                  </Grid>
                </Grid>
              </Paper>
              <Paper sx={{p: 5, marginTop: 3}}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <OwnershipChart value={assetHistory.ownership}/>
                  </Grid>
                  <Grid item xs={6}>
                    <PrizeHistoryChart metrics={assetHistory?.prizeHistory!}/>
                  </Grid>
                </Grid>
              </Paper>
              <Paper sx={{p: 5, marginTop: 3}}>
                <Typography
                    variant="h5"
                    color="text.secondary"
                    fontWeight="bold"
                >Ownership Breakdown</Typography>
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
