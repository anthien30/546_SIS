import { Autocomplete, Button, TextField } from "@mui/material";
import { useState } from "react";

type AccountsFiltersPanelProps = {
  searchAccounts: (filtersJson: { [key: string]: any }) => void;
};
const AccountsFiltersPanel = ({
  searchAccounts,
}: AccountsFiltersPanelProps) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("Active");

  const handleClick = () => {
    const filtersData: any = {};
    if (email) filtersData.email = email;
    if (username) filtersData.username = username;
    if (role) filtersData.role = role;
    if (status) filtersData.status = status;

    searchAccounts(filtersData);
  };

  return (
    <div className="d-flex justify-content-between">
      <div className="d-flex">
        <TextField
          sx={{
            width: "200px",
            marginRight: "1rem",
            ".MuiInputBase-input": {
              padding: "0.6rem",
            },
          }}
          placeholder="Email"
          variant="outlined"
          onChange={(e) => {
            const value = e.target.value;
            setEmail(value);
          }}
          value={email}
        />
        <TextField
          sx={{
            width: "200px",
            marginRight: "1rem",
            ".MuiInputBase-input": {
              padding: "0.6rem",
            },
          }}
          placeholder="Username"
          variant="outlined"
          onChange={(e) => {
            const value = e.target.value;
            setUsername(value);
          }}
          value={username}
        />
        <Autocomplete
          sx={{
            width: "200px",
            marginRight: "1rem",
            ".MuiAutocomplete-inputRoot": {
              padding: "0.1rem",
            },
          }}
          renderInput={(params) => <TextField {...params} placeholder="Role" />}
          options={["Student", "Faculty", "Admin"]}
          onChange={(_, value) => {
            setRole(value ?? "");
          }}
          value={role}
        />
        <Autocomplete
          sx={{
            width: "200px",
            marginRight: "1rem",
            ".MuiAutocomplete-inputRoot": {
              padding: "0.1rem",
            },
          }}
          renderInput={(params) => (
            <TextField {...params} placeholder="Status" />
          )}
          options={["Active", "Inactive"]}
          onChange={(_, value) => {
            setStatus(value ?? "");
          }}
          value={status}
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

export default AccountsFiltersPanel;
