import { Sidebar, Menu, MenuItem, Submenu, Logo } from "react-mui-sidebar";
import { Container } from "@mui/material";

const Navbar = () => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <Container>
      <Sidebar width={"270px"} showProfile={false}>
        <Logo img="https://adminmart.com/wp-content/uploads/2024/03/logo-admin-mart-news.png">
          CSUF SIS
        </Logo>
        <Menu subHeading="HOME">
          <MenuItem link="/" badge>
            Modern
          </MenuItem>
          <MenuItem>eCommerce</MenuItem>
          <MenuItem>Analytical</MenuItem>
        </Menu>
        <Menu subHeading="APPS">
          <MenuItem>Chat</MenuItem>
          <MenuItem>Calendar</MenuItem>
        </Menu>
        <Menu subHeading="OTHERS">
          <Submenu title="Menu Level">
            <MenuItem>Post</MenuItem>
            <MenuItem>Details</MenuItem>
            <Submenu title="Level 2">
              <MenuItem>new</MenuItem>
              <MenuItem>Hello</MenuItem>
            </Submenu>
          </Submenu>

          <MenuItem>Chip</MenuItem>
          <MenuItem target="_blank" link="google.com">
            External Link
          </MenuItem>
        </Menu>
      </Sidebar>
      {/* Other components */}
      <button onClick={handleLogout}>Log out</button>
    </Container>
  );
};

export default Navbar;
