"use client";

import { useCallback } from "react";
import Image from "next/image";
import { DataGrid } from "@mui/x-data-grid";
import { Grid, Typography } from "@mui/material";

import { Summary } from "@/types";
import { Loader } from "@/components";
import { useGetSummaries } from "@/hooks";

export default function Home() {
  const { data: summaries, loading } = useGetSummaries();

  const Summary = useCallback(
    ({
      rows,
      image,
      title,
    }: {
      rows: Array<Summary>;
      image: string;
      title: string;
    }) => {
      return (
        <Grid item xs={6} md={4}>
          <Image
            src={image}
            alt="blob"
            width={0}
            height={0}
            className="w-full max-h-20"
          />
          <Typography className="text-2xl mb-2">{title}</Typography>
          <DataGrid
            hideFooter
            rows={rows}
            rowSelection={false}
            getRowId={(row) => row.name}
            columns={[
              { field: "name", headerName: "Name", minWidth: 200 },
              {
                field: "count",
                headerName: "Item Count",
                minWidth: 50,
                align: "center",
              },
            ]}
          />
        </Grid>
      );
    },
    []
  );

  if (!summaries) {
    return <Loader loading={loading} />;
  }

  return (
    <Grid container className="text-center" spacing={2}>
      <Summary image="/Table.svg" title="Tables" rows={summaries.tables} />
      <Summary image="/Blob-Block.svg" title="Blobs" rows={summaries.blobs} />
      <Summary image="/Queue.svg" title="Queues" rows={summaries.queues} />
    </Grid>
  );
}
