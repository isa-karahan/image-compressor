"use client";

import { useState } from "react";
import NextImage from "next/image";
import { DataGrid, GridCloseIcon, GridColDef } from "@mui/x-data-grid";
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
import { useDeleteImage, useGetImages } from "@/hooks";
import { ImageUpload } from "@/components";

export default function Images() {
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const { data: images, refetch, loading } = useGetImages();
  const deleteImage = useDeleteImage();

  const handleClose = () => {
    setOpen(false);
  };

  const onUploadCompleted = () => {
    setOpen(false);
    refetch();
  };

  const columns: GridColDef<Image>[] = [
    {
      field: "url",
      headerName: "Image",
      headerAlign: "center",
      width: 200,
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
      width: 280,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "userName",
      headerName: "User Name",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "isCompressed",
      headerName: "Compressed",
      align: "center",
      width: 100,
      headerAlign: "center",
      renderCell: ({ row }) => (row.isCompressed ? <Done /> : <Close />),
    },
    {
      field: "rawSize",
      headerName: "Size (KB)",
      align: "center",
      headerAlign: "center",
      width: 150,
      renderCell: ({ row }) =>
        row.isCompressed
          ? `${row.rawSize.toFixed(2)} >> ${row.compressedSize.toFixed(2)}`
          : row.rawSize.toFixed(2),
    },
    {
      field: "actions",
      headerName: "Actions",
      headerAlign: "center",
      width: 220,
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
        <Grid item xs={12} className="data-grid-container">
          <DataGrid
            columns={columns}
            rows={images ?? []}
            loading={loading}
            getRowId={(row) => row.rowKey}
            autoPageSize
            disableRowSelectionOnClick
            rowHeight={120}
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
