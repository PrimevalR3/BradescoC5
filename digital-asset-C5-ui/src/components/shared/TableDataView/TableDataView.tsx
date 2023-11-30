import {Fragment} from "react";
import {Box} from "@mui/material";
import Typography from "@mui/material/Typography";

export function TableDataView(props: { data: any }) {
  const placementProps = props.data;

  return (
      <Fragment>
        <Box sx={{margin: 1}}>
          <div className="flex justify-evenly items-center">
            {Object.keys(placementProps).map(propKey => (
                <Fragment key={propKey}>
                  <div className="flex flex-col">
                    <Typography
                        variant="caption"
                        display="block"
                        color="text.secondary"
                    >
                      {propKey}
                    </Typography>
                    <Typography variant="subtitle2">
                      {placementProps[propKey]}
                    </Typography>
                  </div>
                </Fragment>
            ))}
          </div>
        </Box>
      </Fragment>
  );
}
