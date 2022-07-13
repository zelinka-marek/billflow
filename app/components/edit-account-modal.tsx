import { useFetcher } from "@remix-run/react";
import { format } from "date-fns";
import * as React from "react";

import type { Account } from "~/models/account.server";
import { Modal } from "./modal";

interface EditAccountActionData {
  errors: {
    type?: string;
    amount?: string;
    category?: string;
    date?: string;
  };
}

export function EditAccountModal({
  open,
  onClose,
  account,
}: {
  open: boolean;
  onClose: () => void;
  account: Account;
}) {
  const editAccountFetcher = useFetcher();

  const editAccountData = editAccountFetcher.data as
    | EditAccountActionData
    | undefined;
  const isPending = Boolean(editAccountFetcher.submission);

  const typeRef = React.useRef<HTMLSelectElement>(null);
  const amountRef = React.useRef<HTMLInputElement>(null);
  const categoryRef = React.useRef<HTMLInputElement>(null);
  const dateRef = React.useRef<HTMLInputElement>(null);
  const cancelButtonRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (editAccountData?.errors?.type) {
      typeRef.current?.focus();
    } else if (editAccountData?.errors?.amount) {
      amountRef.current?.focus();
    } else if (editAccountData?.errors?.category) {
      categoryRef.current?.focus();
    } else if (editAccountData?.errors?.date) {
      dateRef.current?.focus();
    }
  }, [editAccountData?.errors]);

  React.useEffect(() => {
    if (editAccountFetcher.type === "done" && !editAccountData?.errors) {
      onClose();
    }
  }, [editAccountData?.errors, editAccountFetcher.type, onClose]);

  return (
    <Modal
      title="Edit Account"
      initialFocus={cancelButtonRef}
      open={open}
      onClose={onClose}
    >
      <editAccountFetcher.Form method="post">
        <input type="hidden" name="intent" value="editAccount" />
        <input type="hidden" name="accountId" value={account.id} />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="edit-type"
              className="block text-sm font-medium text-gray-700"
            >
              Type
            </label>
            <div className="mt-1">
              <select
                ref={typeRef}
                id="edit-type"
                name="type"
                defaultValue={account.type}
                aria-invalid={editAccountData?.errors?.type ? true : undefined}
                aria-describedby="edit-type-error"
                className="block w-full rounded-md border-gray-300 bg-gray-50 pr-10 focus:border-brand-500 focus:outline-none focus:ring-brand-500 sm:text-sm"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            {editAccountData?.errors?.type ? (
              <p className="mt-2 text-sm text-red-600" id="edit-type-error">
                {editAccountData?.errors.type}
              </p>
            ) : null}
          </div>
          <div>
            <label
              htmlFor="edit-amount"
              className="block text-sm font-medium text-gray-700"
            >
              Amount
            </label>
            <div className="relative mt-1 rounded-md">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                ref={amountRef}
                type="number"
                name="amount"
                id="edit-amount"
                min="0.01"
                step="0.01"
                defaultValue={
                  account.type === "expense"
                    ? Math.abs(account.amount)
                    : account.amount
                }
                aria-invalid={
                  editAccountData?.errors?.amount ? true : undefined
                }
                aria-describedby="edit-amount-error amount-currency"
                className="block w-full rounded-md border-gray-300 bg-gray-50 pl-7 pr-12  focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
                placeholder="0.00"
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-gray-500 sm:text-sm" id="amount-currency">
                  USD
                </span>
              </div>
            </div>
            {editAccountData?.errors?.amount ? (
              <p className="mt-2 text-sm text-red-600" id="edit-amount-error">
                {editAccountData?.errors.amount}
              </p>
            ) : null}
          </div>
          <div>
            <label
              htmlFor="edit-category"
              className="block text-sm font-medium text-gray-700"
            >
              Category
            </label>
            <div className="mt-1">
              <input
                ref={categoryRef}
                type="text"
                name="category"
                id="edit-category"
                defaultValue={account.category}
                aria-invalid={
                  editAccountData?.errors?.category ? true : undefined
                }
                aria-describedby="edit-category-error"
                className="block w-full rounded-md border-gray-300 bg-gray-50 focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
              />
            </div>
            {editAccountData?.errors?.category ? (
              <p className="mt-2 text-sm text-red-600" id="edit-category-error">
                {editAccountData?.errors.category}
              </p>
            ) : null}
          </div>
          <div>
            <label
              htmlFor="edit-date"
              className="block text-sm font-medium text-gray-700"
            >
              Date and time
            </label>
            <div className="mt-1">
              <input
                ref={dateRef}
                type="datetime-local"
                name="date"
                id="edit-date"
                defaultValue={format(
                  new Date(account.date),
                  "yyyy-MM-dd'T'HH:mm"
                )}
                aria-invalid={editAccountData?.errors?.date ? true : undefined}
                aria-describedby="edit-date-error"
                className="block w-full rounded-md border-gray-300 bg-gray-50 focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
              />
            </div>
            {editAccountData?.errors?.date ? (
              <p className="mt-2 text-sm text-red-600" id="edit-date-error">
                {editAccountData?.errors.date}
              </p>
            ) : null}
          </div>
          <div className="sm:col-span-2">
            <div className="sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-md border border-transparent bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 hover:enabled:bg-brand-700 disabled:opacity-75 sm:ml-3 sm:w-auto"
                disabled={isPending}
              >
                {isPending ? "Saving..." : "Save"}
              </button>
              <button
                ref={cancelButtonRef}
                type="button"
                className="mt-3 inline-flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 sm:mt-0 sm:w-auto"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </editAccountFetcher.Form>
    </Modal>
  );
}
