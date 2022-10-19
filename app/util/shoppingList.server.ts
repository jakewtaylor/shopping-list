import type { Item, ShoppingList } from "@prisma/client";
import { prisma } from "./prisma.server";

export const getShoppingListsByUserId = async (userId: string) => {
  const user = await prisma.user.findFirst({
    where: { id: userId },
    include: {
      shoppingLists: {
        include: {
          _count: {
            select: {
              items: true,
            },
          },
        },
      },
    },
  });

  return user?.shoppingLists ?? [];
};

export const createShoppingList = async (userId: string, name: string) => {
  const shoppingList = await prisma.shoppingList.create({
    data: {
      name,
      userIds: [userId],
    },
  });

  await prisma.user.update({
    where: { id: userId },
    data: {
      shoppingLists: {
        connect: { id: shoppingList.id },
      },
    },
  });

  return shoppingList;
};

export const getShoppingList = async (listId: string) => {
  return await prisma.shoppingList.findUnique({
    where: { id: listId },
    include: {
      // items: {
      //   where: {
      //     OR: [{ removed: null }, { removed: { gte: subDays(new Date(), 3) } }],
      //   },
      // },
      items: true,
    },
  });
};

export type ShoppingListWithItems = ShoppingList & { items: Item[] };
export type ShoppingListWithItemCount = ShoppingList & {
  _count: { items: number };
};
