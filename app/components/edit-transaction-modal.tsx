import { useFetcher } from "@remix-run/react";
import { format } from "date-fns";
import * as React from "react";

import type { Transaction } from "~/models/transaction.model";
import { Modal } from "./modal";

type EditTransactionActionData = {
  errors: {
    type?: string;
    amount?: string;
    category?: string;
    dateTime?: string;
  };
};

export function EditTransactionModal({
  open,
  onClose,
  transaction,
}: {
  open: boolean;
  onClose: () => void;
  transaction: Transaction;
}) {
  const editTransactionFetcher = useFetcher();

  const editTransactionData = editTransactionFetcher.data as
    | EditTransactionActionData
    | undefined;
  const isPending = Boolean(editTransactionFetcher.submission);

  const typeRef = React.useRef<HTMLSelectElement>(null);
  const amountRef = React.useRef<HTMLInputElement>(null);
  const categoryRef = React.useRef<HTMLInputElement>(null);
  const dateTimeRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (editTransactionData?.errors?.type) {
      typeRef.current?.focus();
    } else if (editTransactionData?.errors?.amount) {
      amountRef.current?.focus();
    } else if (editTransactionData?.errors?.category) {
      categoryRef.current?.focus();
    } else if (editTransactionData?.errors?.dateTime) {
      dateTimeRef.current?.focus();
    }
  }, [editTransactionData?.errors]);

  React.useEffect(() => {
    if (
      editTransactionFetcher.type === "done" &&
      !editTransactionData?.errors
    ) {
      onClose();
    }
  }, [editTransactionData?.errors, editTransactionFetcher.type, onClose]);

  return (
    <Modal title="Edit Transaction" open={open} onClose={onClose}>
      <editTransactionFetcher.Form method="post">
        <input type="hidden" name="intent" value="editTransaction" />
        <input type="hidden" name="transactionId" value={transaction.id} />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="type"
              className="block text-sm font-medium text-gray-700"
            >
              Type
            </label>
            <div className="mt-1">
              <select
                ref={typeRef}
                id="type"
                name="type"
                defaultValue={transaction.type}
                aria-invalid={
                  editTransactionData?.errors?.type ? true : undefined
                }
                aria-describedby="type-error"
                className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base shadow-sm focus:outline-none focus-visible:border-teal-500 focus-visible:ring-teal-500 sm:text-sm"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            {editTransactionData?.errors?.type ? (
              <p className="mt-2 text-sm text-red-600" id="type-error">
                {editTransactionData?.errors.type}
              </p>
            ) : null}
          </div>
          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700"
            >
              Amount
            </label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                ref={amountRef}
                type="number"
                name="amount"
                id="amount"
                min="0.01"
                step="0.01"
                defaultValue={
                  transaction.type === "expense"
                    ? Math.abs(transaction.amount)
                    : transaction.amount
                }
                aria-invalid={
                  editTransactionData?.errors?.amount ? true : undefined
                }
                aria-describedby="amount-error price-currency"
                className="block w-full rounded-md border-gray-300 pl-7 pr-12  focus-visible:border-teal-500 focus-visible:ring-teal-500 sm:text-sm"
                placeholder="0.00"
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-gray-500 sm:text-sm" id="price-currency">
                  USD
                </span>
              </div>
            </div>
            {editTransactionData?.errors?.amount ? (
              <p className="mt-2 text-sm text-red-600" id="amount-error">
                {editTransactionData?.errors.amount}
              </p>
            ) : null}
          </div>
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700"
            >
              Category
            </label>
            <div className="mt-1">
              <input
                ref={categoryRef}
                type="text"
                name="category"
                id="category"
                defaultValue={transaction.category}
                aria-invalid={
                  editTransactionData?.errors?.category ? true : undefined
                }
                aria-describedby="category-error"
                className="block w-full rounded-md border-gray-300 shadow-sm focus-visible:border-teal-500 focus-visible:ring-teal-500 sm:text-sm"
              />
            </div>
            {editTransactionData?.errors?.category ? (
              <p className="mt-2 text-sm text-red-600" id="category-error">
                {editTransactionData?.errors.category}
              </p>
            ) : null}
          </div>
          <div>
            <label
              htmlFor="dateTime"
              className="block text-sm font-medium text-gray-700"
            >
              Date and time
            </label>
            <div className="mt-1">
              <input
                ref={dateTimeRef}
                type="datetime-local"
                name="dateTime"
                id="dateTime"
                defaultValue={format(
                  new Date(transaction.dateTime),
                  "yyyy-MM-dd'T'HH:mm"
                )}
                aria-invalid={
                  editTransactionData?.errors?.dateTime ? true : undefined
                }
                aria-describedby="dateTime-error"
                className="block w-full rounded-md border-gray-300 shadow-sm focus-visible:border-teal-500 focus-visible:ring-teal-500 sm:text-sm"
              />
            </div>
            {editTransactionData?.errors?.dateTime ? (
              <p className="mt-2 text-sm text-red-600" id="dateTime-error">
                {editTransactionData?.errors.dateTime}
              </p>
            ) : null}
          </div>
          <div className="sm:col-span-2">
            <div className="sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                className="inline-flex w-full justify-center rounded-md border border-transparent bg-teal-600 px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 hover:enabled:bg-teal-700 disabled:opacity-75 sm:ml-3 sm:w-auto"
                disabled={isPending}
              >
                {isPending ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 sm:mt-0 sm:w-auto"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </editTransactionFetcher.Form>
    </Modal>
  );
}
