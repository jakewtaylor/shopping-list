import type { ShoppingList } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { prisma } from "~/util/prisma.server";

type LoaderData = {
  shoppingLists: ShoppingList[];
};

export const loader: LoaderFunction = async (): Promise<LoaderData> => {
  const user = await prisma.user.findFirst({
    where: { email: process.env.DEFAULT_USER_EMAIL! },
    include: {
      shoppingLists: true,
    },
  });

  const shoppingLists = user?.shoppingLists ?? [];

  return { shoppingLists };
};

export default function Index() {
  const { shoppingLists } = useLoaderData<LoaderData>();

  return (
    <ul>
      {shoppingLists.map((shoppingList) => (
        <li key={shoppingList.id}>{shoppingList.name}</li>
      ))}
    </ul>
  );
}
