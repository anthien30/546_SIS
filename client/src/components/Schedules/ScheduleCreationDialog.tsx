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
import axiosInstance from "../../config/axiosInstance";
import { notificationService } from "../Common/Notification/notificationSubject";
import { Schedule } from "./models";
import { Course } from "../Courses/models";

type ScheduleCreationDialogProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  searchSchedules: (filters: { [key: string]: string }) => void;
};
const ScheduleCreationDialog = ({
  isOpen,
  setIsOpen,
  searchSchedules,
}: ScheduleCreationDialogProps) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
  } = useForm<Schedule>({ mode: "all" });
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);

  const createSchedule = (data: Schedule) => {
    data.course = (data.course as Course)?._id;

    setLoading(true);
    axiosInstance
      .post("/api/schedule/create", data)
      .then(() => {
        notificationService.success("Schedule created");
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
  const debouncedSearchCourses = useCallback(debounce(searchCourses, 500), []);

  const handleClose = () => {
    setIsOpen(false);
  };

  useEffect(() => reset({}), [isOpen, reset]);

  return (
    <Dialog open={isOpen} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>New Schedule</DialogTitle>
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
                    setValue("term", value, { shouldValidate: true })
                  }
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
                  getOptionLabel={(option) => `${option.code} - ${option.name}`}
                  options={courses}
                  filterOptions={(x) => x}
                  onInputChange={(_, inputVal) => {
                    debouncedSearchCourses(inputVal);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} placeholder="Type to search" />
                  )}
                  onChange={(_, value) =>
                    setValue("course", value, { shouldValidate: true })
                  }
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
                    setValue("days", value as any, { shouldValidate: true })
                  }
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
            <Col sm={12}>
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
          onClick={handleSubmit(createSchedule)}
          className="btn-primary"
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ScheduleCreationDialog;
