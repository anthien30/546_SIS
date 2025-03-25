import {
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { Button, Col, Form, FormGroup, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import axiosInstance from "../../config/axiosInstance";
import { notificationService } from "../Common/Notification/notificationSubject";
import { Schedule } from "./models";
import { Course } from "../Courses/models";
import { formatTime } from "../../utils/datetime";
import { meService } from "../Common/subjects/meSubject";

type ScheduleEnrollmentDialogProps = {
  schedule: Schedule | null;
  setSchedule: (schedule: Schedule | null) => void;
  searchSchedules: (filters: { [key: string]: string }) => void;
};
const ScheduleEnrollmentDialog = ({
  schedule,
  setSchedule,
  searchSchedules,
}: ScheduleEnrollmentDialogProps) => {
  const { getValues, handleSubmit, reset, setValue } = useForm<Schedule>({
    mode: "all",
  });
  const [loading, setLoading] = useState(false);

  const prerequisites = getValues("course.prerequisites");
  const enrolledStudents = getValues("enrolledStudents");
  const isEnrolled = enrolledStudents?.includes(
    meService.getData()?._id as any
  );

  const handleCourseEnrollmentAction = (data: Schedule, enroll: boolean) => {
    const accountData = meService.getData();
    if (!accountData) return notificationService.error("Account data is null");

    if (enroll) data.enrolledStudents.push(accountData._id);
    else
      data.enrolledStudents = data.enrolledStudents.filter(
        (s) => s !== accountData._id
      );
    enrollInCourse(data, enroll);
  };

  const enrollInCourse = (data: Schedule, enroll: boolean) => {
    setLoading(true);
    axiosInstance
      .post("/api/schedule/update", data)
      .then(() => {
        notificationService.success(
          `Course ${enroll ? "enrolled" : "dropped"} successfully`
        );
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

  const handleClose = () => setSchedule(null);

  useEffect(() => reset({ ...schedule }), [schedule, reset]);

  return (
    <Dialog open={!!schedule} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>Course Details</DialogTitle>
      <DialogContent>
        <Form className="position-relative">
          <Row>
            <Col sm={4}>
              <FormGroup className="mb-4">
                <Form.Label className="fw-bold">Academic Term</Form.Label>
                <div>{getValues("term")}</div>
              </FormGroup>
            </Col>

            <Col sm={4}>
              <FormGroup className="mb-4">
                <Form.Label className="fw-bold">Course</Form.Label>
                <div>
                  {(function () {
                    const course = getValues("course") as Course;
                    return `${course?.code} - ${course?.name}`;
                  })()}
                </div>
              </FormGroup>
            </Col>

            <Col sm={4}>
              <FormGroup className="mb-4">
                <Form.Label className="fw-bold">Availability</Form.Label>
                <div>{`${
                  getValues("maxEnrollment") -
                  (getValues("enrolledStudents")?.length ?? 0)
                }/${getValues("maxEnrollment")} spot(s) left`}</div>
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col sm={12}>
              <FormGroup className="mb-4">
                <Form.Label className="fw-bold">
                  Meeting Time & Location
                </Form.Label>
                <div>
                  <span>{getValues("days")?.join("/")}</span>
                  <span>{` (${formatTime(
                    getValues("startTime") as string
                  )} to ${formatTime(
                    getValues("endTime") as string
                  )}) ----- ${getValues("location")}`}</span>
                </div>
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col sm={12}>
              <FormGroup className="mb-4">
                <Form.Label className="fw-bold">Prerequisites</Form.Label>
                <div>
                  <span>
                    {prerequisites?.length
                      ? prerequisites
                          ?.map((p: any) => `${p.code} - ${p.name}`)
                          ?.join(", ")
                      : "None"}
                  </span>
                </div>
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
        {isEnrolled && (
          <Button
            disabled={loading}
            onClick={handleSubmit((data) =>
              handleCourseEnrollmentAction(data, false)
            )}
            className="btn-secondary"
          >
            Drop
          </Button>
        )}
        {!isEnrolled && (
          <Button
            disabled={
              loading || enrolledStudents?.length >= getValues("maxEnrollment")
            }
            onClick={handleSubmit((data) =>
              handleCourseEnrollmentAction(data, true)
            )}
            className="btn-primary"
          >
            Enroll
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ScheduleEnrollmentDialog;
