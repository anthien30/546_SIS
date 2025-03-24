import { useEffect, useState } from "react";
import CurriculumsDataGrid from "./CurriculumsDataGrid";
import axiosInstance from "../../config/axiosInstance";
import { Curriculum } from "./models";
import CurriculumCreationDialog from "./CurriculumCreationDialog";
import CurriculumEditDialog from "./CurriculumEditDialog";

const CurriculumsView = () => {
  const [curriculums, setCurriculums] = useState<Curriculum[]>([]);
  const [isCreationOpen, setIsCreationOpen] = useState(false);
  const [openCurriculum, setOpenCurriculum] = useState<Curriculum | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const searchCurriculums = async (filtersJson: { [key: string]: any }) => {
    setIsSearching(true);
    const queryStr = new URLSearchParams(filtersJson).toString();
    try {
      const response = await axiosInstance.get<Curriculum[]>(
        `/api/curriculum/search?${queryStr}`
      );
      setCurriculums(response.data.map((a) => ({ ...a, id: a._id })));
    } catch (error) {
      console.error(error);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    searchCurriculums({});
  }, []);

  return (
    <div className="moduleWrapper">
      <h3 className="mb-4">Curriculums</h3>

      {/* <div className="mb-4">
        <CoursesFiltersPanel searchCourses={searchCourses} />
      </div> */}

      <CurriculumsDataGrid
        data={curriculums}
        loading={isSearching}
        displayCreationForm={() => setIsCreationOpen(true)}
        displayEditForm={(curriculum) => setOpenCurriculum(curriculum)}
      />

      <CurriculumCreationDialog
        searchCurriculums={(filters) => searchCurriculums(filters)}
        isOpen={isCreationOpen}
        setIsOpen={setIsCreationOpen}
      />

      <CurriculumEditDialog
        searchCurriculums={(filters) => searchCurriculums(filters)}
        curriculum={openCurriculum}
        setCurriculum={setOpenCurriculum}
      />
    </div>
  );
};

export default CurriculumsView;
