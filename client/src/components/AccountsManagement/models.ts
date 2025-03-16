export interface Account {
  email: string | null;
  username: string | null;
  role: string | null;
  status: "Active" | "Inactive";
  createdBy: string | null;
  createdOn: string | null;
  id: string | null;
  _id: string;
}
