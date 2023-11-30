import Container from "@mui/material/Container";
import {useFormik} from "formik";
import {useNavigate, useParams} from "react-router-dom";
import {assetTypeFromKey, FormField, formFields} from "./createDescriptor.ts";
import {Button, Paper, Stack, TextField} from "@mui/material";
import PageHeader from "../shared/PageHeader/PageHeader.tsx";
import {CREATE_SELECT, VIEW} from "../../routes/routeNames.ts";
import LoadingButton from "../shared/LoadingButton/LoadingButton.tsx";

export default function CreateForm() {
  const {assetTypeKey} = useParams();
  const assetType = assetTypeFromKey(assetTypeKey!);
  const assetTypeProps = formFields.get(assetTypeKey!)!;

  const handleBack = () => {
    navigate(CREATE_SELECT);
  }
  const mutation = assetTypeProps.mutation(() => navigate(VIEW));

  const createForm= useFormik({
    initialValues: createInitialValues(assetTypeProps.formFields),
    onSubmit: (values) => {
      mutation.mutate({
        ...values
      });
    }
  });
  const navigate = useNavigate();

  return (
      <Container maxWidth="md">
        <Paper sx={{p: 5}}>
          <PageHeader
              title={assetType.label}
          />

          <div className="mt-5">
            <form onSubmit={createForm.handleSubmit}>
              <Stack spacing={2}>
                {assetTypeProps.formFields.map((field: FormField) => (
                    <TextField
                        id={field.key}
                        name={field.key}
                        label={field.name}
                        key={field.key}
                        type={field.type}
                        value={createForm.values[field.key]}
                        onChange={createForm.handleChange}
                    />
                ))}
                <div className="flex justify-end">
                  <Button variant="text" onClick={handleBack}>
                    Back
                  </Button>
                  <LoadingButton buttonProps={{
                    variant: "contained",
                    type: "submit"
                  }} label="Submit" isLoading={mutation.status === 'loading'}/>
                </div>
              </Stack>
            </form>
          </div>
        </Paper>
      </Container>
  );
}

const createInitialValues: any = (formFields: FormField[]) => {
  let result: any = {};
  formFields.forEach(field => result[field.key] = '');
  return result;
}
