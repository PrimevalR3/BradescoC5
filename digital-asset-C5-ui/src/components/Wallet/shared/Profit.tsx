import {OverridableStringUnion} from "@mui/types";
import {Variant} from "@mui/material/styles/createTypography";
import {TypographyPropsVariantOverrides} from "@mui/material/Typography/Typography";
import Typography from "@mui/material/Typography";

export default function Profit(props: { value: string, variant?: OverridableStringUnion<Variant | 'inherit', TypographyPropsVariantOverrides> }) {
  const value = parseFloat(props.value);
  const color = profitColor(value);

  return (
      <Typography color={color} variant={props.variant || 'body1'}>{props.value}</Typography>
  );
}

function profitColor(value: number) {
  let color;
  if (value > 0) {
    color = 'green';
  } else if (value < 0) {
    color = 'red'
  } else {
    color = '';
  }

  return color;
}
