import { BehaviorSubject, Observable } from "rxjs";
import { Account } from "../../AccountsManagement/models";

interface Me {
  data: null | Account;
}

const meSubject = new BehaviorSubject<Me>({
  data: null,
});
const meService = {
  get: (): Observable<Me> => meSubject.asObservable(),
  set: (me: Me) => meSubject.next(me),
  getData: () => meSubject.getValue().data,
};

export { meService };
