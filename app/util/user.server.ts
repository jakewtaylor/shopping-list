import { prisma } from "./prisma.server";
import bcrypt from "bcrypt";

export const createUser = async (email: string, password: string) => {
  return prisma.user.create({
    data: {
      email,
      password: await bcrypt.hash(password, 10),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
};
