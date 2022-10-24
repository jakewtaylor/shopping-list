import type { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { MenuBar } from "~/components/MenuBar";
import { requireUser } from "~/util/auth2.server";
import { getShoppingLists } from "~/util/shoppingList.server";

type LoaderData = {
  userId: number;
  shoppingLists: any;
};

export const loader: LoaderFunction = async ({
  request,
}): Promise<LoaderData> => {
  const user = await requireUser(request);

  const shoppingLists = await getShoppingLists(request);

  return { userId: user.id, shoppingLists };
};

export default function Index() {
  const { shoppingLists } = useLoaderData<LoaderData>();

  console.log(shoppingLists);

  return (
    <>
      <MenuBar />

      <div className="h-full p-4">
        <h1 className="font-bold text-3xl block mb-3">Your lists</h1>
        <ul className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {shoppingLists.map((shoppingList: any) => (
            <li key={shoppingList.id}>
              <Link
                to={`/lists/${shoppingList.id}`}
                className="flex justify-between w-full h-full p-2 bg-white hover:bg-stone-50 transition rounded shadow"
              >
                <p className="font-bold text-lg text-stone-700">
                  {shoppingList.name}
                </p>
                <p className="font-sans text-xs bg-stone-700 px-3 py-1 leading-none rounded-full text-stone-100 flex items-center justify-center">
                  {shoppingList.items_count} item
                  {shoppingList.items_count == 1 ? "" : "s"}
                </p>
              </Link>
            </li>
          ))}
          <li>
            <Link
              to="/lists/new"
              className="block w-full h-full bg-white hover:bg-stone-50 transition bg-opacity-75 rounded shadow p-2"
            >
              <p className="text-stone-700 font-bold text-lg text-center">
                Create new list
              </p>
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
}
