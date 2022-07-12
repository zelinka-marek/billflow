import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  Link,
  useActionData,
  useSearchParams,
  useTransition,
} from "@remix-run/react";
import * as React from "react";

import { verifyLogin } from "~/models/user.server";
import { createUserSession, getUserId } from "~/session.server";
import { safeRedirect, validateEmail } from "~/utils";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);
  if (userId) {
    return redirect("/transactions");
  }

  return json({});
};

interface ActionData {
  errors?: {
    email?: string;
    password?: string;
  };
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/transactions");
  const remember = formData.get("remember");

  if (!validateEmail(email)) {
    return json<ActionData>(
      { errors: { email: "Email is invalid" } },
      { status: 400 }
    );
  }

  if (typeof password !== "string" || password.length === 0) {
    return json<ActionData>(
      { errors: { password: "Password is required" } },
      { status: 400 }
    );
  } else if (password.length < 8) {
    return json<ActionData>(
      { errors: { password: "Password is too short" } },
      { status: 400 }
    );
  }

  const user = await verifyLogin(email, password);
  if (!user) {
    return json<ActionData>(
      { errors: { email: "Invalid email or password" } },
      { status: 400 }
    );
  }

  return createUserSession({
    request,
    userId: user.id,
    remember: remember === "on" ? true : false,
    redirectTo,
  });
};

export const meta: MetaFunction = () => {
  return {
    title: "Login - billflow",
  };
};

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? undefined;

  const actionData = useActionData<ActionData>();

  const transition = useTransition();
  const isPending = Boolean(transition.submission);

  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    }
  }, [actionData]);

  return (
    <main className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <Form method="post">
          <input type="hidden" name="redirectTo" value={redirectTo} />
          <div className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  ref={emailRef}
                  id="email"
                  autoFocus={true}
                  name="email"
                  type="email"
                  autoComplete="email"
                  aria-invalid={actionData?.errors?.email ? true : undefined}
                  aria-describedby="email-error"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
                />
              </div>
              {actionData?.errors?.email ? (
                <p className="mt-2 text-sm text-red-600" id="email-error">
                  {actionData.errors.email}
                </p>
              ) : null}
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  ref={passwordRef}
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  aria-invalid={actionData?.errors?.password ? true : undefined}
                  aria-describedby="password-error"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
                />
              </div>
              {actionData?.errors?.password ? (
                <p className="mt-2 text-sm text-red-600" id="password-error">
                  {actionData.errors.password}
                </p>
              ) : null}
            </div>
            <div>
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-md border border-transparent bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-gray-100 hover:enabled:bg-brand-700 disabled:opacity-75"
                disabled={isPending}
              >
                {isPending ? "Logging in..." : "Log in"}
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                />
                <label
                  htmlFor="remember"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Remember me
                </label>
              </div>
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link
                  className="font-medium text-brand-600 hover:text-brand-500"
                  to={{
                    pathname: "/join",
                    search: searchParams.toString(),
                  }}
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </Form>
      </div>
    </main>
  );
}
