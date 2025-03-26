import SchedulesViewSearch from "./SchedulesViewSearch";
import { userPermissionService } from "../Common/subjects/userPermissionSubject";
import StudentSchedulesView from "./StudentView/StudentSchedulesView";
import FacultySchedulesView from "./FacultyView/FacultySchedulesView";

const SchedulesView = () => {
  return (
    <div className="moduleWrapper">
      <h3 className="mb-4">Schedules</h3>

      {userPermissionService.isAdmin() && <SchedulesViewSearch />}

      {userPermissionService.isFaculty() && <FacultySchedulesView />}

      {userPermissionService.isStudent() && <StudentSchedulesView />}
    </div>
  );
};

export default SchedulesView;
