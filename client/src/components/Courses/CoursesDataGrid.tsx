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
  loading: boolean;
};
const CoursesDataGrid = ({
  data,
  displayCreationForm,
  displayEditForm,
  loading,
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
        loading={loading}
        columns={coursesDataGridColumns}
        rows={data}
        slots={{
          toolbar: CustomToolbar,
        }}
        slotProps={{
          loadingOverlay: {
            variant: "linear-progress",
            noRowsVariant: "skeleton",
          },
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
