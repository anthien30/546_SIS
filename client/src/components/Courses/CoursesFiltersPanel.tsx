import { Button, TextField } from "@mui/material";
import { useState } from "react";

type CoursesFiltersPanelProps = {
  searchCourses: (filtersJson: { [key: string]: any }) => void;
};
const CoursesFiltersPanel = ({ searchCourses }: CoursesFiltersPanelProps) => {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");

  const handleClick = () => {
    const filtersData: any = {};
    if (code) filtersData.code = code;
    if (name) filtersData.name = name;

    searchCourses(filtersData);
  };

  return (
    <div className="d-flex justify-content-between">
      <div className="d-flex">
        <TextField
          sx={{
            width: "250px",
            marginRight: "1rem",
            ".MuiInputBase-input": {
              padding: "0.6rem",
            },
          }}
          placeholder="Course Code"
          variant="outlined"
          onChange={(e) => {
            const value = e.target.value;
            setCode(value);
          }}
          value={code}
        />
        <TextField
          sx={{
            width: "250px",
            marginRight: "1rem",
            ".MuiInputBase-input": {
              padding: "0.6rem",
            },
          }}
          placeholder="Course Name"
          variant="outlined"
          onChange={(e) => {
            const value = e.target.value;
            setName(value);
          }}
          value={name}
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

export default CoursesFiltersPanel;
