import { GridColDef } from "@mui/x-data-grid";
import { jsDateTimeToString } from "../../utils/datetime";

export const accountsDataGridColumns: GridColDef[] = [
  {
    field: "email",
    headerName: "Email",
    width: 200,
  },
  {
    field: "username",
    headerName: "Username",
    width: 200,
  },
  {
    field: "role",
    headerName: "Role",
    width: 150,
  },
  {
    field: "status",
    headerName: "Status",
    width: 100,
  },
  {
    field: "createdBy",
    headerName: "Created By",
    width: 200,
  },
  {
    field: "createdOn",
    headerName: "Created On",
    width: 200,
    type: "dateTime",
    valueGetter: (value) => (value ? new Date(value) : null),
    valueFormatter: (value) => (value ? jsDateTimeToString(value) : ""),
  },
];
