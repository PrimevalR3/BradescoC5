import Button from "@mui/material/Button";
import {CircularProgress} from "@mui/material";

export interface LoadingButtonProps {
  buttonProps: any;
  label: string;
  isLoading: boolean;
}

export default function LoadingButton(props: LoadingButtonProps) {
  return (
      <Button
          {...props.buttonProps}
          startIcon={props.isLoading ? (<CircularProgress color="secondary" size={20} />) : props.buttonProps.startIcon}
      >
        {props.label}
      </Button>
  )
};
