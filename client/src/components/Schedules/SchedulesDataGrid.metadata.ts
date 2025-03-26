import { GridColDef } from "@mui/x-data-grid";
import { Course } from "../Courses/models";
import { Schedule } from "./models";
import { formatTime } from "../../utils/datetime";
import { Account } from "../AccountsManagement/models";

export const schedulesDataGridColumns: GridColDef[] = [
  {
    field: "term",
    headerName: "Term",
    width: 150,
  },
  {
    field: "course",
    headerName: "Course",
    width: 300,
    valueGetter: (value: Course) => `${value.code} - ${value.name}`,
  },
  {
    field: "enrolledStudents",
    headerName: "Enrollment",
    width: 150,
    valueGetter: (studentIds: any[], data: Schedule) =>
      `${studentIds.length}/${data.maxEnrollment}`,
  },
  {
    field: "schedule",
    headerName: "Meeting Schedule",
    width: 400,
    valueGetter: (_, data: Schedule) => {
      return `${data.days.join("/")}: ${formatTime(
        data.startTime as string
      )} to ${formatTime(data.endTime as string)}`;
    },
  },
  {
    field: "location",
    headerName: "Location",
    width: 200,
  },
  {
    field: "instructor",
    headerName: "Instructor",
    width: 200,
    valueGetter: (value: Account) => value?.username ?? "TBA",
  },
];
