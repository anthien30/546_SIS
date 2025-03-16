import {
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { Button, Col, Form, FormGroup, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { Account } from "./models";
import { useEffect, useState } from "react";
import axiosInstance from "../../config/axiosInstance";
import { notificationService } from "../Notification/notificationSubject";

type AccountEditDialogProps = {
  account: Account | null;
  setAccount: (account: Account | null) => void;
  searchAccounts: () => void;
};
const AccountEditDialog = ({
  account,
  setAccount,
  searchAccounts,
}: AccountEditDialogProps) => {
  const {
    register,
    formState: { errors, dirtyFields },
    handleSubmit,
    reset,
  } = useForm<Account>({ mode: "all" });
  const [loading, setLoading] = useState(false);

  const updateAccount = (data: Account) => {
    if (Object.keys(dirtyFields).length === 0)
      return notificationService.success("No changes were made");

    setLoading(true);
    axiosInstance
      .post("/api/account/update", data)
      .then(() => {
        notificationService.success("Account updated");
        searchAccounts();
        handleClose();
      })
      .catch((error) => {
        console.error(error);
        notificationService.error(
          error.response?.data?.message ?? "Something went wrong"
        );
      })
      .finally(() => setLoading(false));
  };

  const handleClose = () => setAccount(null);

  useEffect(() => reset({ ...account }), [account, reset]);

  return (
    <Dialog open={!!account} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>Account Details</DialogTitle>
      <DialogContent>
        <Form className="position-relative">
          <Row>
            <Col sm={6}>
              <FormGroup className="mb-4">
                <Form.Label className="fw-bold">Email</Form.Label>
                <Form.Control
                  type="text"
                  {...register("email", {
                    required: "Email is required",
                  })}
                  disabled
                  placeholder="Enter email"
                />
                <Form.Text className="text-danger">
                  {errors.email?.message}
                </Form.Text>
              </FormGroup>
            </Col>

            <Col sm={6}>
              <FormGroup className="mb-4">
                <Form.Label className="fw-bold">Username</Form.Label>
                <Form.Control
                  type="text"
                  {...register("username", {
                    required: "Username is required",
                  })}
                  disabled
                  placeholder="Enter username"
                />
                <Form.Text className="text-danger">
                  {errors.username?.message}
                </Form.Text>
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col sm={6}>
              <FormGroup className="mb-4">
                <Form.Label className="fw-bold">Role</Form.Label>
                <Form.Select
                  aria-label="Role"
                  {...register("role", {
                    required: "Role is required",
                  })}
                >
                  <option value="">Select a role</option>
                  <option value="Student">Student</option>
                  <option value="Faculty">Faculty</option>
                  {/* <option value="Admin">Admin</option> */}
                </Form.Select>
                <Form.Text className="text-danger">
                  {errors.role?.message}
                </Form.Text>
              </FormGroup>
            </Col>

            <Col sm={6}>
              <FormGroup className="mb-4">
                <Form.Label className="fw-bold">Status</Form.Label>
                <Form.Select
                  aria-label="Status"
                  {...register("status", {
                    required: "Status is required",
                  })}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  {/* <option value="Admin">Admin</option> */}
                </Form.Select>
                <Form.Text className="text-danger">
                  {errors.role?.message}
                </Form.Text>
              </FormGroup>
            </Col>
          </Row>

          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              display: loading ? "flex" : "none",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              width: "100%",
              background: "rgba(255, 255, 255, 0.7)",
            }}
          >
            <CircularProgress />
          </div>
        </Form>
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
        <Button
          disabled={loading}
          onClick={handleClose}
          className="btn-secondary"
        >
          Cancel
        </Button>
        <Button
          disabled={loading}
          onClick={handleSubmit(updateAccount)}
          className="btn-primary"
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AccountEditDialog;
