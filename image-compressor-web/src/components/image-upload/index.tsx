"use client";

import { useCallback, useEffect, useMemo } from "react";
import * as yup from "yup";
import { toast } from "react-toastify";
import { DataGrid } from "@mui/x-data-grid";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { ErrorMessage, Formik, Field, Form } from "formik";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import {
  Autocomplete,
  Button,
  Container,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";

import { publicRuntimeConfig } from "@/../next.config";
import { User } from "@/types";
import { useDataFetchingHelper, useGetUsers, useUploadImage } from "@/hooks";

export function ImageUpload({ onComplete }: { onComplete: () => void }) {
  const { state } = useDataFetchingHelper({ page: 0, pageSize: 999999 });
  const { data, loading } = useGetUsers(state);
  const uploadImage = useUploadImage();

  const connection = useMemo(
    () =>
      new HubConnectionBuilder()
        .withUrl(`${publicRuntimeConfig?.apiURL}/hubs`)
        .withAutomaticReconnect()
        .build(),
    []
  );

  const startConnection = async () => {
    try {
      await connection.start();

      connection.on("NotifyCompleteCompressingProcess", () => {
        toast.success("Image compression process is completed.");
        onComplete();
      });
    } catch (err) {
      const error = err as Error;
      toast.error(error.message);
    }
  };

  useEffect(() => {
    startConnection();
  }, []);

  const formikConfig = useMemo(
    () => ({
      initialValues: {
        user: null,
        images: [],
      },
      validationSchema: yup.object({
        images: yup
          .array<File>()
          .required("Image field cannot be empty")
          .test(
            "empty",
            "Images cannot be empty",
            (value) => value && value.length !== 0
          )
          .test("fileType", "Invalid file format", (value) => {
            return value.every((file) =>
              ["image/jpeg", "image/png", "image/gif"].includes(file.type)
            );
          })
          .test("fileSize", "File size too large (max 5MB)", (value) => {
            return value.every((file) => file.size <= 5 * 1024 * 1024);
          }),
        user: yup.object<User>().required("User field cannot be empty"),
      }),
    }),
    []
  );

  const handleImageUpload = useCallback(async (values: any) => {
    const formData = new FormData();

    values.images.forEach((image: File) => {
      formData.append(image.name, image);
    });

    await uploadImage({
      data: formData,
      params: {
        userRowKey: values.user.rowKey,
        userPartitionKey: values.user.partitionKey,
        clientId: connection.connectionId,
      },
    });

    onComplete();
  }, []);

  return (
    <Container maxWidth="md" sx={{ minHeight: 500 }}>
      <Formik {...formikConfig} onSubmit={handleImageUpload}>
        {({ values, errors, touched, handleBlur, setFieldValue }) => (
          <Form>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                {data && (
                  <Autocomplete
                    disablePortal
                    size="small"
                    loading={loading}
                    options={data.items}
                    onBlur={handleBlur}
                    onChange={(_, value) => setFieldValue("user", value)}
                    getOptionLabel={(user: User) =>
                      `${user.name} ${user.surname} - ${user.email}`
                    }
                    renderInput={(params) => (
                      <Field
                        {...params}
                        as={TextField}
                        name="fieldName"
                        id="fieldName"
                        value={values.user}
                        onBlur={handleBlur}
                        error={touched.user && errors.user !== undefined}
                        helperText={touched.user && errors.user}
                      />
                    )}
                  />
                )}
              </Grid>
              <Grid item xs>
                <IconButton color="primary" component="label">
                  <Typography>Select Image</Typography>
                  <input
                    hidden
                    multiple
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setFieldValue("images", [...e.target.files])
                    }
                  />
                  <AttachFileIcon fontSize="medium" />
                </IconButton>
                <ErrorMessage
                  name="images"
                  component="div"
                  className="text-red-600"
                />
              </Grid>
              <Grid item xs={4}>
                <Button variant="outlined" type="submit" sx={{ mt: 0.3 }}>
                  Upload Image
                </Button>
              </Grid>
              <Grid
                container
                item
                xs={12}
                sx={{ textAlign: "center", margin: 2 }}
              >
                <DataGrid
                  sx={{ minHeight: 350 }}
                  rows={values.images}
                  hideFooterPagination
                  disableRowSelectionOnClick
                  getRowId={(row: File) => row.name}
                  columns={[
                    { field: "name", headerName: "Name", width: 150 },
                    { field: "type", headerName: "Image Type", width: 150 },
                    { field: "size", headerName: "Size (B)", width: 100 },
                  ]}
                />
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </Container>
  );
}
