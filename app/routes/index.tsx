import type { ShoppingList } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { requireUserId } from "~/util/auth.server";
import { getShoppingListsByUserId } from "~/util/shoppingList.server";

type LoaderData = {
  userId: string;
  shoppingLists: ShoppingList[];
};

export const loader: LoaderFunction = async ({
  request,
}): Promise<LoaderData> => {
  const userId = await requireUserId(request);

  const shoppingLists = await getShoppingListsByUserId(userId);

  return { userId, shoppingLists };
};

export default function Index() {
  const { shoppingLists } = useLoaderData<LoaderData>();

  return (
    <div className="h-full bg-stone-300 p-4 flex">
      <div className="flex flex-1 w-full">
        <div className="border border-gray-600 h-fit p-2 rounded-md">
          <h1 className="font-bold">Your lists</h1>
          <ul className="list-disc pl-4">
            {shoppingLists.map((shoppingList) => (
              <li
                key={shoppingList.id}
                className="hover:bg-stone-600 hover:bg-opacity-25 rounded-md p-2 duration-300 cursor-pointer"
              >
                <Link
                  to={`/lists/${shoppingList.id}`}
                  className="text-grey-600"
                >
                  {shoppingList.name}
                </Link>
              </li>
            ))}
            <li className="hover:bg-stone-600 hover:bg-opacity-25 rounded-md p-2">
              <Link to="/lists/new" className="text-grey-600">
                Create new list
              </Link>
            </li>
          </ul>
        </div>
        <div className="flex flex-1 justify-end">
          <button className=" flex h-max w-max hover:bg-stone-600 hover:bg-opacity-25 duration-300 p-2 rounded-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
              />
            </svg>
            <Link to="/logout">Logout</Link>
          </button>
        </div>
      </div>
    </div>
  );
}
