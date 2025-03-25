import {
  DataGrid,
  GridToolbarColumnsButton,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import { Box, Button } from "@mui/material";
import { schedulesDataGridColumns } from "./SchedulesDataGrid.metadata";
import { Schedule } from "./models";
import { userPermissionService } from "../Common/subjects/userPermissionSubject";

type SchedulesDataGridProps = {
  data: Schedule[];
  displayCreationForm: () => void;
  displayEditForm: (schedule: Schedule) => void;
  loading: boolean;
};
const SchedulesDataGrid = ({
  data,
  loading,
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
        {userPermissionService.isAdmin() && (
          <Button className="text-capitalize" onClick={displayCreationForm}>
            <AddIcon /> Add Schedule
          </Button>
        )}
      </GridToolbarContainer>
    );
  }

  return (
    <div style={{ flex: "1", maxHeight: "calc(100vh - 230px)" }}>
      <DataGrid
        loading={loading}
        columns={schedulesDataGridColumns}
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

export default SchedulesDataGrid;
