import AccountsDataGrid from "./AccountsDataGrid";
import { useEffect, useState } from "react";
import { Account } from "./models";
import axiosInstance from "../../config/axiosInstance";
import AccountsFiltersPanel from "./AccountsFiltersPanel";
import AccountCreationDialog from "./AccountCreationDialog";
import AccountEditDialog from "./AccountEditDialog";

const AccountsManagementView = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isCreationOpen, setIsCreationOpen] = useState(false);
  const [openAccount, setOpenAccount] = useState<Account | null>(null);

  const searchAccounts = async (filtersJson: { [key: string]: any }) => {
    const queryStr = new URLSearchParams(filtersJson).toString();
    try {
      const response = await axiosInstance.get<Account[]>(
        `/api/account/search?${queryStr}`
      );
      setAccounts(response.data.map((a) => ({ ...a, id: a._id })));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    searchAccounts({});
  }, []);

  return (
    <div className="moduleWrapper">
      <h3 className="mb-4">Accounts Management</h3>

      <div className="mb-4">
        <AccountsFiltersPanel searchAccounts={searchAccounts} />
      </div>

      <AccountsDataGrid
        data={accounts}
        displayCreationForm={() => setIsCreationOpen(true)}
        displayEditForm={(account) => setOpenAccount(account)}
      />

      <AccountCreationDialog
        searchAccounts={() => searchAccounts({})}
        isOpen={isCreationOpen}
        setIsOpen={setIsCreationOpen}
      />

      <AccountEditDialog
        searchAccounts={() => searchAccounts({})}
        account={openAccount}
        setAccount={(account) => setOpenAccount(account)}
      />
    </div>
  );
};

export default AccountsManagementView;
