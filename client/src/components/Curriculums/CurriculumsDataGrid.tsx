import {
  DataGrid,
  GridToolbarColumnsButton,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import { Box, Button } from "@mui/material";
import { Curriculum } from "./models";
import { curriculumsDataGridColumns } from "./CurriculumsDataGrid.metadata";

type CurriculumsDataGridProps = {
  data: Curriculum[];
  displayCreationForm: () => void;
  displayEditForm: (curriculum: Curriculum) => void;
  loading: boolean;
};
const CurriculumsDataGrid = ({
  data,
  displayCreationForm,
  displayEditForm,
  loading,
}: CurriculumsDataGridProps) => {
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
          <AddIcon /> Add Curriculum
        </Button>
      </GridToolbarContainer>
    );
  }

  return (
    <div style={{ flex: "1", maxHeight: "calc(100vh - 230px)" }}>
      <DataGrid
        loading={loading}
        columns={curriculumsDataGridColumns}
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

export default CurriculumsDataGrid;
