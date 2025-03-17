import { Autocomplete, Button, debounce, TextField } from "@mui/material";
import { useCallback, useState } from "react";
import axiosInstance from "../../config/axiosInstance";
import { Course } from "../Courses/models";
import { notificationService } from "../Common/Notification/notificationSubject";

type SchedulesFiltersPanelProps = {
  searchSchedules: (filtersJson: { [key: string]: any }) => void;
};
const SchedulesFiltersPanel = ({
  searchSchedules,
}: SchedulesFiltersPanelProps) => {
  const [course, setCourse] = useState<Course | null>(null);
  const [term, setTerm] = useState("");
  const [coursesOptions, setCoursesOptions] = useState<Course[]>([]);

  const handleClick = () => {
    const filtersData: any = {};
    if (course) filtersData.course = course._id;
    if (term) filtersData.term = term;

    searchSchedules(filtersData);
  };

  const searchCourses = async (courseCodeOrName: string | null) => {
    if (!courseCodeOrName?.length) return;
    const queryStr = new URLSearchParams({
      codeOrName: courseCodeOrName,
      limit: "10",
    }).toString();
    try {
      const response = await axiosInstance.get<Course[]>(
        `/api/course/search?${queryStr}`
      );
      setCoursesOptions(response.data);
    } catch (error) {
      notificationService.error(
        "Something went wrong while searching for course"
      );
      console.error(error);
    }
  };

  const debouncedSearchCourses = useCallback(debounce(searchCourses, 500), []);

  return (
    <div className="d-flex justify-content-between">
      <div className="d-flex">
        <Autocomplete
          sx={{
            width: "200px",
            marginRight: "1rem",
            ".MuiAutocomplete-inputRoot": {
              padding: "0.1rem",
            },
          }}
          renderInput={(params) => <TextField {...params} placeholder="Term" />}
          options={["Fall 2026", "Winter 2027", "Spring 2027"]}
          onChange={(_, value) => {
            setTerm(value ?? "");
          }}
          value={term}
        />
        <Autocomplete
          autoComplete
          filterOptions={(x) => x}
          sx={{
            width: "300px",
            marginRight: "1rem",
            ".MuiAutocomplete-inputRoot": {
              padding: "0.1rem",
            },
          }}
          renderInput={(params) => (
            <TextField {...params} placeholder="Course" />
          )}
          getOptionLabel={(option) => `${option.code} - ${option.name}`}
          options={coursesOptions}
          onInputChange={(_, inputVal) => {
            debouncedSearchCourses(inputVal);
          }}
          onChange={(_, value) => {
            setCourse(value);
          }}
          // value={term}
        />
      </div>

      <Button
        style={{ width: "170px" }}
        variant="contained"
        className="btn btn-primary"
        onClick={handleClick}
      >
        Search
      </Button>
    </div>
  );
};

export default SchedulesFiltersPanel;
