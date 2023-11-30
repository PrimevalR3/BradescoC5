import {Fragment} from "react";
import Typography from "@mui/material/Typography";
import {LinearProgress} from "@mui/material";

export function OwnershipProgressBar(props: { ownership: number }) {
  const percentage = props.ownership * 100;

  return (
      <Fragment>
        <div className="w-full">
          <Typography
              variant="caption"
              display="block"
              color="text.secondary"
              gutterBottom
          >
            {percentage.toFixed(1)}%
          </Typography>
          <LinearProgress
              variant="determinate"
              value={percentage}
          />
        </div>
      </Fragment>
  );
}
