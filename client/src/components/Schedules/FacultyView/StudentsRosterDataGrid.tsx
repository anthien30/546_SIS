import { DataGrid } from "@mui/x-data-grid";
import { Schedule } from "../models";
import { useEffect, useState } from "react";
import { Account } from "../../AccountsManagement/models";
import ScheduleGradesDialog from "./ScheduleGradesDialog";
import { Button } from "react-bootstrap";
import ScheduleFinalGradeDialog from "./ScheduleFinalGradeDialog";

type StudentsRosterDataGridProps = {
  schedule: Schedule;
};
const StudentsRosterDataGrid = ({ schedule }: StudentsRosterDataGridProps) => {
  const [data, setData] = useState<Account[]>([]);
  const [openScoreData, setOpenScoreData] = useState<Account | null>(null);
  const [openGradeData, setOpenGradeData] = useState<Account | null>(null);

  useEffect(() => {
    schedule?.enrolledStudents &&
      setData(schedule.enrolledStudents as Account[]);
  }, [schedule]);

  return (
    <div style={{ flex: "1", maxHeight: "calc(100vh - 230px)" }}>
      <ScheduleGradesDialog
        studentAccount={openScoreData}
        setStudentAccount={(args) => setOpenScoreData(args)}
        schedule={schedule}
      />

      <ScheduleFinalGradeDialog
        studentAccount={openGradeData}
        setStudentAccount={(args) => setOpenGradeData(args)}
        schedule={schedule}
      />

      <DataGrid
        // loading={loading}
        columns={[
          { field: "username", headerName: "Student Username", width: 400 },
          {
            field: "action",
            headerName: "Actions",
            width: 400,
            renderCell: (data) => (
              <div className="h-100 d-flex justify-content-between align-items-center">
                <Button
                  className="btn-light"
                  onClick={() => setOpenScoreData(data.row)}
                >
                  Scores
                </Button>

                <Button
                  onClick={() => setOpenGradeData(data.row)}
                  className="btn-light"
                >
                  Final Grade
                </Button>
              </div>
            ),
          },
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
        // onRowDoubleClick={(data) => {
        //   setOpenData(data.row);
        // }}
      />
    </div>
  );
};

export default StudentsRosterDataGrid;
