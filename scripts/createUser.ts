import { prisma } from "../app/util/prisma.server";
import bcrypt from "bcrypt";

const email = process.env.DEFAULT_USER_EMAIL;
const password = process.env.DEFAULT_USER_PASS;

if (!email || !password) {
  throw new Error("You need to set an email/pass in .env");
}

const create = async () => {
  const user = await prisma.user.create({
    data: {
      email,
      password: await bcrypt.hash(password, 10),
      createdAt: new Date(),
      updatedAt: new Date(),
      shoppingLists: {
        create: [
          {
            name: "My List",
          },
        ],
      },
    },
  });

  return user;
};

create().then((user) => {
  console.log(user);
});
