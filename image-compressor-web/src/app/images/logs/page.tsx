"use client";

import { useGetImageLogs } from "@/hooks";
import { Box, Button, Container, Paper, Typography } from "@mui/material";

export default function ImageLogs() {
  const { data: logs, loading, refetch } = useGetImageLogs();

  return (
    <Container>
      <Paper elevation={3} className="p-4 mt-8">
        <div className="flex justify-between items-center mb-4">
          <Typography variant="h5" gutterBottom>
            Logs
          </Typography>
          <Button variant="outlined" onClick={refetch} disabled={loading}>
            Reload
          </Button>
        </div>
        <Box>
          {logs?.map((log, index) => (
            <Typography
              key={index}
              gutterBottom
              className={index % 6 === 0 ? "mt-3" : ""}
              variant={index % 6 === 0 ? "h6" : "body1"}
            >
              {log}
            </Typography>
          ))}
        </Box>
      </Paper>
    </Container>
  );
}
