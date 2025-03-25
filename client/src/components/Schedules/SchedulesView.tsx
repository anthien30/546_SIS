import { useState } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import SchedulesViewSearch from "./SchedulesViewSearch";
import { userPermissionService } from "../Common/subjects/userPermissionSubject";
import SchedulesViewMyCourses from "./SchedulesViewMyCourses";

const SchedulesView = () => {
  const [value, setValue] = useState("1");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <div className="moduleWrapper">
      <h3 className="mb-4">Schedules</h3>

      {userPermissionService.isAdmin() ? (
        <SchedulesViewSearch />
      ) : (
        <div style={{ flex: "1" }}>
          <Box sx={{ width: "100%", typography: "body1", height: "100%" }}>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TabList
                  onChange={handleChange}
                  aria-label="lab API tabs example"
                >
                  <Tab label="Search" value="1" />
                  <Tab label="My Courses" value="2" />
                </TabList>
              </Box>
              <TabPanel
                sx={{
                  padding: 0,
                  paddingTop: "1rem",
                  height: "100%",
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
                value="1"
              >
                <SchedulesViewSearch />
              </TabPanel>
              <TabPanel
                sx={{
                  padding: 0,
                  paddingTop: "1rem",
                  height: "100%",
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
                value="2"
              >
                <SchedulesViewMyCourses />
              </TabPanel>
            </TabContext>
          </Box>
        </div>
      )}
    </div>
  );
};

export default SchedulesView;
