"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  Backdrop,
  Button,
  Grid,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { GridCloseIcon, GridColDef } from "@mui/x-data-grid";

import { User } from "@/types";
import { DataGrid, UserForm } from "@/components";
import { useDeleteUser, useGetOccupations, useGetUsers } from "@/hooks";

type DialogState = {
  mode: "edit" | "create";
  open: boolean;
  user?: User;
};

export default function Users() {
  const [pagination, setPagination] = useState({ page: 1, pageSize: 25 });
  const [dialog, setDialog] = useState<DialogState>({
    mode: "create",
    open: false,
  });
  const { data, loading, refetch } = useGetUsers(pagination);
  const { data: occupations } = useGetOccupations();
  const deleteUser = useDeleteUser();

  const onDelete = async (id: string) => {
    const result = await deleteUser({ id });

    if (result.isSuccess) {
      refetch();
    }
  };
  const onEdit = async (user: User) => {
    console.log(user);
    setDialog({
      user,
      mode: "edit",
      open: true,
    });
  };

  const handleAddUser = () => {
    setDialog({ mode: "create", open: true });
  };

  const handleClose = () => {
    setDialog({ mode: "create", open: false });
    refetch();
  };

  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", width: 140 },
    { field: "surname", headerName: "Surname", width: 140 },
    { field: "email", headerName: "Email", width: 220 },
    {
      field: "birthDate",
      headerName: "Birth Date",
      width: 120,
      renderCell: ({ row }) => format(new Date(row.birthDate), "dd/MM/yyyy"),
    },
    {
      field: "gender",
      headerName: "Gender",
      width: 100,
      renderCell: ({ row }) => {
        switch (row.gender) {
          case 0:
            return "Male";
          case 1:
            return "Female";
          default:
            return "Other";
        }
      },
    },
    {
      field: "occupation",
      headerName: "Occupation",
      width: 150,
      renderCell: ({ row }) => occupations && occupations[row.occupation],
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <div>
          <Button
            className="mr-1"
            variant="outlined"
            color="primary"
            onClick={() => onEdit(params.row)}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => onDelete(params.row.rowKey)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  if (!data) {
    return <Backdrop open={loading} />;
  }

  return (
    <Grid container spacing={2}>
      <Grid item>
        <Dialog open={dialog.open}>
          <DialogTitle sx={{ m: 0, p: 2, textAlign: "center" }}>
            {dialog.mode === "create" ? "Add" : "Update"}
          </DialogTitle>
          <IconButton
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <GridCloseIcon />
          </IconButton>
          <DialogContent>
            <UserForm
              mode={dialog.mode}
              user={dialog.user}
              onClose={handleClose}
            />
          </DialogContent>
        </Dialog>
      </Grid>
      <Grid item xs>
        <Button variant="outlined" onClick={handleAddUser}>
          Add User
        </Button>
      </Grid>
      <Grid item xs>
        <DataGrid
          pagedList={data}
          columns={columns}
          setPagination={(p) => {
            setPagination(p);
          }}
        />
      </Grid>
    </Grid>
  );
}
