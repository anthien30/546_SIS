import {
  DataGrid,
  GridToolbarColumnsButton,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import { Box, Button } from "@mui/material";
import { schedulesDataGridColumns } from "./SchedulesDataGrid.metadata";
import { Schedule } from "./models";

type SchedulesDataGridProps = {
  data: Schedule[];
  displayCreationForm: () => void;
  displayEditForm: (schedule: Schedule) => void;
};
const SchedulesDataGrid = ({
  data,
  displayCreationForm,
  displayEditForm,
}: SchedulesDataGridProps) => {
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
          <AddIcon /> Add Schedule
        </Button>
      </GridToolbarContainer>
    );
  }

  return (
    <div style={{ flex: "1", maxHeight: "calc(100vh - 230px)" }}>
      <DataGrid
        columns={schedulesDataGridColumns}
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

export default SchedulesDataGrid;
