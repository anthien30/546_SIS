import { DataGrid } from "@mui/x-data-grid";
import { Schedule } from "../models";
import { useEffect, useState } from "react";
import { Account } from "../../AccountsManagement/models";
import { scheduled } from "rxjs";
import ScheduleGradesDialog from "./ScheduleGradesDialog";

type StudentsRosterDataGridProps = {
  schedule: Schedule;
};
const StudentsRosterDataGrid = ({ schedule }: StudentsRosterDataGridProps) => {
  const [data, setData] = useState<Account[]>([]);
  const [openData, setOpenData] = useState<Account | null>(null);

  useEffect(() => {
    schedule?.enrolledStudents &&
      setData(schedule.enrolledStudents as Account[]);
  }, [schedule]);

  return (
    <div style={{ flex: "1", maxHeight: "calc(100vh - 230px)" }}>
      <ScheduleGradesDialog
        studentAccount={openData}
        setStudentAccount={(args) => setOpenData(args)}
        schedule={schedule}
      />

      <DataGrid
        // loading={loading}
        columns={[
          { field: "username", headerName: "Student Username", width: 200 },
        ]}
        rows={data.map((s) => ({ ...s, id: s._id }))}
        // slots={{
        //   toolbar: () => (
        //     <div className="p-2 pb-0 fw-bold text-center text-uppercase">
        //       Student Roster
        //     </div>
        //   ),
        // }}
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
          setOpenData(data.row);
        }}
      />
    </div>
  );
};

export default StudentsRosterDataGrid;
