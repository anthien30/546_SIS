import {
  DataGrid,
  GridToolbarColumnsButton,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import { Course } from "./models";
import { Box, Button } from "@mui/material";
import { coursesDataGridColumns } from "./CoursesDataGrid.metadata";

type CoursesDataGridProps = {
  data: Course[];
  displayCreationForm: () => void;
  displayEditForm: (course: Course) => void;
};
const CoursesDataGrid = ({
  data,
  displayCreationForm,
  displayEditForm,
}: CoursesDataGridProps) => {
  function CustomToolbar() {
    return (
      <GridToolbarContainer
        sx={{
          background: "#F0F8FF",
        }}
      >
        <GridToolbarColumnsButton />
        <Box sx={{ flexGrow: 1 }} />
        <Button className="text-capitalize" onClick={displayCreationForm}>
          <AddIcon /> Add Course
        </Button>
      </GridToolbarContainer>
    );
  }

  return (
    <div style={{ flex: "1", maxHeight: "calc(100vh - 230px)" }}>
      <DataGrid
        columns={coursesDataGridColumns}
        rows={data}
        slots={{
          toolbar: CustomToolbar,
        }}
        disableAutosize
        disableColumnFilter
        disableColumnResize
        disableDensitySelector
        disableColumnMenu
        onRowDoubleClick={(data) => {
          displayEditForm(data.row);
        }}
      />
    </div>
  );
};

export default CoursesDataGrid;
