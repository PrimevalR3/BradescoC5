import {Placement} from "../ViewPlacements/AssetsQuery.ts";
import {
  Button,
  Chip,
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
import {Fragment, useState} from "react";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {AddCircleRounded, CancelOutlined, Clear, Done, Numbers} from "@mui/icons-material";
import Typography from "@mui/material/Typography";
import {TableDataView} from "../shared/TableDataView/TableDataView.tsx";
import {TokenStatus} from "../ViewPlacements/TokensQuery.ts";

const statusColors: Map<TokenStatus, string> = new Map<TokenStatus, string>([
  [TokenStatus.APPROVED, 'secondary'],
  [TokenStatus.DRAFT, 'orange'],
  [TokenStatus.REJECTED, 'red'],
  [TokenStatus.WITHDRAWN, 'text.secondary'],
])

export function PlacementsTable(props: {
  placements: Placement[],
  onWithdraw?: (id: string) => void,
  onPlace?: (id: string) => void,
  onApprove?: (id: string) => void,
  onReject?: (id: string) => void,
}) {
  return (
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell/>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell/>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.placements
                .sort((a, b) => a.name.localeCompare(b.name))
                .sort((a, b) => a.type.localeCompare(b.type))
                .map((row, index) => (
                    <Row
                        key={index}
                        row={row}
                        onWithdraw={props.onWithdraw}
                        onPlace={props.onPlace}
                        onApprove={props.onApprove}
                        onReject={props.onReject}
                    />
                ))}
          </TableBody>
        </Table>
      </TableContainer>
  );
}

function Row(props: {
  row: Placement,
  onWithdraw?: (id: string) => void,
  onPlace?: (id: string) => void,
  onApprove?: (id: string) => void,
  onReject?: (id: string) => void,
}) {
  const {row} = props;
  const [expandRow, setExpandRow] = useState(false);
  const {assetId, ...tableDataViewProps} = row.props;

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
          <TableCell component="th" scope="row">{row.name}</TableCell>
          <TableCell component="th" scope="row">{row.type}</TableCell>
          <TableCell component="th" scope="row">
            <Typography variant="subtitle2" color={statusColors.get(row.status)}>
              {row.status}
            </Typography>
          </TableCell>
          <TableCell component="th" scope="row">
            {
              row.amount && <Chip color="primary" label={row.amount} icon={<Numbers/>} />
            }
          </TableCell>
          <TableCell component="th" scope="row">
            <div className="flex flex-row justify-end gap-2">
              {
                  props.onWithdraw && row.status !== TokenStatus.NOT_PLACED && (<Button
                      startIcon={<CancelOutlined color="inherit"/>}
                      variant='text'
                      onClick={() => props.onWithdraw!(row.assetId)}
                  >Withdraw</Button>)
              }
              {
                  props.onPlace && row.status === TokenStatus.NOT_PLACED && (<Button
                      startIcon={<AddCircleRounded color="inherit"/>}
                      variant="text"
                      onClick={() => props.onPlace!(row.assetId)}
                  >Place</Button>)
              }
              {
                  props.onApprove && row.status === TokenStatus.DRAFT && (<Button
                      startIcon={<Done color="inherit"/>}
                      variant="text"
                      onClick={() => props.onApprove!(row.assetId)}
                  >Approve</Button>)
              }
              {
                  props.onReject && row.status === TokenStatus.DRAFT && (<Button
                      startIcon={<Clear color="inherit"/>}
                      variant="text"
                      onClick={() => props.onReject!(row.assetId)}
                  >Reject</Button>)
              }
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
