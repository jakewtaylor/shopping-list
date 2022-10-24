import type { Item, ShoppingList } from "@prisma/client";
import { authApi } from "./api.server";
import { requireAuthToken } from "./auth2.server";
import { prisma } from "./prisma.server";

export const getShoppingLists = async (request: Request) => {
  const token = await requireAuthToken(request);

  const res = await authApi(token).get("/shopping-lists");

  return res.data;
};

export const createShoppingList = async (request: Request, name: string) => {
  const token = await requireAuthToken(request);

  try {
    const res = await authApi(token).post("/shopping-lists", {
      name,
    });

    return res.data;
  } catch (err) {
    console.log(err);

    throw err;
  }
};

export const getShoppingList = async (request: Request, listId: string) => {
  const token = await requireAuthToken(request);

  try {
    const res = await authApi(token).get(`/shopping-lists/${listId}`);

    return res.data;
  } catch (err) {
    console.log(err);

    throw err;
  }
};

export const addUserToShoppingList = async (listId: string, userId: string) => {
  return await prisma.shoppingList.update({
    where: { id: listId },
    data: {
      users: {
        connect: { id: userId },
      },
    },
  });
};

export type ShoppingListWithItems = ShoppingList & { items: Item[] };
export type ShoppingListWithItemCount = ShoppingList & {
  _count: { items: number };
};
