import { useFetcher } from "@remix-run/react";
import { format } from "date-fns";
import * as React from "react";

interface CreateAccountActionData {
  errors: {
    type?: string;
    amount?: string;
    category?: string;
    date?: string;
  };
}

export function CreateAccountForm() {
  const createAccountFetcher = useFetcher();

  const createAccountData = createAccountFetcher.data as
    | CreateAccountActionData
    | undefined;
  const isPending = Boolean(createAccountFetcher.submission);

  const typeRef = React.useRef<HTMLSelectElement>(null);
  const amountRef = React.useRef<HTMLInputElement>(null);
  const categoryRef = React.useRef<HTMLInputElement>(null);
  const dateRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (createAccountData?.errors?.type) {
      typeRef.current?.focus();
    } else if (createAccountData?.errors?.amount) {
      amountRef.current?.focus();
    } else if (createAccountData?.errors?.category) {
      categoryRef.current?.focus();
    } else if (createAccountData?.errors?.date) {
      dateRef.current?.focus();
    }
  }, [createAccountData?.errors]);

  React.useEffect(() => {
    if (
      createAccountFetcher.type === "done" &&
      !createAccountData?.errors &&
      amountRef.current &&
      categoryRef.current &&
      dateRef.current
    ) {
      amountRef.current.value = "";
      categoryRef.current.value = "";
      dateRef.current.value = getCurrentDate();
      amountRef.current.focus();
    }
  }, [createAccountFetcher.type, createAccountData?.errors]);

  return (
    <createAccountFetcher.Form method="post">
      <input type="hidden" name="intent" value="createAccount" />
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
              aria-invalid={createAccountData?.errors?.type ? true : undefined}
              aria-describedby="type-error"
              className="block w-full rounded-md border border-gray-300 bg-gray-50 pr-10 focus:border-brand-500 focus:outline-none focus:ring-brand-500 sm:text-sm"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
          {createAccountData?.errors?.type ? (
            <p className="mt-2 text-sm text-red-600" id="type-error">
              {createAccountData?.errors.type}
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
                createAccountData?.errors?.amount ? true : undefined
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
          {createAccountData?.errors?.amount ? (
            <p className="mt-2 text-sm text-red-600" id="amount-error">
              {createAccountData?.errors.amount}
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
                createAccountData?.errors?.category ? true : undefined
              }
              aria-describedby="category-error"
              className="block w-full rounded-md border-gray-300 bg-gray-50 focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
            />
          </div>
          {createAccountData?.errors?.category ? (
            <p className="mt-2 text-sm text-red-600" id="category-error">
              {createAccountData?.errors.category}
            </p>
          ) : null}
        </div>
        <div>
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700"
          >
            Date and time
          </label>
          <div className="mt-1">
            <input
              ref={dateRef}
              type="datetime-local"
              name="date"
              id="date"
              defaultValue={getCurrentDate()}
              aria-invalid={createAccountData?.errors?.date ? true : undefined}
              aria-describedby="date-error"
              className="block w-full rounded-md border-gray-300 bg-gray-50 focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
            />
          </div>
          {createAccountData?.errors?.date ? (
            <p className="mt-2 text-sm text-red-600" id="date-error">
              {createAccountData?.errors.date}
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
    </createAccountFetcher.Form>
  );
}

function getCurrentDate(): string {
  return format(new Date(), "yyyy-MM-dd'T'HH:mm");
}
