import { useEffect, useState } from "react";
import { Course } from "./models";
import axiosInstance from "../../config/axiosInstance";
import CoursesFiltersPanel from "./CoursesFiltersPanel";
import CoursesDataGrid from "./CoursesDataGrid";
import CourseCreationDialog from "./CourseCreationDialog";
import CourseEditDialog from "./CourseEditDialog";

const CoursesView = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isCreationOpen, setIsCreationOpen] = useState(false);
  const [openCourse, setOpenCourse] = useState<Course | null>(null);

  const searchCourses = async (filtersJson: { [key: string]: any }) => {
    const queryStr = new URLSearchParams(filtersJson).toString();
    try {
      const response = await axiosInstance.get<Course[]>(
        `/api/course/search?${queryStr}`
      );
      setCourses(response.data.map((a) => ({ ...a, id: a._id })));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    searchCourses({});
  }, []);

  return (
    <div className="moduleWrapper">
      <h3 className="mb-4">Courses</h3>

      <div className="mb-4">
        <CoursesFiltersPanel searchCourses={searchCourses} />
      </div>

      <CoursesDataGrid
        data={courses}
        displayCreationForm={() => setIsCreationOpen(true)}
        displayEditForm={(course) => setOpenCourse(course)}
      />

      <CourseCreationDialog
        searchCourses={(filters) => searchCourses(filters)}
        isOpen={isCreationOpen}
        setIsOpen={setIsCreationOpen}
      />

      <CourseEditDialog
        searchCourses={(filters) => searchCourses(filters)}
        course={openCourse}
        setCourse={setOpenCourse}
      />
    </div>
  );
};

export default CoursesView;
