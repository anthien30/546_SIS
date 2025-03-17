import {
  Autocomplete,
  Chip,
  CircularProgress,
  debounce,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { Button, Col, Form, FormGroup, Row } from "react-bootstrap";
import { useFieldArray, useForm } from "react-hook-form";
import { useCallback, useEffect, useState } from "react";
import axiosInstance from "../../config/axiosInstance";
import { notificationService } from "../Common/Notification/notificationSubject";
import { Course } from "./models";
import { confirmationService } from "../Common/ConfirmationDialog/confirmationDialogSubject";

type CourseEditDialogProps = {
  course: Course | null;
  setCourse: (course: Course | null) => void;
  searchCourses: (filters: { [key: string]: string }) => void;
};
const CourseEditDialog = ({
  course,
  setCourse,
  searchCourses,
}: CourseEditDialogProps) => {
  const {
    control,
    register,
    formState: { errors, dirtyFields },
    handleSubmit,
    reset,
    watch,
    setValue,
  } = useForm<Course>({ mode: "all" });
  useFieldArray({ control, name: "prerequisites" });
  const [loading, setLoading] = useState(false);
  const [prerequisitesOptions, setPrerequisitesOptions] = useState<Course[]>(
    []
  );
  const [selectedPrerequisites, setSelectedPrerequisites] = useState<Course[]>(
    []
  );

  const prerequisites = watch("prerequisites");
  const code = watch("code");

  const updateCourse = (data: Course) => {
    if (Object.keys(dirtyFields).length === 0)
      return notificationService.success("No changes were made");

    setLoading(true);
    axiosInstance
      .post("/api/course/update", data)
      .then(() => {
        notificationService.success("Course updated");
        searchCourses({});
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

  const searchPrerequisites = async (courseCodeOrName: string) => {
    if (!courseCodeOrName?.length) return;
    const queryStr = new URLSearchParams({
      codeOrName: courseCodeOrName,
      limit: "10",
    }).toString();
    try {
      const response = await axiosInstance.get<Course[]>(
        `/api/course/search?${queryStr}`
      );
      setPrerequisitesOptions(
        response.data
          .filter(
            (c) => c.code !== code && !prerequisites?.includes(c._id as string)
          )
          .map((c) => ({ ...c, id: c._id }))
      );
    } catch (error) {
      notificationService.error("Failed to search for prerequisites");
      console.error(error);
    }
  };

  const deleteCourse = async () => {
    setLoading(true);
    try {
      await axiosInstance.delete<Course[]>(
        `/api/course/delete?id=${course?._id}`
      );
      notificationService.success("Course deleted!");
      searchCourses({});
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

  const debouncedSearch = useCallback(debounce(searchPrerequisites, 500), [
    prerequisites,
  ]);

  const handleClose = () => setCourse(null);

  useEffect(() => {
    reset({
      ...course,
      prerequisites:
        (course?.prerequisites.map((p) => (p as Course)._id) as any) ?? [],
    });
    setSelectedPrerequisites((course?.prerequisites as any) ?? []);
  }, [course, reset]);

  return (
    <Dialog open={!!course} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>Course Details</DialogTitle>
      <DialogContent>
        <Form className="position-relative">
          <Row>
            <Col sm={6}>
              <FormGroup className="mb-4">
                <Form.Label className="fw-bold"> Course Name</Form.Label>
                <Form.Control
                  type="text"
                  {...register("name", {
                    required: "Course name is required",
                  })}
                  disabled
                  placeholder="Enter course name"
                />
                <Form.Text className="text-danger">
                  {errors.name?.message}
                </Form.Text>
              </FormGroup>
            </Col>

            <Col sm={6}>
              <FormGroup className="mb-4">
                <Form.Label className="fw-bold">Code</Form.Label>
                <Form.Control
                  type="text"
                  disabled
                  {...register("code", {
                    required: "Course code is required",
                  })}
                  placeholder="Enter code"
                />
                <Form.Text className="text-danger">
                  {errors.code?.message}
                </Form.Text>
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col sm={12}>
              <FormGroup className="mb-4">
                <Form.Label className="fw-bold">Credits</Form.Label>
                <Form.Control
                  type="number"
                  min={1}
                  max={6}
                  {...register("credits", {
                    required: "Credit is required",
                  })}
                  placeholder="Enter credits"
                />
                <Form.Text className="text-danger">
                  {errors.credits?.message}
                </Form.Text>
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col sm={12}>
              <FormGroup className="mb-4">
                <Form.Label className="fw-bold">Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  {...register("description")}
                />
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col sm={12}>
              <FormGroup className="mb-4">
                <Form.Label className="fw-bold">Prerequisites</Form.Label>
                <div className="d-flex">
                  <Autocomplete
                    {...register("prerequisites")}
                    autoComplete
                    multiple
                    sx={{ width: "100%" }}
                    getOptionLabel={(option) =>
                      `${option.code} - ${option.name}`
                    }
                    options={prerequisitesOptions}
                    filterOptions={(x) => x}
                    onInputChange={(_, inputVal) => {
                      debouncedSearch(inputVal);
                    }}
                    renderInput={(params) => (
                      <TextField {...params} placeholder="Prerequisites" />
                    )}
                    renderTags={(selected, getTagProps) =>
                      selected.map((option, index) => (
                        <Chip
                          // key={option.id}
                          label={option.name}
                          {...getTagProps({ index })}
                        />
                      ))
                    }
                    onChange={(_, value) => {
                      setSelectedPrerequisites(value);
                      if (value)
                        setValue(
                          "prerequisites",
                          value?.map((p) => p._id) as any,
                          { shouldDirty: true }
                        );
                      setPrerequisitesOptions([]);
                    }}
                    value={selectedPrerequisites}
                  />
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
        <Button
          disabled={loading}
          onClick={() => {
            confirmationService.confirm({
              title: "Deleting course: " + code,
              message: "Are you sure you want to delete this course?",
              onConfirmHandler: () => deleteCourse,
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
          onClick={handleSubmit(updateCourse)}
          className="btn-primary"
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CourseEditDialog;
