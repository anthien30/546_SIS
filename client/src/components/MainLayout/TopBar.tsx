import { AppBar, Button, IconButton, Toolbar, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { logout } from "../../utils/auth";

type TopBarProps = {
  drawerWidth: number;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
const TopBar = ({ isOpen, setIsOpen, drawerWidth }: TopBarProps) => {
  return (
    <AppBar
      color="warning"
      position="fixed"
      sx={{
        width: isOpen ? `calc(100% - ${drawerWidth}px)` : "100%",
        transition: `width ${isOpen && "0.3s"}`,
      }}
    >
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={() => setIsOpen((state) => !state)}
        >
          {isOpen ? <ArrowBackIosIcon /> : <MenuIcon />}
        </IconButton>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1 }}
        ></Typography>
        <Button color="inherit" onClick={logout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
