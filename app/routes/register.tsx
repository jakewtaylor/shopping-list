import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import { Link } from "react-router-dom";
import { Card } from "~/components/Card";
import { register, requireGuest } from "~/util/auth.server";

type ActionData = any;

export const action: ActionFunction = async ({
  request,
}): Promise<ActionData> => {
  const form = await request.formData();
  const email = form.get("email");
  const password = form.get("password");

  if (typeof email !== "string" || typeof password !== "string") {
    throw new Error("Invalid");
  }

  return register({ email, password });
};

export const loader: LoaderFunction = async ({ request }) => {
  await requireGuest(request);

  return null;
};

export default function Register() {
  const data = useActionData<ActionData>();

  console.log(data);

  return (
    <div className="h-full bg-stone-300">
      <div className="w-11/12 max-w-xl mx-auto pt-2">
        <h1 className="text-4xl font-bold text-stone-900 mb-4">Register</h1>

        <Card>
          <form
            method="POST"
            action="/register"
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
              value="Register"
              className="bg-stone-300 rounded-sm border-2 border-stone-300 p-2 cursor-pointer"
            />

            <p className="text-center">
              Or{" "}
              <Link to="/login" className="text-blue-600">
                login
              </Link>
              .
            </p>

            {data?.error ? <p className="text-red-600">{data.error}</p> : null}
          </form>
        </Card>
      </div>
    </div>
  );
}
