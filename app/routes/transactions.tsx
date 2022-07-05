import { Navbar } from "~/components/navbar";

export default function TransactionsPage() {
  return (
    <div className="min-h-full">
      <Navbar />
      <div className="py-10">
        <main>
          <div className="mx-auto max-w-3xl space-y-8 px-4 sm:px-6">
            <h1>Transactions</h1>
          </div>
        </main>
      </div>
    </div>
  );
}
