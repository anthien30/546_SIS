import { Observable, Subject } from "rxjs";

interface Notification {
  type: "success" | "error";
  message: string;
}
const notificationSubject = new Subject<Notification>();
const notificationService = {
  get: (): Observable<Notification> => notificationSubject.asObservable(),
  success: (message: string) =>
    notificationSubject.next({ type: "success", message }),
  error: (message: string) =>
    notificationSubject.next({ type: "error", message }),
};

export { notificationService };
