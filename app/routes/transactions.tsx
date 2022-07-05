import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { Navbar } from "~/components/navbar";
import { TransactionList } from "~/components/transaction-list";
import { TransactionOverview } from "~/components/transaction-overview";
import { getTransactionListItems } from "~/models/transaction.model";
import { requireUserId } from "~/session.server";

interface LoaderData {
  transactions: Awaited<ReturnType<typeof getTransactionListItems>>;
}

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const transactions = await getTransactionListItems({ userId });

  return json<LoaderData>({ transactions });
};

export const meta: MetaFunction = () => {
  return {
    title: "Transactions - billflow",
  };
};

export default function TransactionsPage() {
  const data = useLoaderData<LoaderData>();

  return (
    <div className="min-h-full">
      <Navbar />
      <div className="py-10">
        <main>
          <div className="mx-auto max-w-3xl space-y-8 px-4 sm:px-6">
            <section className="space-y-2">
              <h2 className="text-lg font-medium leading-6 text-gray-900">
                Overview
              </h2>
              <TransactionOverview transactions={data.transactions} />
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
