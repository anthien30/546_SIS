import {
  Autocomplete,
  CircularProgress,
  debounce,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { Button, Col, Form, FormGroup, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useCallback, useEffect, useState } from "react";
import axiosInstance from "../../../config/axiosInstance";
import { notificationService } from "../../Common/Notification/notificationSubject";
import { Schedule } from "../models";
import { Course } from "../../Courses/models";
import { confirmationService } from "../../Common/ConfirmationDialog/confirmationDialogSubject";
import { Account } from "../../AccountsManagement/models";

type ScheduleEditDialogProps = {
  schedule: Schedule | null;
  setSchedule: (schedule: Schedule | null) => void;
  searchSchedules: (filters: { [key: string]: string }) => void;
};
const ScheduleEditDialog = ({
  schedule,
  setSchedule,
  searchSchedules,
}: ScheduleEditDialogProps) => {
  const {
    register,
    formState: { errors, dirtyFields },
    getValues,
    handleSubmit,
    reset,
    setValue,
  } = useForm<Schedule>({ mode: "all" });
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [instructors, setInstructors] = useState<Account[]>([]);

  const updateSchedule = (data: Schedule) => {
    if (Object.keys(dirtyFields).length === 0)
      return notificationService.success("No changes were made");

    setLoading(true);
    axiosInstance
      .post("/api/schedule/update", data)
      .then(() => {
        notificationService.success("Account updated");
        searchSchedules({});
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

  const deleteSchedule = async () => {
    setLoading(true);
    try {
      await axiosInstance.delete(`/api/schedule/delete?id=${schedule?._id}`);
      notificationService.success("Schedule deleted!");
      searchSchedules({});
      handleClose();
    } catch (error: any) {
      console.error(error);
      notificationService.error(
        error.response?.data?.message ?? "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const searchCourses = async (courseCodeOrName: string | null) => {
    if (!courseCodeOrName?.length) return;
    const queryStr = new URLSearchParams({
      codeOrName: courseCodeOrName,
      limit: "10",
    }).toString();
    try {
      const response = await axiosInstance.get<Course[]>(
        `/api/course/search?${queryStr}`
      );
      setCourses(response.data);
    } catch (error) {
      notificationService.error(
        "Something went wrong while searching for course"
      );
      console.error(error);
    }
  };

  const searchInstructor = async (username: string) => {
    const queryStr = new URLSearchParams({
      username: username,
      role: "Faculty",
      limit: "10",
    }).toString();
    try {
      const response = await axiosInstance.get<Account[]>(
        `/api/account/search?${queryStr}`
      );
      setInstructors(response.data);
    } catch (error) {
      notificationService.error(
        "Something went wrong while searching for instructor"
      );
      console.error(error);
    }
  };

  const debouncedSearchCourses = useCallback(debounce(searchCourses, 500), []);

  const debouncedSearchInstructors = useCallback(
    debounce(searchInstructor, 500),
    []
  );

  const handleClose = () => setSchedule(null);

  useEffect(() => reset({ ...schedule }), [schedule, reset]);

  return (
    <Dialog open={!!schedule} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>Schedule Details</DialogTitle>
      <DialogContent>
        <Form className="position-relative">
          <Row>
            <Col sm={6}>
              <FormGroup className="mb-4">
                <Form.Label className="fw-bold">Academic Term</Form.Label>
                <Autocomplete
                  {...register("term", { required: "Term is required" })}
                  sx={{
                    width: "100%",
                    ".MuiInputBase-formControl": {
                      height: "38px",
                    },
                  }}
                  renderInput={(params) => (
                    <TextField {...params} placeholder="Term" />
                  )}
                  options={["Fall 2026", "Winter 2027", "Spring 2027"]}
                  onChange={(_, value) =>
                    setValue("term", value, {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }
                  value={getValues("term")}
                />
                <Form.Text className="text-danger">
                  {errors.term?.message}
                </Form.Text>
              </FormGroup>
            </Col>

            <Col sm={6}>
              <FormGroup className="mb-4">
                <Form.Label className="fw-bold">Course</Form.Label>
                <Autocomplete
                  {...register("course", { required: "Course is required" })}
                  sx={{
                    width: "100%",
                    ".MuiInputBase-formControl": {
                      height: "38px",
                    },
                  }}
                  autoComplete
                  getOptionLabel={(option: Course) =>
                    `${option?.code} - ${option?.name}`
                  }
                  options={courses}
                  filterOptions={(x) => x}
                  onInputChange={(_, inputVal) => {
                    debouncedSearchCourses(inputVal);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} placeholder="Type to search" />
                  )}
                  onChange={(_, value) =>
                    setValue("course", value, {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }
                  value={getValues("course") as any}
                />
                <Form.Text className="text-danger">
                  {errors.course?.message}
                </Form.Text>
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col sm={12}>
              <FormGroup className="mb-4">
                <Form.Label className="fw-bold">Days</Form.Label>
                <Autocomplete
                  {...register("days", {
                    validate: {
                      validator: (value) => {
                        if (value?.length) return true;
                        return "Please select at least 1 day";
                      },
                    },
                  })}
                  sx={{
                    width: "100%",
                    ".MuiInputBase-formControl": {
                      padding: "3px",
                    },
                  }}
                  multiple
                  options={[
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday",
                  ]}
                  renderInput={(params) => (
                    <TextField {...params} placeholder="" />
                  )}
                  onChange={(_, value) =>
                    setValue("days", value as any, {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }
                  value={getValues("days")}
                />
                <Form.Text className="text-danger">
                  {errors.days?.message}
                </Form.Text>
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col sm={6}>
              <FormGroup className="mb-4">
                <Form.Label className="fw-bold">Start Time</Form.Label>
                <TextField
                  sx={{
                    width: "100%",
                    ".MuiInputBase-formControl": {
                      height: "38px",
                    },
                  }}
                  {...register("startTime", {
                    required: "Start time is required",
                  })}
                  placeholder="Start Time"
                  type="time"
                />
                <Form.Text className="text-danger">
                  {errors.startTime?.message}
                </Form.Text>
              </FormGroup>
            </Col>

            <Col sm={6}>
              <FormGroup className="mb-4">
                <Form.Label className="fw-bold">End Time</Form.Label>
                <TextField
                  sx={{
                    width: "100%",
                    ".MuiInputBase-formControl": {
                      height: "38px",
                    },
                  }}
                  {...register("endTime", { required: "End time is required" })}
                  placeholder="End Time"
                  type="time"
                />
                <Form.Text className="text-danger">
                  {errors.endTime?.message}
                </Form.Text>
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col sm={6}>
              <FormGroup className="mb-4">
                <Form.Label className="fw-bold">Location</Form.Label>
                <TextField
                  sx={{
                    width: "100%",
                    ".MuiInputBase-formControl": {
                      height: "38px",
                    },
                  }}
                  {...register("location")}
                  placeholder="Location"
                  type="text"
                />
              </FormGroup>
            </Col>

            <Col sm={6}>
              <FormGroup className="mb-4">
                <Form.Label className="fw-bold">Instructor</Form.Label>
                <Autocomplete
                  {...register("instructor", {
                    required: "Instructor is required",
                  })}
                  sx={{
                    width: "100%",
                    ".MuiInputBase-formControl": {
                      height: "38px",
                    },
                  }}
                  filterOptions={(x) => x}
                  getOptionLabel={(option) => `${option.username}`}
                  renderInput={(params) => (
                    <TextField {...params} placeholder="Instructor" />
                  )}
                  options={instructors}
                  onInputChange={(_, inputVal) => {
                    debouncedSearchInstructors(inputVal);
                  }}
                  onChange={(_, value) =>
                    setValue("instructor", value, {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }
                  value={getValues("instructor") as any}
                />
                <Form.Text className="text-danger">
                  {errors.instructor?.message}
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
          onClick={() => {
            confirmationService.confirm({
              title: "Deleting schedule",
              message: "Are you sure you want to delete this schedule?",
              onConfirmHandler: () => deleteSchedule,
            });
          }}
          className="btn-danger"
        >
          Delete
        </Button>
        <Button
          disabled={loading}
          onClick={handleClose}
          className="btn-secondary"
        >
          Cancel
        </Button>
        <Button
          disabled={loading}
          onClick={handleSubmit(updateSchedule)}
          className="btn-primary"
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ScheduleEditDialog;
