import type { ShoppingList } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { FixedBottom } from "~/components/FixedBottom";
import { MenuBar } from "~/components/MenuBar";
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
              <li key={shoppingList.id}>
                <Link
                  to={`/lists/${shoppingList.id}`}
                  className="block w-full text-grey-600 hover:bg-stone-600 hover:bg-opacity-25 rounded-md p-2 duration-300"
                >
                  {shoppingList.name}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/lists/new"
                className="block w-full hover:bg-stone-600 hover:bg-opacity-25 rounded-md p-2 text-grey-600"
              >
                Create new list
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <FixedBottom>
        <MenuBar />
      </FixedBottom>
    </div>
  );
}
