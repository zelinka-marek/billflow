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
import type { Account } from "~/models/account.server";
import { getAccountStatistics } from "~/utils";
import { EditAccountModal } from "./edit-account-modal";

const currencyFmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function AccountList({ accounts }: { accounts: Array<Account> }) {
  const groups = buildAccountGroups(accounts);

  if (accounts.length === 0) {
    return (
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
        <h3 className="mt-2 text-sm font-medium text-gray-900">No accounts</h3>
        <p className="mt-1 text-sm text-gray-500">
          You haven&apos;t added any accounts yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <div key={group.date} className="space-y-3">
          <div className="flex items-center px-4 sm:px-6">
            <div className="min-w-0 flex-1">
              <h3
                title={format(new Date(group.date), "P")}
                className="text-sm font-medium text-gray-600"
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
                className="inline-flex items-center rounded-full border border-red-200 bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800"
              >
                {currencyFmt.format(group.stats.expenses)}
              </p>
              <p
                title="Total income"
                className="inline-flex items-center rounded-full border border-green-200 bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800"
              >
                {currencyFmt.format(group.stats.income)}
              </p>
            </div>
          </div>
          <div className="overflow-hidden bg-white shadow sm:rounded-md">
            <ul role="list" className="divide-y divide-gray-200">
              {group.accounts.map((account) => (
                <AccountItem key={account.id} account={account} />
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}

function AccountItem({ account }: { account: Account }) {
  const deleteaccountFetcher = useFetcher();
  const isPendingDeletion =
    deleteaccountFetcher.submission?.formData.get("accountId") === account.id;

  const editModal = useDisclosure();

  return (
    <li
      className={classNames(
        isPendingDeletion ? "opacity-75" : "",
        "flex items-center p-4 sm:px-6"
      )}
    >
      <EditAccountModal
        open={editModal.isOpen}
        onClose={editModal.onClose}
        account={account}
      />
      <div className="min-w-0 flex-1">
        <div className="truncate">
          <p className="truncate text-sm font-medium text-brand-600">
            {currencyFmt.format(account.amount)}
          </p>
          <div className="mt-2 flex gap-6">
            <p
              title={format(new Date(account.date), "PP 'at' p")}
              className="flex items-center text-sm text-gray-500"
            >
              <ClockIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" />
              <time dateTime={new Date(account.date).toISOString()}>
                {format(new Date(account.date), "p")}
              </time>
            </p>
            <p
              title="Category"
              className="flex items-center text-sm text-gray-500"
            >
              <TagIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" />
              {account.category}
            </p>
          </div>
        </div>
      </div>
      <div className="ml-5 flex flex-shrink-0 gap-3">
        <button
          type="submit"
          onClick={editModal.onOpen}
          className="inline-flex items-center rounded-full border border-gray-300 bg-white p-2 text-gray-400 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
        >
          <span className="sr-only">Edit account</span>
          <PencilIcon className="h-5 w-5" />
        </button>
        <deleteaccountFetcher.Form method="post">
          <input type="hidden" name="intent" value="deleteaccount" />
          <input type="hidden" name="accountId" value={account.id} />
          <button
            type="submit"
            disabled={isPendingDeletion}
            className="inline-flex items-center rounded-full border border-gray-300 bg-white p-2 text-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 hover:enabled:bg-gray-50"
          >
            <span className="sr-only">
              {isPendingDeletion ? "Deleting account..." : "Delete account"}
            </span>
            <TrashIcon className="h-5 w-5" />
          </button>
        </deleteaccountFetcher.Form>
      </div>
    </li>
  );
}

interface AccountGroup {
  date: string;
  accounts: Array<Account>;
  stats: ReturnType<typeof getAccountStatistics>;
}

function buildAccountGroups(accounts: Array<Account>): AccountGroup[] {
  let groups: Array<AccountGroup> = [];

  for (const account of accounts) {
    const date = format(new Date(account.date), "P");

    const existingGroup = groups.find((group) => group.date === date);
    if (existingGroup) {
      groups = groups.map((group) =>
        group.date === date
          ? { ...group, accounts: [...group.accounts, account] }
          : group
      );
    } else {
      groups.push({
        date,
        accounts: [account],
        stats: { balance: 0, expenses: 0, income: 0 },
      });
    }
  }

  // include stats (expenses and income) for each group
  groups = groups.map((group) => ({
    ...group,
    stats: getAccountStatistics(group.accounts),
  }));

  // sort every account in each group by account.date (desc)
  for (const group of groups) {
    group.accounts.sort((a, b) =>
      compareDesc(new Date(a.date), new Date(b.date))
    );
  }

  // sort every group by group.date (desc)
  groups.sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)));

  return groups;
}
