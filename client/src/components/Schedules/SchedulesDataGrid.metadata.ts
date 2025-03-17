import { GridColDef } from "@mui/x-data-grid";
import { Course } from "../Courses/models";
import { Schedule } from "./models";

function formatTime(hour: string) {
  const hourInt = parseInt(hour, 10); // Convert string to integer
  const period = hourInt >= 12 ? "PM" : "AM";
  const formattedHour = hourInt % 12 || 12; // Convert 0 or 12+ to 12-hour format
  return `${formattedHour}:00 ${period}`;
}

export const schedulesDataGridColumns: GridColDef[] = [
  {
    field: "term",
    headerName: "Term",
    width: 200,
  },
  {
    field: "course",
    headerName: "Course",
    width: 500,
    valueGetter: (value: Course) => `${value.code} - ${value.name}`,
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

  // {
  //   field: "instructor",
  //   headerName: "Instructor",
  //   width: 200,
  //   valueGetter: (value) => value ?? "TBA",
  // },
];
