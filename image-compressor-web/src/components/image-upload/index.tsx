"use client";

import React, { useMemo } from "react";
import * as yup from "yup";
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

import { User } from "@/types";
import { DataGrid } from "@mui/x-data-grid";

type ImageUploadProps = {
  users: User[];
  onSubmit: (values: { userId: string; images: File[] }) => void;
};

export function ImageUpload({ users, onSubmit }: ImageUploadProps) {
  const formikConfig = useMemo(
    () => ({
      initialValues: {
        userId: "",
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
        userId: yup.string().required("User Id field cannot be empty"),
      }),
    }),
    [onSubmit]
  );

  return (
    <Container maxWidth="md" sx={{ minHeight: 500 }}>
      <Formik {...formikConfig} onSubmit={onSubmit}>
        {({ values, errors, touched, handleBlur, setFieldValue }) => (
          <Form>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Autocomplete
                  disablePortal
                  size="small"
                  options={users}
                  onBlur={handleBlur}
                  onChange={(_, value) =>
                    setFieldValue("userId", value?.rowKey)
                  }
                  getOptionLabel={(user: User) =>
                    `${user.name} ${user.surname} - ${user.email}`
                  }
                  renderInput={(params) => (
                    <Field
                      {...params}
                      as={TextField}
                      name="fieldName"
                      id="fieldName"
                      value={values.userId}
                      onBlur={handleBlur}
                      error={touched.userId && errors.userId !== undefined}
                      helperText={touched.userId && errors.userId}
                    />
                  )}
                />
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
