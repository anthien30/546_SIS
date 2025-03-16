import {
  DataGrid,
  GridToolbarColumnsButton,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import { accountsDataGridColumns } from "./AccountsDataGrid.metadata";
import { Account } from "./models";
import { Box, Button } from "@mui/material";

type AccountsDataGridProps = {
  data: Account[];
  displayCreationForm: () => void;
  displayEditForm: (account: Account) => void;
};
const AccountsDataGrid = ({
  data,
  displayCreationForm,
  displayEditForm,
}: AccountsDataGridProps) => {
  function CustomToolbar() {
    return (
      <GridToolbarContainer
        sx={{
          background: "#F0F8FF",
        }}
      >
        <GridToolbarColumnsButton />
        <Box sx={{ flexGrow: 1 }} />
        {/* <GridToolbarExport
          slotProps={{
            tooltip: { title: "Export data" },
            button: { variant: "outlined" },
          }}
        /> */}
        <Button onClick={displayCreationForm}>
          <AddIcon /> New Account
        </Button>
      </GridToolbarContainer>
    );
  }

  return (
    <div style={{ flex: "1", maxHeight: "calc(100vh - 230px)" }}>
      <DataGrid
        columns={accountsDataGridColumns}
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

export default AccountsDataGrid;
