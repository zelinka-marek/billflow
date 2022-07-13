import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { AccountList } from "~/components/account-list";
import { AccountStatistics } from "~/components/account-statistics";
import { CreateAccountForm } from "~/components/create-account-form";
import { Navbar } from "~/components/navbar";
import {
  createAccount,
  deleteAccount,
  getAccount,
  getAccountListItems,
  updateAccount,
} from "~/models/account.server";
import { requireUserId } from "~/session.server";

interface LoaderData {
  accounts: Awaited<ReturnType<typeof getAccountListItems>>;
}

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const accounts = await getAccountListItems({ userId });

  return json<LoaderData>({ accounts });
};

type ActionData = {
  errors: {
    type?: string;
    amount?: string;
    category?: string;
    date?: string;
  };
};

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "createAccount" || intent === "editAccount") {
    const type = formData.get("type");
    const amount = formData.get("amount");
    const category = formData.get("category");
    const date = formData.get("date");

    if (typeof type !== "string") {
      return json<ActionData>(
        { errors: { type: "Type is required." } },
        { status: 400 }
      );
    } else if (!["expense", "income"].includes(type)) {
      return json<ActionData>(
        { errors: { type: "Type must be either expense or income." } },
        { status: 400 }
      );
    }

    if (typeof amount !== "string") {
      return json<ActionData>(
        { errors: { amount: "Amount is required." } },
        { status: 400 }
      );
    } else if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      return json<ActionData>(
        { errors: { amount: "Amount must be a number greater than 0." } },
        { status: 400 }
      );
    }

    if (typeof category !== "string" || category.length === 0) {
      return json<ActionData>(
        { errors: { category: "Category is required." } },
        { status: 400 }
      );
    }

    if (typeof date !== "string" || isNaN(Date.parse(date))) {
      return json<ActionData>(
        { errors: { date: "Invalid date." } },
        { status: 400 }
      );
    }

    if (intent === "createAccount") {
      await createAccount({
        type,
        amount: type === "expense" ? -parseFloat(amount) : parseFloat(amount),
        category,
        date: new Date(date),
        userId,
      });

      return new Response(null);
    } else if (intent === "editAccount") {
      const accountId = String(formData.get("accountId"));

      // make sure the Account belongs to the user
      const account = await getAccount({ id: accountId, userId });
      if (!account) {
        throw json({ error: "Account not found" }, { status: 404 });
      }

      await updateAccount({
        id: accountId,
        type,
        amount: type === "expense" ? -parseFloat(amount) : parseFloat(amount),
        category,
        date: new Date(date),
        userId,
      });

      return new Response(null);
    }
  } else if (intent === "deleteAccount") {
    const accountId = String(formData.get("accountId"));

    // make sure the Account belongs to the user
    const account = await getAccount({ id: accountId, userId });
    if (!account) {
      throw json({ error: "Account not found" }, { status: 404 });
    }

    await deleteAccount({ id: accountId, userId });

    return new Response(null);
  }

  throw json({ message: `Unknown intent: ${intent}` }, { status: 400 });
};

export default function AccountsPage() {
  const data = useLoaderData<LoaderData>();

  return (
    <div className="min-h-full border-t-8 border-blue-600">
      <Navbar />
      <div className="py-8">
        <main>
          <div className="mx-auto max-w-3xl space-y-8 px-4 sm:px-6">
            <section className="space-y-2">
              <h2 className="text-lg font-medium leading-6 text-gray-900">
                Overview
              </h2>
              <AccountStatistics accounts={data.accounts} />
            </section>
            <section className="space-y-2">
              <h2 className="text-lg font-medium leading-6 text-gray-900">
                New Transaction
              </h2>
              <div className="overflow-hidden rounded-lg bg-white shadow">
                <div className="px-4 py-5 sm:p-6">
                  <CreateAccountForm />
                </div>
              </div>
            </section>
            <section className="space-y-2">
              <h2 className="text-lg font-medium leading-6 text-gray-900">
                History
              </h2>
              <AccountList accounts={data.accounts} />
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
