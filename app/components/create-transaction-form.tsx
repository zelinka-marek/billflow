import { useFetcher } from "@remix-run/react";
import { format } from "date-fns";
import * as React from "react";

interface CreateTransactionActionData {
  errors: {
    type?: string;
    amount?: string;
    category?: string;
    dateTime?: string;
  };
}

export function CreateTransactionForm() {
  const createTransactionFetcher = useFetcher();

  const createTransactionData = createTransactionFetcher.data as
    | CreateTransactionActionData
    | undefined;
  const isPending = Boolean(createTransactionFetcher.submission);

  const typeRef = React.useRef<HTMLSelectElement>(null);
  const amountRef = React.useRef<HTMLInputElement>(null);
  const categoryRef = React.useRef<HTMLInputElement>(null);
  const dateTimeRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (createTransactionData?.errors?.type) {
      typeRef.current?.focus();
    } else if (createTransactionData?.errors?.amount) {
      amountRef.current?.focus();
    } else if (createTransactionData?.errors?.category) {
      categoryRef.current?.focus();
    } else if (createTransactionData?.errors?.dateTime) {
      dateTimeRef.current?.focus();
    }
  }, [createTransactionData?.errors]);

  React.useEffect(() => {
    if (
      createTransactionFetcher.type === "done" &&
      !createTransactionData?.errors &&
      amountRef.current &&
      categoryRef.current &&
      dateTimeRef.current
    ) {
      amountRef.current.value = "";
      categoryRef.current.value = "";
      dateTimeRef.current.value = getCurrentDate();
      amountRef.current.focus();
    }
  }, [createTransactionFetcher.type, createTransactionData?.errors]);

  return (
    <createTransactionFetcher.Form method="post">
      <input type="hidden" name="intent" value="createTransaction" />
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
              aria-invalid={
                createTransactionData?.errors?.type ? true : undefined
              }
              aria-describedby="type-error"
              className="block w-full rounded-md border border-gray-300 bg-gray-50 pr-10 focus:border-brand-500 focus:outline-none focus:ring-brand-500 sm:text-sm"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
          {createTransactionData?.errors?.type ? (
            <p className="mt-2 text-sm text-red-600" id="type-error">
              {createTransactionData?.errors.type}
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
          <div className="relative mt-1 rounded-md">
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
              aria-invalid={
                createTransactionData?.errors?.amount ? true : undefined
              }
              aria-describedby="amount-error price-currency"
              className="block w-full rounded-md border-gray-300 bg-gray-50 pl-7 pr-12 focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
              placeholder="0.00"
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-500 sm:text-sm" id="price-currency">
                USD
              </span>
            </div>
          </div>
          {createTransactionData?.errors?.amount ? (
            <p className="mt-2 text-sm text-red-600" id="amount-error">
              {createTransactionData?.errors.amount}
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
              aria-invalid={
                createTransactionData?.errors?.category ? true : undefined
              }
              aria-describedby="category-error"
              className="block w-full rounded-md border-gray-300 bg-gray-50 focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
            />
          </div>
          {createTransactionData?.errors?.category ? (
            <p className="mt-2 text-sm text-red-600" id="category-error">
              {createTransactionData?.errors.category}
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
              defaultValue={getCurrentDate()}
              aria-invalid={
                createTransactionData?.errors?.dateTime ? true : undefined
              }
              aria-describedby="dateTime-error"
              className="block w-full rounded-md border-gray-300 bg-gray-50 focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
            />
          </div>
          {createTransactionData?.errors?.dateTime ? (
            <p className="mt-2 text-sm text-red-600" id="dateTime-error">
              {createTransactionData?.errors.dateTime}
            </p>
          ) : null}
        </div>
        <div className="sm:col-span-2">
          <div className="sm:flex sm:justify-end">
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-md border border-transparent bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 hover:enabled:bg-brand-700 disabled:opacity-75 sm:w-auto"
              disabled={isPending}
            >
              {isPending ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </createTransactionFetcher.Form>
  );
}

function getCurrentDate(): string {
  return format(new Date(), "yyyy-MM-dd'T'HH:mm");
}
