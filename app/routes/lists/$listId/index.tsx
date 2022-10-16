import type { LoaderFunction } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { notFound } from "~/util/http.server";
import type { ShoppingListWithItems } from "~/util/shoppingList.server";
import { getShoppingList } from "~/util/shoppingList.server";

type LoaderData = {
  list: ShoppingListWithItems;
};

export const loader: LoaderFunction = async ({
  params,
}): Promise<LoaderData> => {
  const { listId } = params;

  if (!listId) throw notFound();

  const list = await getShoppingList(listId);

  if (!list) throw notFound();

  return { list };
};

export default function List() {
  const { list } = useLoaderData<LoaderData>();

  const createItemFetcher = useFetcher();

  return (
    <div className="h-full bg-stone-300">
      <p>List</p>

      <ul>
        {list.items.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>

      <div className="fixed bottom-0 left-0 right-0 bg-slate-100">
        <createItemFetcher.Form action="./items" method="post" className="flex">
          <input
            type="text"
            name="name"
            placeholder="New item"
            required
            className="p-4 flex-grow"
          />

          <input
            type="submit"
            value="Add"
            className="bg-stone-400 p-4 cursor-pointer"
          />
        </createItemFetcher.Form>
      </div>
    </div>
  );
}
