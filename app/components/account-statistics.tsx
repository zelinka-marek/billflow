import type { Account } from "~/models/account.server";
import { getAccountStatistics } from "~/utils";

const currencyFmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function AccountStatistics({ accounts }: { accounts: Array<Account> }) {
  const { balance, expenses, income } = getAccountStatistics(accounts);

  return (
    <dl className="grid grid-cols-1 gap-5 sm:grid-cols-3">
      <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
        <dt className="truncate text-sm font-medium text-gray-500">
          Current Balance
        </dt>
        <dd className="text-lg font-semibold text-gray-900">
          {currencyFmt.format(balance)}
        </dd>
      </div>
      <div className="ooverflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
        <dt className="truncate text-sm font-medium text-gray-500">
          Total Expenses
        </dt>
        <dd className="text-lg font-semibold text-gray-900">
          {currencyFmt.format(expenses)}
        </dd>
      </div>
      <div className="ooverflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
        <dt className="truncate text-sm font-medium text-gray-500">
          Total Income
        </dt>
        <dd className="text-lg font-semibold text-gray-900">
          {currencyFmt.format(income)}
        </dd>
      </div>
    </dl>
  );
}
