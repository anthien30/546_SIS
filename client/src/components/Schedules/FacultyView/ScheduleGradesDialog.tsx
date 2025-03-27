import {
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormGroup,
  TextField,
} from "@mui/material";
import { Account } from "../../AccountsManagement/models";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Grade, Schedule } from "../models";
import { useFieldArray, useForm } from "react-hook-form";
import axiosInstance from "../../../config/axiosInstance";
import { notificationService } from "../../Common/Notification/notificationSubject";

type ScheduleGradesDialogProps = {
  schedule: Schedule;
  studentAccount: Account | null;
  setStudentAccount: (args: any) => void;
};
const ScheduleGradesDialog = ({
  schedule,
  studentAccount,
  setStudentAccount,
}: ScheduleGradesDialogProps) => {
  const {
    control,
    register,
    getValues,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{ data: Grade[] }>();
  const {
    fields: grades,
    append,
    remove,
  } = useFieldArray({ control, name: "data" });
  const [loading, setLoading] = useState(false);

  const addDefaultGrade = () => {
    append({
      student: studentAccount!._id,
      schedule: schedule._id,
      score: null,
      maxScore: null,
      event: null,
    });
  };

  const handleClose = () => {
    console.log("close");
  };

  const saveGrades = ({ data }: { data: Grade[] }) => {
    setLoading(true);
    axiosInstance
      .post("/api/grade/createOrUpdate", data)
      .then(() => {
        notificationService.success("Grade(s) processed successfully");
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

  const fetchGrades = async () => {
    setLoading(true);
    const filtersJson = {
      student: studentAccount?._id!,
      schedule: schedule._id,
    };
    const queryStr = new URLSearchParams(filtersJson).toString();
    try {
      const response = await axiosInstance.get<Grade[]>(
        `/api/grade/search?${queryStr}`
      );
      reset({ data: response.data });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (studentAccount) fetchGrades();
  }, [studentAccount]);

  return (
    <Dialog
      open={!!studentAccount}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>Grades for {studentAccount?.username}</span>{" "}
        <Button className="btn-light" onClick={addDefaultGrade}>
          New Grade
        </Button>
      </DialogTitle>
      <DialogContent>
        <Form className="position-relative">
          {!grades.length && <p>No grades available</p>}
          {grades?.map((g, idx) => (
            <Row key={g.id}>
              <Col sm={3}>
                <FormGroup className="mb-4">
                  <Form.Label className="fw-bold">Title</Form.Label>
                  <TextField
                    sx={{
                      width: "100%",
                      ".MuiInputBase-formControl": {
                        height: "38px",
                      },
                    }}
                    {...register(`data.${idx}.event`, {
                      required: "Grade title is required",
                    })}
                    placeholder="Title"
                    type="text"
                  />
                  <Form.Text className="text-danger">
                    {(errors.data as any)?.at(idx)?.event?.message}
                  </Form.Text>
                </FormGroup>
              </Col>

              <Col sm={3}>
                <FormGroup className="mb-4">
                  <Form.Label className="fw-bold">Score</Form.Label>
                  <TextField
                    slotProps={{
                      input: {
                        inputProps: {
                          min: 0,
                        },
                      },
                    }}
                    sx={{
                      width: "100%",
                      ".MuiInputBase-formControl": {
                        height: "38px",
                      },
                    }}
                    {...register(`data.${idx}.score`, {
                      validate: {
                        isValid: (value) => {
                          if (!value) return "Score is required";
                          if (value < 0) return "Invalid score";
                          return true;
                        },
                      },
                    })}
                    placeholder="Score"
                    type="number"
                  />
                  <Form.Text className="text-danger">
                    {(errors.data as any)?.at(idx)?.score?.message}
                  </Form.Text>
                </FormGroup>
              </Col>

              <Col sm={3}>
                <FormGroup className="mb-4">
                  <Form.Label className="fw-bold">Max Score</Form.Label>
                  <TextField
                    slotProps={{
                      input: {
                        inputProps: {
                          min: 1,
                        },
                      },
                    }}
                    sx={{
                      width: "100%",
                      ".MuiInputBase-formControl": {
                        height: "38px",
                      },
                    }}
                    {...register(`data.${idx}.maxScore`, {
                      validate: {
                        isValid: (value) => {
                          if (!value) return "Max score is required";
                          if (value < 0) return "Invalid max score";
                          return true;
                        },
                      },
                    })}
                    placeholder="Max score"
                    type="number"
                  />
                  <Form.Text className="text-danger">
                    {(errors.data as any)?.at(idx)?.maxScore?.message}
                  </Form.Text>
                </FormGroup>
              </Col>

              <Col sm={1}>
                <Form.Label style={{ opacity: "0%" }}>Invisible</Form.Label>
                <div>
                  {!getValues(`data.${idx}._id`) && (
                    <Button onClick={() => remove(idx)} className="btn-light">
                      X
                    </Button>
                  )}
                </div>
              </Col>
            </Row>
          ))}

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
          onClick={() => setStudentAccount(null)}
          className="btn-secondary"
        >
          Close
        </Button>

        <Button
          disabled={loading}
          onClick={handleSubmit(saveGrades)}
          className="btn-primary"
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ScheduleGradesDialog;
