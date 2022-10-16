import { prisma } from "./prisma.server";

export const createListItem = async (listId: string, item: string) => {
  return await prisma.item.create({
    data: {
      shoppingListId: listId,
      name: item,
    },
  });
};
