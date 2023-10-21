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
import { GridCloseIcon, GridColDef, GridSortItem } from "@mui/x-data-grid";

import { User, professions } from "@/types";
import { DataGrid, UserForm } from "@/components";
import { useDataFetchingHelper, useDeleteUser, useGetUsers } from "@/hooks";

type DialogState = {
  mode: "edit" | "create";
  open: boolean;
  user?: User;
};

export default function Users() {
  const [dialog, setDialog] = useState<DialogState>({
    mode: "create",
    open: false,
  });

  const {
    state,
    handleFilterChange,
    handlePaginationChange,
    handleSortChange,
  } = useDataFetchingHelper({
    field: "name",
  });
  const { data, loading, refetch } = useGetUsers(state);
  const deleteUser = useDeleteUser();

  async function onDelete(rowKey: string, partitionKey: string) {
    const result = await deleteUser({ params: { rowKey, partitionKey } });

    if (result.isSuccess) {
      refetch();
    }
  }

  async function onEdit(user: User) {
    console.log(user);
    setDialog({
      user,
      mode: "edit",
      open: true,
    });
  }

  function handleAddUser() {
    setDialog({ mode: "create", open: true });
  }

  function handleClose() {
    setDialog({ mode: "create", open: false });
    refetch();
  }

  const columns: GridColDef<User>[] = [
    { field: "name", headerName: "Name", width: 140, headerAlign: "center" },
    {
      field: "surname",
      headerName: "Surname",
      width: 140,
      headerAlign: "center",
    },
    { field: "email", headerName: "Email", width: 220, headerAlign: "center" },
    {
      field: "birthDate",
      headerName: "Birth Date",
      headerAlign: "center",
      width: 120,
      renderCell: ({ row }) => format(new Date(row.birthDate), "dd/MM/yyyy"),
    },
    {
      field: "gender",
      headerName: "Gender",
      headerAlign: "center",
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
      headerAlign: "center",
      width: 150,
      renderCell: ({ row }) => professions[row.occupation],
    },
    {
      field: "actions",
      headerName: "Actions",
      headerAlign: "center",
      width: 200,
      renderCell: ({ row }) => (
        <div>
          <Button
            className="mr-1"
            variant="outlined"
            color="primary"
            onClick={() => onEdit(row)}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => onDelete(row.rowKey, row.partitionKey)}
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
          onPaginationChange={handlePaginationChange}
          onSortChange={handleSortChange}
          onFilterChange={handleFilterChange}
        />
      </Grid>
    </Grid>
  );
}
