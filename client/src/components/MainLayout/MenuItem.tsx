import { ListItem, ListItemButton } from "@mui/material";
import { Link } from "react-router-dom";

type MenuItemProps = {
  to: string;
  text: string;
};
const MenuItem = ({ to, text }: MenuItemProps) => {
  return (
    <Link className="text-decoration-none text-light" to={to}>
      <ListItem
        sx={{
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.4)",
          },
        }}
      >
        <ListItemButton>{text}</ListItemButton>
      </ListItem>
    </Link>
  );
};

export default MenuItem;
