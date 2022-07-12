import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { CreateTransactionForm } from "~/components/create-transaction-form";
import { Navbar } from "~/components/navbar";
import { TransactionList } from "~/components/transaction-list";
import { TransactionStats } from "~/components/transaction-stats";
import {
  createTransaction,
  deleteTransaction,
  getTransaction,
  getTransactionListItems,
  updateTransaction,
} from "~/models/transaction.model";
import { requireUserId } from "~/session.server";

interface LoaderData {
  transactions: Awaited<ReturnType<typeof getTransactionListItems>>;
}

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const transactions = await getTransactionListItems({ userId });

  return json<LoaderData>({ transactions });
};

type ActionData = {
  errors: {
    type?: string;
    amount?: string;
    category?: string;
    dateTime?: string;
  };
};

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "createTransaction" || intent === "editTransaction") {
    const type = formData.get("type");
    const amount = formData.get("amount");
    const category = formData.get("category");
    const dateTime = formData.get("dateTime");

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

    if (typeof dateTime !== "string" || isNaN(Date.parse(dateTime))) {
      return json<ActionData>(
        { errors: { dateTime: "Invalid date." } },
        { status: 400 }
      );
    }

    if (intent === "createTransaction") {
      await createTransaction({
        type,
        amount: type === "expense" ? -parseFloat(amount) : parseFloat(amount),
        category,
        dateTime: new Date(dateTime),
        userId,
      });

      return new Response(null);
    } else if (intent === "editTransaction") {
      const transactionId = String(formData.get("transactionId"));

      // make sure the transaction belongs to the user
      const transaction = await getTransaction({ id: transactionId, userId });
      if (!transaction) {
        throw json({ error: "Transaction not found" }, { status: 404 });
      }

      await updateTransaction({
        id: transactionId,
        type,
        amount: type === "expense" ? -parseFloat(amount) : parseFloat(amount),
        category,
        dateTime: new Date(dateTime),
        userId,
      });

      return new Response(null);
    }
  } else if (intent === "deleteTransaction") {
    const transactionId = String(formData.get("transactionId"));

    // make sure the transaction belongs to the user
    const transaction = await getTransaction({ id: transactionId, userId });
    if (!transaction) {
      throw json({ error: "Transaction not found" }, { status: 404 });
    }

    await deleteTransaction({ id: transactionId, userId });

    return new Response(null);
  }

  throw json({ message: `Unknown intent: ${intent}` }, { status: 400 });
};

export const meta: MetaFunction = () => {
  return {
    title: "Transactions - billflow",
  };
};

export default function TransactionsPage() {
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
              <TransactionStats transactions={data.transactions} />
            </section>
            <section className="space-y-2">
              <h2 className="text-lg font-medium leading-6 text-gray-900">
                New Transaction
              </h2>
              <div className="overflow-hidden rounded-lg bg-white shadow">
                <div className="px-4 py-5 sm:p-6">
                  <CreateTransactionForm />
                </div>
              </div>
            </section>
            <section className="space-y-2">
              <h2 className="text-lg font-medium leading-6 text-gray-900">
                History
              </h2>
              <TransactionList transactions={data.transactions} />
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
