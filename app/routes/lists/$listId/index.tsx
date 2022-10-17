import type { Item } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { ListItem } from "~/components/ListItem";
import { canAccessList } from "~/util/auth.server";
import { notFound } from "~/util/http.server";
import type { ShoppingListWithItems } from "~/util/shoppingList.server";
import { getShoppingList } from "~/util/shoppingList.server";

type LoaderData = {
  list: ShoppingListWithItems;
};

export const loader: LoaderFunction = async ({
  params,
  request,
}): Promise<LoaderData> => {
  const { listId } = params;

  if (!listId) throw notFound();

  const list = await getShoppingList(listId);

  if (!list) throw notFound();

  await canAccessList(request, list);

  return { list };
};

export default function List() {
  const { list } = useLoaderData<LoaderData>();

  const createItemFetcher = useFetcher();

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!inputRef.current) return;

    if (createItemFetcher.state === "idle") {
      inputRef.current.value = "";
    }
  }, [createItemFetcher.state]);

  return (
    <div className="h-full bg-stone-300 p-6">
      <ul className="space-y-3">
        {list.items.map((item) => (
          <ListItem key={item.id} item={item as Item} />
        ))}
      </ul>

      <div className="fixed bottom-0 left-0 right-0 bg-slate-100">
        <createItemFetcher.Form action="./items" method="post" className="flex">
          <input
            ref={inputRef}
            disabled={createItemFetcher.state === "submitting"}
            type="text"
            name="name"
            placeholder="New item"
            required
            className="p-4 flex-grow disabled: opacity-50"
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
