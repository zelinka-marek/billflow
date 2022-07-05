import type { Transaction } from "~/models/transaction.model";
import { getTransactionStats } from "~/utils";

const numberFmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function TransactionOverview({
  transactions,
}: {
  transactions: Array<Transaction>;
}) {
  const { balance, expenses, income } = getTransactionStats(transactions);

  return (
    <dl className="grid grid-cols-1 gap-5 sm:grid-cols-3">
      <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
        <dt className="truncate text-sm font-medium text-gray-500">
          Current Balance
        </dt>
        <dd className="text-2xl font-semibold text-gray-900">
          {numberFmt.format(balance)}
        </dd>
      </div>
      <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
        <dt className="truncate text-sm font-medium text-gray-500">
          Total Expenses
        </dt>
        <dd className="text-2xl font-semibold text-gray-900">
          {numberFmt.format(expenses)}
        </dd>
      </div>
      <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
        <dt className="truncate text-sm font-medium text-gray-500">
          Total Income
        </dt>
        <dd className="text-2xl font-semibold text-gray-900">
          {numberFmt.format(income)}
        </dd>
      </div>
    </dl>
  );
}
