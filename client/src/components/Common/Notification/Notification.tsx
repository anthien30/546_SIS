import { Alert, Snackbar } from "@mui/material";
import { useEffect, useState } from "react";
import { notificationService } from "./notificationSubject";

const Notification = () => {
  const [openSuccess, setOpenSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [openError, setOpenError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleCloseSuccess = () => setOpenSuccess(false);

  const handleCloseError = () => setOpenError(false);

  useEffect(() => {
    const subscription = notificationService
      .get()
      .subscribe(({ type, message }) => {
        if (type === "success") {
          setOpenSuccess(true);
          setSuccessMessage(message);
        }
      });
    return () => subscription.unsubscribe();
  }, [openSuccess, successMessage]);

  useEffect(() => {
    const subscription = notificationService
      .get()
      .subscribe(({ type, message }) => {
        if (type === "error") {
          setOpenError(true);
          setErrorMessage(message);
        }
      });
    return () => subscription.unsubscribe();
  }, [openError, errorMessage]);

  return (
    <>
      <Snackbar
        open={openSuccess}
        autoHideDuration={6000}
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSuccess}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {successMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        open={openError}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseError}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Notification;
