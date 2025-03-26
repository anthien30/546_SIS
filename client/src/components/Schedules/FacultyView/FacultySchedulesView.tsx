import { useEffect, useState } from "react";
import { Schedule } from "../models";
import { meService } from "../../Common/subjects/meSubject";
import axiosInstance from "../../../config/axiosInstance";
import SchedulesDataGrid from "../SchedulesDataGrid";
import { Box, Tab, Tabs } from "@mui/material";
import { GridCloseIcon } from "@mui/x-data-grid";
import { TabContext, TabPanel } from "@mui/lab";
import { useFieldArray, useForm } from "react-hook-form";
import { Course } from "../../Courses/models";
import StudentsRosterDataGrid from "./StudentsRosterDataGrid";

type TabData = { value: string; label: string; data: null | Schedule };

type State = {
  tabs: TabData[];
};

const FacultySchedulesView = () => {
  const { control } = useForm<State>({
    defaultValues: {
      tabs: [{ value: "default", label: "My Courses", data: null }],
    },
  });
  const {
    append,
    remove,
    fields: tabs,
  } = useFieldArray({
    control,
    name: "tabs",
  });

  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState("default");

  const removeTab = (idx: number) => {
    const activeIdx = tabs.findIndex((t) => t.value === activeTab);
    remove(idx);
    if (activeIdx >= idx) setActiveTab(tabs[idx - 1].value);
  };

  const addTab = (schedule: Schedule) => {
    const courseCode = (schedule.course as Course).code!;
    if (tabs.every((t) => t.value !== courseCode))
      append({ value: courseCode, label: courseCode, data: schedule });
    setActiveTab(courseCode);
  };

  const searchSchedules = async (filtersJson: { [key: string]: any }) => {
    setIsSearching(true);
    filtersJson.instructor = meService.getData()?._id;
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
      <div style={{ flex: "1" }}>
        <TabContext value={activeTab}>
          <Box sx={{ width: "100%" }}>
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
            >
              {tabs.map((tab, idx) => (
                <Tab
                  value={tab.value}
                  key={tab.value}
                  label={
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {tab.label}
                      {tab.value !== "default" && (
                        <div
                          title="Close"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent switching tabs when closing
                            removeTab(idx);
                          }}
                        >
                          <GridCloseIcon
                            sx={{ marginLeft: "5px" }}
                            fontSize="small"
                          />
                        </div>
                      )}
                    </Box>
                  }
                />
              ))}
            </Tabs>
          </Box>

          {tabs.map((t, idx) => (
            <TabPanel
              key={t.id}
              sx={{
                padding: 0,
                paddingTop: "1rem",
                height: "100%",
                width: "100%",
                display: "flex",
                flexDirection: "column",
              }}
              value={t.value}
            >
              {idx === 0 ? (
                <SchedulesDataGrid
                  data={schedules}
                  loading={isSearching}
                  displayCreationForm={() => undefined}
                  displayEditForm={(schedule) => addTab(schedule)}
                />
              ) : (
                <StudentsRosterDataGrid schedule={t.data!} />
              )}
            </TabPanel>
          ))}
        </TabContext>
      </div>
    </>
  );
};

export default FacultySchedulesView;
