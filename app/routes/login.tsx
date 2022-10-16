import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { Card } from "~/components/Card";
import { login, requireGuest } from "~/util/auth.server";

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const email = form.get("email");
  const password = form.get("password");

  if (typeof email !== "string" || typeof password !== "string") {
    throw new Error("Invalid");
  }

  return login({ email, password });
};

export const loader: LoaderFunction = async ({ request }) => {
  await requireGuest(request);

  return null;
};

export default function Login() {
  return (
    <div className="h-full bg-stone-300">
      <div className="w-11/12 max-w-xl mx-auto pt-2">
        <h1 className="text-4xl font-bold text-stone-900 mb-4">Login</h1>

        <Card>
          <form
            method="POST"
            action="/login"
            className="flex flex-col space-y-2"
          >
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="bg-stone-100 rounded-sm border-2 border-stone-300 p-2"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="bg-stone-100 rounded-sm border-2 border-stone-300 p-2"
              required
            />

            <input
              type="submit"
              value="Login"
              className="bg-stone-300 rounded-sm border-2 border-stone-300 p-2 cursor-pointer"
            />

            <p className="text-center">
              Or{" "}
              <Link to="/register" className="text-blue-500">
                register
              </Link>
              .
            </p>
          </form>
        </Card>
      </div>
    </div>
  );
}
