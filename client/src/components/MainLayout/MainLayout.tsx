import { useState } from "react";
import { Outlet } from "react-router-dom";
import TopBar from "./TopBar";
import { Box } from "@mui/material";
import DrawerMenu from "./DrawerMenu";
import Notification from "../Common/Notification/Notification";
import ConfirmationDialog from "../Common/ConfirmationDialog/ConfirmationDialog";

const DRAWER_WIDTH = 240;

const MainLayout = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Box sx={{ display: "flex", flexDirection: "row" }}>
      <DrawerMenu isOpen={isOpen} drawerWidth={DRAWER_WIDTH} />
      <TopBar
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        drawerWidth={DRAWER_WIDTH}
      />
      <Notification />
      <ConfirmationDialog />
      <main
        style={{
          position: "absolute",
          top: "64px",
          left: isOpen ? `${DRAWER_WIDTH}px` : "0",
          width: `calc(100% - ${isOpen ? DRAWER_WIDTH : 0}px)`,
          height: `calc(100% - 64px)`,
          transition: `left ${isOpen && "0.3s"}`,
        }}
      >
        <Outlet />
      </main>
    </Box>
  );
};

export default MainLayout;
