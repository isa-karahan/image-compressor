import { useState } from "react";
import {
  GridCallbackDetails,
  GridFilterModel,
  GridPaginationModel,
  GridSortItem,
} from "@mui/x-data-grid";

type DataFetchingState = Partial<GridPaginationModel & GridSortItem> & {
  filterField?: string;
  filterValue?: string;
};

export function useDataFetchingHelper({
  filterField,
  filterValue,
  page = 0,
  pageSize = 25,
  field = "",
  sort = "asc",
}: DataFetchingState) {
  const [state, setState] = useState<DataFetchingState>({
    filterField,
    filterValue,
    page,
    pageSize,
    field,
    sort,
  });

  function handlePaginationChange(pagination: GridPaginationModel) {
    setState((prevState) => ({
      ...prevState,
      ...pagination,
    }));
  }

  function handleSortChange(sorting: GridSortItem[]) {
    setState((prevState) => ({
      ...prevState,
      ...sorting[0],
    }));
  }

  function handleFilterChange(
    { items }: GridFilterModel,
    details: GridCallbackDetails<"filter">
  ) {
    if (
      details.reason === "deleteFilterItem" ||
      items[0]?.value === state.filterValue
    )
      return;

    if (!items[0]?.value) {
      return setState((prevState) => ({
        ...prevState,
        filterField: "",
        filterValue: "",
      }));
    }

    setState((prevState) => ({
      ...prevState,
      filterField: items[0].field,
      filterValue: items[0].value,
    }));
  }

  return {
    state,
    handleSortChange,
    handleFilterChange,
    handlePaginationChange,
  };
}
