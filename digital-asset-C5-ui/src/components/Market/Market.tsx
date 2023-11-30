import Container from "@mui/material/Container";
import PageHeader from "../shared/PageHeader/PageHeader.tsx";
import {
  Button,
  CircularProgress,
  Collapse,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";
import {Asset, ListAssetsQuery} from "./AssetsQuery.ts";
import {Fragment, useState} from "react";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {Details, Gavel} from "@mui/icons-material";
import {TableDataView} from "../shared/TableDataView/TableDataView.tsx";
import {useNavigate} from "react-router-dom";
import {MARKET_DETAILS} from "../../routes/routeNames.ts";
import {OwnershipProgressBar} from "../shared/OwnershipProgressBar/OwnershipProgressBar.tsx";

export default function Market() {
  const {data, isLoading} = ListAssetsQuery();
  const navigate = useNavigate();

  const handleOnBid = (id: string): void => {
    console.log(`Bid: ${id}`);
  }

  const handleOnShowHistory = (id: string): void => {
    navigate(MARKET_DETAILS.replace(":assetId", id));
  }

  return (
      <Container maxWidth="md">
        <PageHeader
            title="Marketplace"
            subtitle="All Assets"
        />

        {isLoading && <CircularProgress/>}

        {!isLoading && data &&
          <MarketTable assets={data} onBid={handleOnBid} onShowHistory={handleOnShowHistory} />
        }
      </Container>
  )
}

function MarketTable(props: {assets: Asset[], onBid: (id: string) => void, onShowHistory: (id: string) => void}) {
  return (
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell/>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Valuation</TableCell>
              <TableCell>Ownership</TableCell>
              <TableCell/>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.assets.map((row, index) => (
                <Row
                    key={index}
                    asset={row}
                    onBid={props.onBid}
                    onShowHistory={props.onShowHistory}
                />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
  )
}

function Row(props: { asset: Asset, onBid: (id: string) => void , onShowHistory: (id: string) => void}) {
  const {asset} = props;
  const [expandRow, setExpandRow] = useState(false);
  const {id, ...tableDataViewProps} = asset;

  return (
      <Fragment>
        <TableRow sx={{'& > *': {borderBottom: 'unset'}}}>
          <TableCell sx={{width: 10}}>
            <IconButton
                aria-label="expand row"
                size="small"
                onClick={() => setExpandRow(!expandRow)}
            >
              {expandRow ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row">{asset.name}</TableCell>
          <TableCell component="th" scope="row">{asset.description}</TableCell>
          <TableCell component="th" scope="row">{asset.valuation}</TableCell>
          <TableCell component="th" scope="row"><OwnershipProgressBar ownership={asset.ownership}/></TableCell>
          <TableCell component="th" scope="row">
            <div className="flex flex-row justify-end gap-2">
              <Button
                  startIcon={<Details color="inherit"/>}
                  variant='text'
                  onClick={() => props.onShowHistory!(asset.id)}
              >Show Details</Button>
              <Button
                  startIcon={<Gavel color="inherit"/>}
                  variant='text'
                  onClick={() => props.onBid!(asset.id)}
              >Bid</Button>
            </div>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={6}>
            <Collapse in={expandRow} timeout="auto" unmountOnExit>
              <TableDataView data={tableDataViewProps}/>
            </Collapse>
          </TableCell>
        </TableRow>
      </Fragment>
  );
}

