import { prisma } from "./prisma.server";

export const getShoppingListsByUserId = async (userId: string) => {
  const user = await prisma.user.findFirst({
    where: { id: userId },
    include: {
      shoppingLists: true,
    },
  });

  return user?.shoppingLists ?? [];
};
