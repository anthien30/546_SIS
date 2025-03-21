import { useEffect, useState } from "react";
import SchedulesFiltersPanel from "./SchedulesFiltersPanel";
import axiosInstance from "../../config/axiosInstance";
import SchedulesDataGrid from "./SchedulesDataGrid";
import { Schedule } from "./models";
import ScheduleCreationDialog from "./ScheduleCreationDialog";
import ScheduleEditDialog from "./ScheduleEditDialog";

const SchedulesView = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isCreationOpen, setIsCreationOpen] = useState(false);
  const [openSchedule, setOpenSchedule] = useState<Schedule | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const searchSchedules = async (filtersJson: { [key: string]: any }) => {
    setIsSearching(true);
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
    <div className="moduleWrapper">
      <h3 className="mb-4">Schedules</h3>

      <div className="mb-4">
        <SchedulesFiltersPanel searchSchedules={searchSchedules} />
      </div>

      <SchedulesDataGrid
        data={schedules}
        loading={isSearching}
        displayCreationForm={() => setIsCreationOpen(true)}
        displayEditForm={(course) => setOpenSchedule(course)}
      />

      <ScheduleCreationDialog
        searchSchedules={(filters) => searchSchedules(filters)}
        isOpen={isCreationOpen}
        setIsOpen={setIsCreationOpen}
      />

      <ScheduleEditDialog
        searchSchedules={(filters) => searchSchedules(filters)}
        schedule={openSchedule}
        setSchedule={setOpenSchedule}
      />
    </div>
  );
};

export default SchedulesView;
