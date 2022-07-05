import {
  ClockIcon,
  PencilIcon,
  TagIcon,
  TrashIcon,
} from "@heroicons/react/solid";
import { useFetcher } from "@remix-run/react";
import classNames from "clsx";
import { compareDesc, format, isToday, isYesterday } from "date-fns";
import { useDisclosure } from "~/hooks/use-disclosure";

import type { Transaction } from "~/models/transaction.model";
import { getTransactionStats } from "~/utils";
import { EditTransactionModal } from "./edit-transaction-modal";

const currencyFmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function TransactionList({
  transactions,
}: {
  transactions: Array<Transaction>;
}) {
  const groups = getTransactionGroups(transactions);

  return (
    <div className="h-96 overflow-auto rounded-lg bg-white shadow">
      {transactions.length > 0 ? (
        groups.map((group) => (
          <div key={group.date} className="relative">
            <div className="sticky top-0 flex items-center bg-gray-50/90 px-4 py-3 ring-1 ring-gray-900/10 backdrop-blur-sm">
              <div className="min-w-0 flex-1">
                <h3
                  title={format(new Date(group.date), "P")}
                  className="text-sm font-medium text-gray-500"
                >
                  {format(new Date(group.date), "MMM d")}
                  {isToday(new Date(group.date))
                    ? ", Today"
                    : isYesterday(new Date(group.date))
                    ? ", Yesterday"
                    : null}
                </h3>
              </div>
              <div className="ml-4 flex gap-3">
                <p
                  title="Total expenses"
                  className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800"
                >
                  {currencyFmt.format(group.stats.expenses)}
                </p>
                <p
                  title="Total income"
                  className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800"
                >
                  {currencyFmt.format(group.stats.income)}
                </p>
              </div>
            </div>
            <ul role="list" className="divide-y divide-gray-200">
              {group.transactions.map((transaction) => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                />
              ))}
            </ul>
          </div>
        ))
      ) : (
        <div className="flex h-full flex-col justify-center text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 14v20c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252M8 14c0 4.418 7.163 8 16 8s16-3.582 16-8M8 14c0-4.418 7.163-8 16-8s16 3.582 16 8m0 0v14m0-4c0 4.418-7.163 8-16 8S8 28.418 8 24m32 10v6m0 0v6m0-6h6m-6 0h-6"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No transactions
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            You haven&apos;t added any transactions yet.
          </p>
        </div>
      )}
    </div>
  );
}

function TransactionItem({ transaction }: { transaction: Transaction }) {
  const deleteTransactionFetcher = useFetcher();
  const isPendingDeletion =
    deleteTransactionFetcher.submission?.formData.get("transactionId") ===
    transaction.id;

  const editModal = useDisclosure();

  return (
    <li
      className={classNames(
        isPendingDeletion ? "opacity-75" : "",
        "flex items-center p-4 sm:px-6"
      )}
    >
      <EditTransactionModal
        open={editModal.isOpen}
        onClose={editModal.onClose}
        transaction={transaction}
      />
      <div className="min-w-0 flex-1">
        <div className="truncate">
          <p className="truncate text-sm font-medium text-teal-600">
            {currencyFmt.format(transaction.amount)}
          </p>
          <div className="mt-2 flex gap-6">
            <p
              title={format(new Date(transaction.dateTime), "PP 'at' p")}
              className="flex items-center text-sm text-gray-500"
            >
              <ClockIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" />
              <time dateTime={new Date(transaction.dateTime).toISOString()}>
                {format(new Date(transaction.dateTime), "p")}
              </time>
            </p>
            <p
              title="Category"
              className="flex items-center text-sm text-gray-500"
            >
              <TagIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" />
              {transaction.category}
            </p>
          </div>
        </div>
      </div>
      <div className="ml-5 flex flex-shrink-0 gap-3">
        <button
          type="submit"
          onClick={editModal.onOpen}
          className="inline-flex items-center rounded-full border border-gray-300 bg-white p-2 text-gray-400 shadow-sm hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
        >
          <span className="sr-only">Edit transaction</span>
          <PencilIcon className="h-5 w-5" />
        </button>
        <deleteTransactionFetcher.Form method="post">
          <input type="hidden" name="intent" value="deleteTransaction" />
          <input type="hidden" name="transactionId" value={transaction.id} />
          <button
            type="submit"
            disabled={isPendingDeletion}
            className="inline-flex items-center rounded-full border border-gray-300 bg-white p-2 text-gray-400 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 hover:enabled:bg-gray-50"
          >
            <span className="sr-only">
              {isPendingDeletion
                ? "Deleting transaction..."
                : "Delete transaction"}
            </span>
            <TrashIcon className="h-5 w-5" />
          </button>
        </deleteTransactionFetcher.Form>
      </div>
    </li>
  );
}

function getTransactionGroups(transactions: Array<Transaction>) {
  let groups: Array<{
    date: string;
    transactions: Array<Transaction>;
    stats: { expenses: number; income: number };
  }> = [];

  transactions.forEach((transaction) => {
    const date = format(new Date(transaction.dateTime), "P");

    const existingGroup = groups.find((group) => group.date === date);
    if (existingGroup) {
      groups = groups.map((group) =>
        group.date === date
          ? { ...group, transactions: [...group.transactions, transaction] }
          : group
      );
    } else {
      groups.push({
        date,
        transactions: [transaction],
        stats: { expenses: 0, income: 0 },
      });
    }
  });

  // include stats (expenses and income) for each group
  groups = groups.map((group) => {
    const { expenses, income } = getTransactionStats(group.transactions);

    return {
      ...group,
      stats: { expenses, income },
    };
  });

  // sort every transaction in each group by transaction.dateTime (desc)
  groups.forEach((group) => {
    group.transactions.sort((a, b) =>
      compareDesc(new Date(a.dateTime), new Date(b.dateTime))
    );
  });

  // sort every group by group.date (desc)
  groups.sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)));

  return groups;
}
