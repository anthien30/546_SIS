import { BehaviorSubject, Observable } from "rxjs";

interface UserPermission {
  role: "Admin" | "Faculty" | "Student" | null;
}

const userPermissionSubject = new BehaviorSubject<UserPermission>({
  role: (localStorage.getItem("role") as any) ?? null,
});
const userPermissionService = {
  get: (): Observable<UserPermission> => userPermissionSubject.asObservable(),
  //   set: (permission: UserPermission) => userPermissionSubject.next(permission),
  isAdmin: () => userPermissionSubject.getValue().role === "Admin",
  isFaculty: () => userPermissionSubject.getValue().role === "Faculty",
  isStudent: () => userPermissionSubject.getValue().role === "Student",
};

export { userPermissionService };
