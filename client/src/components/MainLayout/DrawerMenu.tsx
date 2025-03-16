import { Box, Divider, Drawer, List } from "@mui/material";
import { Link } from "react-router-dom";
import MenuItem from "./MenuItem";

type DrawerMenuProps = {
  drawerWidth: number;
  isOpen: boolean;
};
const DrawerMenu = ({ isOpen, drawerWidth }: DrawerMenuProps) => {
  return (
    <Drawer
      sx={{
        "& .MuiDrawer-paper": {
          border: "hidden",
        },
      }}
      variant="persistent"
      anchor="left"
      open={isOpen}
    >
      <Box
        sx={{
          width: drawerWidth,
          background: "#052749",
          height: "100%",
        }}
        role="presentation"
      >
        <Link className="text-decoration-none" to="/">
          <div
            className="d-flex justify-content-center align-items-center p-3"
            style={{ height: "64px" }}
          >
            <img
              src="https://www.fullerton.edu/_resources/images/core/CalStateFullerton-logo.svg"
              alt="CSUF SIS"
            />
          </div>
        </Link>
        <Divider />
        <List sx={{ padding: "0" }}>
          <MenuItem to="/accounts-management" text="Accounts Management" />
          <MenuItem to="/academic-terms" text="Academic Terms" />{" "}
          <MenuItem to="/degrees" text="Degrees" />
          <MenuItem to="/courses" text="Courses" />
        </List>
      </Box>
    </Drawer>
  );
};

export default DrawerMenu;
