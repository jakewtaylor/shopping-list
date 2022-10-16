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

  return (
    <div className="flex flex-col h-full justify-center bg-[#3d405b]">
      <div className="w-11/12 max-w-xl mx-auto pt-2">
        <h1 className="text-3xl font-bold text-[#f4f1de] mb-4">Register</h1>

        <Card>
          <form
            method="POST"
            action="/register"
            className="flex flex-col space-y-4"
          >
            <div className="flex flex-row w-full shadow-sm">
              <div className="flex flex-col align-center justify-center bg-[#cad2c5] rounded-l-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5 mx-3"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="bg-[#fdfcf4] rounded-r-sm p-2 w-full"
                required
              />
            </div>
            <div className="flex flex-row w-full shadow-sm">
              <div className="flex flex-col align-center justify-center bg-[#cad2c5] rounded-l-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5 mx-3"
                >
                  <path
                    fillRule="evenodd"
                    d="M15.75 1.5a6.75 6.75 0 00-6.651 7.906c.067.39-.032.717-.221.906l-6.5 6.499a3 3 0 00-.878 2.121v2.818c0 .414.336.75.75.75H6a.75.75 0 00.75-.75v-1.5h1.5A.75.75 0 009 19.5V18h1.5a.75.75 0 00.53-.22l2.658-2.658c.19-.189.517-.288.906-.22A6.75 6.75 0 1015.75 1.5zm0 3a.75.75 0 000 1.5A2.25 2.25 0 0118 8.25a.75.75 0 001.5 0 3.75 3.75 0 00-3.75-3.75z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="bg-[#fdfcf4] rounded-r-sm p-2 w-full"
                required
              />
            </div>
            <input
              type="submit"
              value="Register"
              className="bg-[#4c956c] rounded-md p-2 cursor-pointer hover:bg-[#3c7957] font-bold text-[#f4f1de]"
            />

            <Link
              to="/login"
              className="bg-[#4c956c] rounded-md p-2 cursor-pointer hover:bg-[#3c7957] text-center font-bold text-[#f4f1de]"
            >
              Login
            </Link>

            {data?.error ? <p className="text-red-600">{data.error}</p> : null}
          </form>
        </Card>
      </div>
    </div>
  );
}
