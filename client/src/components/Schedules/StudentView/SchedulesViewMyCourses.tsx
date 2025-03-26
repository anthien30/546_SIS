import { useEffect, useState } from "react";
import axiosInstance from "../../../config/axiosInstance";
import SchedulesDataGrid from "../SchedulesDataGrid";
import { Schedule } from "../models";
import ScheduleEnrollmentDialog from "./ScheduleEnrollmentDialog";
import { meService } from "../../Common/subjects/meSubject";

const SchedulesViewMyCourses = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [openSchedule, setOpenSchedule] = useState<Schedule | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const searchSchedules = async (filtersJson: { [key: string]: any }) => {
    setIsSearching(true);
    filtersJson.studentId = meService.getData()?._id;
    const queryStr = new URLSearchParams(filtersJson).toString();
    try {
      const response = await axiosInstance.get<Schedule[]>(
        `/api/schedule/search?${queryStr}`
      );
      setSchedules(response.data.map((a) => ({ ...a, id: a._id })));
    } catch (error) {
      console.error(error);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    searchSchedules({});
  }, []);

  return (
    <>
      <SchedulesDataGrid
        data={schedules}
        loading={isSearching}
        displayCreationForm={() => undefined}
        displayEditForm={(schedule) => setOpenSchedule(schedule)}
      />

      <ScheduleEnrollmentDialog
        searchSchedules={(filters) => searchSchedules(filters)}
        schedule={openSchedule}
        setSchedule={setOpenSchedule}
      />
    </>
  );
};

export default SchedulesViewMyCourses;
