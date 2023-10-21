"use client";

import * as Yup from "yup";
import { useFormik } from "formik";
import format from "date-fns/format";
import {
  Container,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
} from "@mui/material";

import { useCreateUser, useUpdateUser } from "@/hooks";
import { professions, User } from "@/types";

export type UserFormProps = {
  mode: "edit" | "create";
  user?: User;
  onClose: () => void;
};

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  surname: Yup.string().required("Surname is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  birthDate: Yup.date().required("Birth Date is required"),
  gender: Yup.number().oneOf([0, 1, 2]).required("Gender is required"),
  occupation: Yup.number().required("Occupation is required"),
});

export function UserForm({ mode, user, onClose }: UserFormProps) {
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();

  const isCreate = mode === "create";

  const formik = useFormik({
    initialValues: isCreate
      ? {
          name: "",
          surname: "",
          email: "",
          birthDate: format(Date.now(), "yyyy-MM-dd"),
          gender: 0,
          occupation: 0,
        }
      : {
          ...user,
          birthDate: user && format(new Date(user.birthDate), "yyyy-MM-dd"),
        },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      if (isCreate) {
        await createUser({ data: values });
      } else {
        await updateUser({ data: values });
      }

      onClose();
    },
  });

  return (
    <Container maxWidth="sm" className="my-4">
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              id="name"
              name="name"
              label="Name"
              variant="outlined"
              fullWidth
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="surname"
              name="surname"
              label="Surname"
              variant="outlined"
              fullWidth
              value={formik.values.surname}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.surname && Boolean(formik.errors.surname)}
              helperText={formik.touched.surname && formik.errors.surname}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="email"
              name="email"
              label="Email"
              variant="outlined"
              fullWidth
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="birthDate"
              name="birthDate"
              label="Birth Date"
              type="date"
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              value={formik.values.birthDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.birthDate && Boolean(formik.errors.birthDate)
              }
              helperText={formik.touched.birthDate && formik.errors.birthDate}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel id="gender-label">Gender</InputLabel>
              <Select
                id="gender"
                name="gender"
                labelId="gender-label"
                label="Gender"
                value={formik.values.gender}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.gender && Boolean(formik.errors.gender)}
              >
                <MenuItem value={0}>Male</MenuItem>
                <MenuItem value={1}>Female</MenuItem>
                <MenuItem value={2}>Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel id="occupation-label">Occupation</InputLabel>
              <Select
                id="occupation"
                name="occupation"
                labelId="occupation-label"
                label="Occupation"
                value={formik.values.occupation}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.occupation && Boolean(formik.errors.occupation)
                }
              >
                {professions?.map((occupation, index) => (
                  <MenuItem key={occupation} value={index}>
                    {occupation}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} display="flex" justifyContent="flex-end">
            <Button type="submit" variant="outlined" color="primary">
              {isCreate ? "Add" : "Update"}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}
