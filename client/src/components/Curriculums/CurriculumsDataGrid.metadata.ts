import { GridColDef } from "@mui/x-data-grid";

export const curriculumsDataGridColumns: GridColDef[] = [
  {
    field: "name",
    headerName: "Name",
    width: 300,
  },
  {
    field: "creditsRequired",
    headerName: "Credits Required",
    width: 200,
  },

  // {
  //   field: "instructor",
  //   headerName: "Instructor",
  //   width: 200,
  //   valueGetter: (value) => value ?? "TBA",
  // },
  //   {
  //     field: "prerequisites",
  //     headerName: "Prerequisites",
  //     width: 400,
  //     valueGetter: (value: Course[]) => {
  //       return value.map((c) => c.code).join(", ");
  //     },
  //   },
];
