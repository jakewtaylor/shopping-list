import { prisma } from "../app/util/prisma.server";

const email = process.env.DEFAULT_USER_EMAIL;

if (!email) {
  throw new Error("You need to set an email in .env");
}

const seed = async () => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) throw new Error("Couldn't find a user");

  await prisma.shoppingList.create({
    data: {
      userIds: [user.id],
      name: "Seeded List",
      items: {
        createMany: {
          data: Array(10)
            .fill(0)
            .map((_, i) => ({
              name: `Item ${i + 1}`,
              removed: i % 3 == 0 ? new Date() : null,
            })),
        },
      },
    },
  });
};

seed()
  .then(() => {
    console.log("Done");
  })
  .catch((err) => {
    console.error(err);
  });
