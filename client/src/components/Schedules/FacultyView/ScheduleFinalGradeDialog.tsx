import {
  Autocomplete,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Button, Col, Form, FormGroup, Row } from "react-bootstrap";
import { AcademicRecord, Schedule } from "../models";
import { Account } from "../../AccountsManagement/models";
import { useForm } from "react-hook-form";
import axiosInstance from "../../../config/axiosInstance";
import { notificationService } from "../../Common/Notification/notificationSubject";

type ScheduleFinalGradeDialogProps = {
  schedule: Schedule;
  studentAccount: Account | null;
  setStudentAccount: (args: any) => void;
};
const ScheduleFinalGradeDialog = ({
  schedule,
  studentAccount,
  setStudentAccount,
}: ScheduleFinalGradeDialogProps) => {
  const {
    formState: { errors },
    handleSubmit,
    register,
    setValue,
    watch,
    reset,
  } = useForm<AcademicRecord>();

  const defaultFormState: AcademicRecord = {
    _id: null,
    grade: null,
    student: studentAccount ?? "",
    schedule: schedule,
  };

  const [loading, setLoading] = useState(false);

  const finalGrade = watch("grade");

  const gradeMap: { [key: string]: string } = {
    "93": "A",
    "90": "A-",
    "87": "B+",
    "83": "B",
    "80": "B-",
    "77": "C+",
    "73": "C",
    "70": "C-",
  };

  const handleClose = () => {
    setStudentAccount(null);
  };

  const saveFinalGrade = (data: AcademicRecord) => {
    setLoading(true);

    data.student ??= studentAccount!;
    data.schedule ??= schedule;

    axiosInstance
      .post("/api/academicRecord/createOrUpdate", data)
      .then(() => {
        notificationService.success("Final grade processed successfully");
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

  const fetchFinalGrade = async () => {
    setLoading(true);
    const filtersJson = {
      student: studentAccount?._id!,
      schedule: schedule._id,
    };
    const queryStr = new URLSearchParams(filtersJson).toString();
    try {
      const response = await axiosInstance.get<AcademicRecord[]>(
        `/api/academicRecord/search?${queryStr}`
      );
      if (response.data.length) reset(response.data[0]);
      else reset(defaultFormState);
    } catch (error) {
      console.error(error);
      reset(defaultFormState);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    studentAccount && fetchFinalGrade();
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
        <span>Final Grade for {studentAccount?.username}</span>{" "}
      </DialogTitle>
      <DialogContent>
        <Form className="position-relative">
          <Row>
            <Col sm={12}>
              <FormGroup className="mb-4">
                <Form.Label className="fw-bold">Final Grade</Form.Label>
                <Autocomplete
                  {...register("grade", {
                    required: "Must select a grade",
                  })}
                  sx={{
                    ".MuiAutocomplete-inputRoot": {
                      padding: "0.1rem",
                    },
                  }}
                  renderInput={(params) => (
                    <TextField {...params} placeholder="Grade" />
                  )}
                  getOptionLabel={(option) => {
                    return option?.toString()
                      ? gradeMap[option.toString()]
                      : " ";
                  }}
                  options={[93, 90, 87, 83, 80, 77, 73, 70]}
                  onChange={(_, value) => {
                    setValue("grade", value, {
                      shouldDirty: true,
                      shouldValidate: true,
                    });
                  }}
                  value={finalGrade ?? null}
                />
                <Form.Text className="text-danger">
                  {errors.grade?.message}
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
          onClick={() => setStudentAccount(null)}
          className="btn-secondary"
        >
          Close
        </Button>

        <Button
          disabled={loading}
          onClick={handleSubmit(saveFinalGrade)}
          className="btn-primary"
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ScheduleFinalGradeDialog;
