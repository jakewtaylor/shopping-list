import { notFound } from "./http.server";
import { prisma } from "./prisma.server";

export const createListItem = async (listId: string, item: string) => {
  return await prisma.item.create({
    data: {
      shoppingListId: listId,
      name: item,
    },
  });
};

export const toggleListItem = async (itemId: string) => {
  const item = await prisma.item.findUnique({ where: { id: itemId } });

  if (!item) throw notFound();

  return await prisma.item.update({
    where: { id: itemId },
    data: {
      removed: item.removed ? null : new Date(),
    },
  });
};
