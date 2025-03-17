import { GridColDef } from "@mui/x-data-grid";
import { Course } from "./models";

export const coursesDataGridColumns: GridColDef[] = [
  {
    field: "code",
    headerName: "Course Code",
    width: 200,
  },
  {
    field: "name",
    headerName: "Name",
    width: 500,
  },
  {
    field: "credits",
    headerName: "Credits",
    width: 150,
  },
  // {
  //   field: "term",
  //   headerName: "Term",
  //   width: 200,
  // },
  // {
  //   field: "instructor",
  //   headerName: "Instructor",
  //   width: 200,
  //   valueGetter: (value) => value ?? "TBA",
  // },
  {
    field: "prerequisites",
    headerName: "Prerequisites",
    width: 400,
    valueGetter: (value: Course[]) => {
      return value.map((c) => c.code).join(", ");
    },
  },
];
