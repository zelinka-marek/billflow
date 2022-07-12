import { LogoutIcon } from "@heroicons/react/outline";
import { Form } from "@remix-run/react";

import { useOptionalUser } from "~/utils";

export function Navbar() {
  const user = useOptionalUser();

  return (
    <nav className="bg-white shadow-sm">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-xl font-bold tracking-tight text-gray-800">
                billflow
              </span>
            </div>
          </div>
          {user ? (
            <div className="ml-6 flex items-center">
              <Form action="/logout" method="post">
                <button
                  type="submit"
                  className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
                >
                  <span className="sr-only">Sign out</span>
                  <LogoutIcon className="h-6 w-6" />
                </button>
              </Form>
            </div>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
