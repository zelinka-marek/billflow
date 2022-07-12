import type { LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Link } from "@remix-run/react";

import { getUserId } from "~/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);
  if (userId) {
    return redirect("/transactions");
  }

  return json({});
};

export default function IndexPage() {
  return (
    <main className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Keep track of your</span>
            <span className="block text-brand-600">expenses and income</span>
          </h1>
          <p className="mx-auto mt-3 max-w-md text-base text-gray-500 sm:text-lg md:mt-5 md:max-w-3xl md:text-xl">
            The best way to keep a clear view of your financial situation.
            Perfect for keeping a record of your salary, fixed investment, stock
            or business.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:justify-center">
            <Link
              to="/join"
              className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-gray-100"
            >
              Sign up
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-gray-100"
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
