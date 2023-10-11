import { Box } from "@mui/material";
import { GridColDef, DataGrid as MuiDataGrid } from "@mui/x-data-grid";

import { PagedList } from "@/types";

type DataGridProps = {
  pagedList: PagedList<any>;
  columns: GridColDef[];
  setPagination: ({
    page,
    pageSize,
  }: {
    page: number;
    pageSize: number;
  }) => void;
};

export function DataGrid({ columns, pagedList, setPagination }: DataGridProps) {
  return (
    <Box className="data-grid-container">
      <MuiDataGrid
        rows={pagedList.items}
        columns={columns}
        getRowId={(row) => row.rowKey}
        pagination
        paginationMode="server"
        rowCount={pagedList.totalCount}
        paginationModel={{ page: pagedList.page, pageSize: pagedList.pageSize }}
        onPaginationModelChange={setPagination}
        disableRowSelectionOnClick
      />
    </Box>
  );
}
