import type { Item } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { FixedBottom } from "~/components/FixedBottom";
import { ListItem } from "~/components/ListItem";
import { MenuBar } from "~/components/MenuBar";
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

        <li>
          <createItemFetcher.Form action="./items" method="post">
            <input
              ref={inputRef}
              disabled={createItemFetcher.state === "submitting"}
              type="text"
              name="name"
              placeholder="add to list"
              required
              autoComplete="off"
              autoFocus
              className="w-full text-2xl font-serif bg-transparent rounded-lg focus:outline-none"
            />

            {/* <button
              type="submit"
              className="p-4 bg-green-700 hover:bg-green-800 text-green-400 cursor-pointer"
            >
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
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            </button> */}
          </createItemFetcher.Form>
        </li>
      </ul>

      <FixedBottom>
        <MenuBar />
      </FixedBottom>
    </div>
  );
}
