import { Box } from "@mui/material";
import {
  GridCallbackDetails,
  GridColDef,
  GridFilterModel,
  GridPaginationModel,
  GridSortModel,
  DataGrid as MuiDataGrid,
} from "@mui/x-data-grid";

import { PagedList } from "@/types";

type DataGridProps = {
  pagedList: PagedList<any>;
  columns: GridColDef[];
  onSortChange?: (sort: GridSortModel) => void;
  onFilterChange?: (
    filter: GridFilterModel,
    details: GridCallbackDetails<"filter">
  ) => void;
  onPaginationChange?: (pagination: GridPaginationModel) => void;
};

export function DataGrid({
  columns,
  pagedList,
  onSortChange,
  onFilterChange,
  onPaginationChange,
}: DataGridProps) {
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
        onPaginationModelChange={onPaginationChange}
        disableRowSelectionOnClick
        sortingMode="server"
        onSortModelChange={onSortChange}
        filterMode="server"
        onFilterModelChange={onFilterChange}
        filterDebounceMs={1000}
      />
    </Box>
  );
}
