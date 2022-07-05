import { LogoutIcon } from "@heroicons/react/outline";
import { Form } from "@remix-run/react";

import { useUser } from "~/utils";

export function Navbar() {
  useUser();

  return (
    <nav className="bg-white shadow-sm">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-800">billflow</h1>
            </div>
          </div>
          <div className="ml-6 flex items-center">
            <Form action="/logout" method="post">
              <button
                type="submit"
                className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
              >
                <span className="sr-only">Sign out</span>
                <LogoutIcon className="h-6 w-6" />
              </button>
            </Form>
          </div>
        </div>
      </div>
    </nav>
  );
}
