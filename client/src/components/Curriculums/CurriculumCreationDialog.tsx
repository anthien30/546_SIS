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
import { useForm } from "react-hook-form";
import { useCallback, useEffect, useState } from "react";
import axiosInstance from "../../config/axiosInstance";
import { notificationService } from "../Common/Notification/notificationSubject";
import { Curriculum } from "./models";
import { Course } from "../Courses/models";

type CurriculumCreationDialogProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  searchCurriculums: (filters: { [key: string]: string }) => void;
};
const CurriculumCreationDialog = ({
  isOpen,
  setIsOpen,
  searchCurriculums,
}: CurriculumCreationDialogProps) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
    watch,
  } = useForm<Curriculum>();
  const [loading, setLoading] = useState(false);
  const [courseOptions, setCourseOptions] = useState<Course[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);

  const courses = watch("courses");

  const createCurriculum = (data: Curriculum) => {
    setLoading(true);
    axiosInstance
      .post("/api/curriculum/create", data)
      .then(() => {
        notificationService.success("Curriculum created");
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
      setCourseOptions(
        response.data
          .filter((c) => !courses?.includes(c._id))
          .map((c) => ({ ...c, id: c._id }))
      );
    } catch (error) {
      console.error(error);
    }
  };

  const debouncedSearch = useCallback(debounce(searchCourses, 500), [courses]);

  const handleClose = () => {
    setIsOpen(false);
    setSelectedCourses([]);
  };

  useEffect(() => {
    reset({});
  }, [isOpen, reset]);

  return (
    <Dialog open={isOpen} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>New Curriculum</DialogTitle>
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
                    {...register("courses", {
                      validate: {
                        validator: (value) => {
                          if (value?.length) return true;
                          return "Must have at least 1 course";
                        },
                      },
                    })}
                    autoComplete
                    multiple
                    sx={{
                      width: "100%",
                    }}
                    getOptionLabel={(option) =>
                      `${option.code} - ${option.name}`
                    }
                    options={courseOptions}
                    filterOptions={(x) => x}
                    onInputChange={(_, inputVal) => {
                      debouncedSearch(inputVal);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Search for course(s)"
                      />
                    )}
                    renderTags={(selected, getTagProps) =>
                      selected.map((option, index) => (
                        <Chip label={option.name} {...getTagProps({ index })} />
                      ))
                    }
                    onChange={(_, value) => {
                      setSelectedCourses(value);
                      if (value)
                        setValue("courses", value?.map((p) => p.id) as any);
                      setCourseOptions([]);
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
          onClick={handleClose}
          className="btn-secondary"
        >
          Cancel
        </Button>
        <Button
          disabled={loading}
          onClick={handleSubmit(createCurriculum)}
          className="btn-primary"
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CurriculumCreationDialog;
