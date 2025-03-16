import { GridColDef } from "@mui/x-data-grid";
import { Course } from "./models";

export const coursesDataGridColumns: GridColDef[] = [
  {
    field: "code",
    headerName: "Course Code",
    width: 150,
  },
  {
    field: "name",
    headerName: "Name",
    width: 350,
  },
  {
    field: "semester",
    headerName: "Semester",
    width: 200,
  },
  {
    field: "instructor",
    headerName: "Instructor",
    width: 200,
    valueGetter: (value) => value ?? "TBA",
  },
  {
    field: "prerequisites",
    headerName: "Prerequisites",
    width: 300,
    valueGetter: (value: Course[]) => {
      return value.map((c) => c.code).join(", ");
    },
  },
];
