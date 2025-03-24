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
import { useController, useFieldArray, useForm } from "react-hook-form";
import { useCallback, useEffect, useState } from "react";
import axiosInstance from "../../config/axiosInstance";
import { notificationService } from "../Common/Notification/notificationSubject";
import { confirmationService } from "../Common/ConfirmationDialog/confirmationDialogSubject";
import { Curriculum } from "./models";
import { Course } from "../Courses/models";

type CurriculumEditDialogProps = {
  curriculum: Curriculum | null;
  setCurriculum: (course: Curriculum | null) => void;
  searchCurriculums: (filters: { [key: string]: string }) => void;
};
const CurriculumEditDialog = ({
  curriculum,
  setCurriculum,
  searchCurriculums,
}: CurriculumEditDialogProps) => {
  const {
    control,
    register,
    formState: { errors, dirtyFields },
    handleSubmit,
    reset,
  } = useForm<Curriculum>({ mode: "all" });
  const {
    field: { value: courses, onChange: setCourses },
  } = useController({
    control,
    name: "courses",
    rules: {
      validate: {
        validator: (value) => {
          console.log(value);
          if (value?.length) return true;
          return "Must have at least 1 course";
        },
      },
    },
  });
  const [loading, setLoading] = useState(false);
  const [coursesOptions, setCoursesOptions] = useState<Course[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);

  const updateCurriculum = (data: Curriculum) => {
    if (Object.keys(dirtyFields).length === 0)
      return notificationService.success("No changes were made");

    setLoading(true);
    axiosInstance
      .post("/api/curriculum/update", data)
      .then(() => {
        notificationService.success("Curriculum updated");
        searchCurriculums({});
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

  const searchCourses = async (courseCodeOrName: string) => {
    if (!courseCodeOrName?.length) return;
    const queryStr = new URLSearchParams({
      codeOrName: courseCodeOrName,
      limit: "10",
    }).toString();
    try {
      const response = await axiosInstance.get<Course[]>(
        `/api/course/search?${queryStr}`
      );
      setCoursesOptions(
        response.data
          .filter((c) => !courses?.includes(c._id as string))
          .map((c) => ({ ...c, id: c._id }))
      );
    } catch (error) {
      notificationService.error("Failed to search for courses");
      console.error(error);
    }
  };

  const deleteCurriculum = async () => {
    setLoading(true);
    try {
      await axiosInstance.delete<Course[]>(
        `/api/curriculum/delete?id=${curriculum?._id}`
      );
      notificationService.success("Curriculum deleted!");
      searchCurriculums({});
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

  const debouncedSearch = useCallback(debounce(searchCourses, 500), [courses]);

  const handleClose = () => setCurriculum(null);

  useEffect(() => {
    reset({
      ...curriculum,
      courses: (curriculum?.courses.map((c) => (c as Course)._id) as any) ?? [],
    });
    setSelectedCourses((curriculum?.courses as any) ?? []);
  }, [curriculum, reset]);

  return (
    <Dialog open={!!curriculum} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>Curriculum Details</DialogTitle>
      <DialogContent>
        <Form className="position-relative">
          <Row>
            <Col sm={6}>
              <FormGroup className="mb-4">
                <Form.Label className="fw-bold">Program Name</Form.Label>
                <TextField
                  sx={{
                    width: "100%",
                    ".MuiInputBase-formControl": {
                      height: "38px",
                    },
                  }}
                  {...register("name", {
                    required: "Program name is required",
                  })}
                  placeholder="Enter Program Name"
                  type="text"
                />
                <Form.Text className="text-danger">
                  {errors.name?.message}
                </Form.Text>
              </FormGroup>
            </Col>

            <Col sm={6}>
              <FormGroup className="mb-4">
                <Form.Label className="fw-bold">Credits</Form.Label>
                <TextField
                  sx={{
                    width: "100%",
                    ".MuiInputBase-formControl": {
                      height: "38px",
                    },
                  }}
                  slotProps={{
                    input: {
                      inputProps: {
                        min: 1,
                      },
                    },
                  }}
                  {...register("creditsRequired", {
                    required: "Credits is required",
                  })}
                  placeholder="Enter credits"
                  type="number"
                />
                <Form.Text className="text-danger">
                  {errors.creditsRequired?.message}
                </Form.Text>
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col sm={12}>
              <FormGroup className="mb-4">
                <Form.Label className="fw-bold">Required Courses</Form.Label>
                <div className="d-flex">
                  <Autocomplete
                    autoComplete
                    multiple
                    sx={{ width: "100%" }}
                    getOptionLabel={(option) =>
                      `${option.code} - ${option.name}`
                    }
                    options={coursesOptions}
                    filterOptions={(x) => x}
                    onInputChange={(_, inputVal) => {
                      debouncedSearch(inputVal);
                    }}
                    renderInput={(params) => (
                      <TextField {...params} placeholder="Courses" />
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
                      console.log(value);
                      setSelectedCourses(value);
                      setCourses((value?.map((p) => p._id) as any) ?? []);
                      setCoursesOptions([]);
                    }}
                    value={selectedCourses}
                  />
                </div>
                <Form.Text className="text-danger">
                  {errors.courses?.message}
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
              title: "Deleting curriculum",
              message: "Are you sure you want to delete this curriculum?",
              onConfirmHandler: () => deleteCurriculum,
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
          onClick={handleSubmit(updateCurriculum)}
          className="btn-primary"
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CurriculumEditDialog;
