import { Observable, Subject } from "rxjs";

interface ConfirmationSubject {
  title: string;
  message: string;
  onCloseHandler?: () => void;
  onConfirmHandler: () => void;
}
const confirmationSubject = new Subject<ConfirmationSubject>();
const confirmationService = {
  get: (): Observable<ConfirmationSubject> =>
    confirmationSubject.asObservable(),
  confirm: (args: ConfirmationSubject) => confirmationSubject.next(args),
};

export { confirmationService };
