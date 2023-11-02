"use client";

import { useState } from "react";
import NextImage from "next/image";
import { GridCloseIcon, GridColDef } from "@mui/x-data-grid";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import Done from "@mui/icons-material/Done";
import Close from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
} from "@mui/material";

import { Image } from "@/types";
import { DataGrid, ImageUpload, Loader } from "@/components";
import { useDataFetchingHelper, useDeleteImage, useGetImages } from "@/hooks";

export default function Images() {
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const {
    state,
    handleFilterChange,
    handlePaginationChange,
    handleSortChange,
  } = useDataFetchingHelper({
    field: "name",
  });
  const { data, refetch, loading } = useGetImages(state);
  const deleteImage = useDeleteImage();

  function handleClose() {
    setOpen(false);
  }

  function onUploadCompleted() {
    setOpen(false);
    refetch();
  }

  const columns: GridColDef<Image>[] = [
    {
      field: "url",
      headerName: "Image",
      headerAlign: "center",
      minWidth: 200,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <>
          <NextImage
            src={row.url}
            alt={row.name}
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: "100%", height: "auto" }}
            loading="lazy"
            onClick={() => setSelectedImage(row.rowKey)}
          />
          <Dialog open={selectedImage == row.rowKey}>
            <IconButton
              onClick={() => setSelectedImage("")}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <GridCloseIcon />
            </IconButton>
            <DialogContent sx={{ mt: "1.5rem" }}>
              <NextImage
                src={row.url}
                alt={row.name}
                width={0}
                height={0}
                sizes="100vw"
                style={{ width: "100%", height: "auto" }}
                loading="lazy"
              />
            </DialogContent>
          </Dialog>
        </>
      ),
    },
    {
      field: "name",
      headerName: "Name",
      minWidth: 280,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "userName",
      headerName: "User Name",
      minWidth: 150,
      headerAlign: "center",
      align: "center",
      sortable: false,
      filterable: false,
    },
    {
      field: "isCompressed",
      headerName: "Compressed",
      align: "center",
      minWidth: 100,
      headerAlign: "center",
      renderCell: ({ row }) => (row.isCompressed ? <Done /> : <Close />),
    },
    {
      field: "rawSize",
      headerName: "Size (KB)",
      align: "center",
      headerAlign: "center",
      minWidth: 150,
      renderCell: ({ row }) =>
        row.isCompressed
          ? `${row.rawSize.toFixed(2)} >> ${row.compressedSize.toFixed(2)}`
          : row.rawSize.toFixed(2),
    },
    {
      field: "actions",
      headerName: "Actions",
      headerAlign: "center",
      minWidth: 220,
      renderCell: ({ row }) => (
        <Box sx={{ display: "flex", gap: "10px" }}>
          <Button
            variant="outlined"
            color="error"
            onClick={async () => {
              await deleteImage({
                params: {
                  rowKey: row.rowKey,
                  partitionKey: row.partitionKey,
                },
              });

              refetch();
            }}
          >
            Delete
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => {
              const link = document.createElement("a");
              link.href = row.url;
              link.download = row.name;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
          >
            Download
          </Button>
        </Box>
      ),
    },
  ];

  if (!data) {
    return <Loader loading={loading} />;
  }

  return (
    <Box>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Button
            sx={{ mt: 0.3 }}
            variant="outlined"
            onClick={() => setOpen(true)}
          >
            <AttachFileIcon fontSize="medium" sx={{ mr: "0.5rem" }} />
            Upload Image
          </Button>
        </Grid>
        <Grid item xs={12}>
          <DataGrid
            columns={columns}
            pagedList={data}
            rowHeight={120}
            onPaginationChange={handlePaginationChange}
            onSortChange={handleSortChange}
            onFilterChange={handleFilterChange}
          />
        </Grid>
      </Grid>
      <Dialog open={open}>
        <DialogTitle sx={{ m: 0, p: 2, textAlign: "center" }}>
          Upload Image
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
          <ImageUpload onComplete={onUploadCompleted} />
        </DialogContent>
      </Dialog>
    </Box>
  );
}
