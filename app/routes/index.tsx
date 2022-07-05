import { Form, Link } from "@remix-run/react";

import { useOptionalUser } from "~/utils";

export default function IndexPage() {
  const user = useOptionalUser();

  return (
    <main className="relative min-h-screen bg-white sm:flex sm:items-center sm:justify-center">
      <div className="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0">
        {user ? (
          <Form action="/logout" method="post">
            <button
              type="submit"
              className="flex items-center justify-center rounded-md bg-gray-500 px-4 py-3 font-medium text-white hover:bg-gray-600"
            >
              Logout
            </button>
          </Form>
        ) : (
          <>
            <Link
              to="/join"
              className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-yellow-700 shadow-sm hover:bg-yellow-50 sm:px-8"
            >
              Sign up
            </Link>
            <Link
              to="/login"
              className="flex items-center justify-center rounded-md bg-yellow-500 px-4 py-3 font-medium text-white hover:bg-yellow-600"
            >
              Log In
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
