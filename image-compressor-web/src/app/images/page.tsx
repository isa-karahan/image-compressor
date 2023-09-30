"use client";

import { useCallback, useState } from "react";
import NextImage from "next/image";
import { GridCloseIcon } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";

import { Image, User } from "@/types";
import {
  useDeleteImage,
  useGetImages,
  useGetUsers,
  useNotifications,
  useUploadImage,
} from "@/hooks";
import { ImageUpload } from "@/components";

export default function Images() {
  const [open, setOpen] = useState(false);
  const [allImages, setAllImages] = useState(true);
  const [user, setUser] = useState<User | null>();

  const { data: images, refetch } = useGetImages(allImages ? "" : user?.rowKey);
  const { data: users } = useGetUsers();
  const deleteImage = useDeleteImage();
  const uploadImage = useUploadImage();
  const connection = useNotifications(refetch);

  const compressedImages = images?.filter((i) => i.isCompressed);
  const rawImages = images?.filter((i) => !i.isCompressed);

  const handleClose = () => {
    setOpen(false);
  };

  const handleImageUpload = async (values: any) => {
    const formData = new FormData();

    values.images.forEach((image: File) => {
      formData.append(image.name, image);
    });

    await uploadImage({
      data: formData,
      id: values.userId,
      params: { clientId: connection.connectionId },
    });

    setOpen(false);
  };

  const mapImages = useCallback((images: Image[]) => {
    return images?.map(
      (image) =>
        image.url && (
          <Grid item key={image.name} xs={4} position="relative">
            <IconButton
              color="warning"
              sx={{
                position: "absolute",
                right: 3,
                top: 15,
                opacity: 0.8,
                ":hover": {
                  opacity: 1,
                  borderRadius: "50%",
                  backgroundColor: "white",
                },
              }}
              onClick={async () => {
                await deleteImage({ data: image });
                refetch();
              }}
            >
              <DeleteIcon />
            </IconButton>
            <NextImage
              src={image.url}
              alt={image.name}
              width={400}
              height={400}
              loading="lazy"
            />
          </Grid>
        )
    );
  }, []);

  return (
    <Box>
      <Grid container spacing={2} marginY={2}>
        <Grid item xs={6} md={2} sx={{ display: "flex", my: "auto" }}>
          <Typography>Filter Images</Typography>
        </Grid>
        <Grid item xs={6} md={2} sx={{ display: "flex", my: "auto" }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={allImages}
                onChange={(_, checked) => setAllImages(checked)}
              />
            }
            label="All Images"
          />
        </Grid>
        <Grid item xs md sx={{ display: "flex", my: "auto" }}>
          <Autocomplete
            fullWidth
            disablePortal
            size="small"
            value={user}
            disabled={allImages}
            options={users ?? []}
            onChange={(_e, value) => setUser(value)}
            renderInput={(params) => <TextField {...params} label="Users" />}
            getOptionLabel={(user) =>
              `${user.name} ${user.surname} - ${user.email}`
            }
          />
        </Grid>
        <Grid item xs={4} md={2}>
          <Button
            type="submit"
            sx={{ mt: 0.3 }}
            variant="outlined"
            onClick={() => setOpen(true)}
          >
            <AttachFileIcon fontSize="medium" sx={{ mr: "0.5rem" }} />
            Upload Image
          </Button>
        </Grid>
        {rawImages && rawImages?.length !== 0 && (
          <Grid container item spacing={2}>
            <Grid item xs>
              <Typography textAlign="center" fontSize={18}>
                Raw Images
              </Typography>
            </Grid>
            <Grid container item spacing={2}>
              {mapImages(rawImages)}
            </Grid>
          </Grid>
        )}
        {compressedImages && compressedImages?.length !== 0 && (
          <Grid container item spacing={2}>
            <Grid item xs>
              <Typography textAlign="center" fontSize={18}>
                Compressed Images
              </Typography>
            </Grid>
            <Grid container item spacing={2}>
              {mapImages(compressedImages)}
            </Grid>
          </Grid>
        )}
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
          <ImageUpload users={users ?? []} onSubmit={handleImageUpload} />
        </DialogContent>
      </Dialog>
    </Box>
  );
}
