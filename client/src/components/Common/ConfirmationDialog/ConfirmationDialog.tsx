import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { confirmationService } from "./confirmationDialogSubject";

const ConfirmationDialog = () => {
  const [title, setTitle] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("Are you sure?");

  const [onConfirmHandler, setOnConfirmHandler] = useState<null | Function>(
    null
  );

  useEffect(() => {
    const subscription = confirmationService
      .get()
      .subscribe(({ title, message, onConfirmHandler }) => {
        setTitle(title);
        setMessage(message);
        setIsOpen(true);
        setOnConfirmHandler(() => onConfirmHandler());
      });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <Dialog
      open={isOpen}
      // onClose={handleClose}
      fullWidth
      maxWidth="md"
    >
      {title && <DialogTitle>{title}</DialogTitle>}
      <DialogContent>
        <div>{message}</div>
      </DialogContent>
      <DialogActions
        sx={{
          display: "flex",
          justifyContent: "center",
          paddingTop: "0",
          button: {
            width: "150px",
            margin: "0 20px 5px",
          },
        }}
      >
        <Button onClick={() => setIsOpen(false)} className="btn-secondary">
          No
        </Button>
        <Button
          onClick={() => {
            setIsOpen(false);
            onConfirmHandler?.();
          }}
          className="btn-primary"
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
