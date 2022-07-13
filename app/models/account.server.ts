import type { Account, User } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Account } from "@prisma/client";

export function getAccount({
  id,
  userId,
}: Pick<Account, "id"> & {
  userId: User["id"];
}) {
  return prisma.account.findFirst({
    where: { id, userId },
  });
}

export function getAccountListItems({ userId }: { userId: User["id"] }) {
  return prisma.account.findMany({
    where: { userId },
  });
}

export function createAccount({
  type,
  amount,
  category,
  date,
  userId,
}: Pick<Account, "type" | "amount" | "category" | "date"> & {
  userId: User["id"];
}) {
  return prisma.account.create({
    data: {
      type,
      amount,
      category,
      date,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export function updateAccount({
  id,
  type,
  amount,
  category,
  date,
  userId,
}: Pick<Account, "id" | "type" | "amount" | "category" | "date"> & {
  userId: User["id"];
}) {
  return prisma.account.updateMany({
    where: { id, userId },
    data: {
      type,
      amount,
      category,
      date,
    },
  });
}

export function deleteAccount({
  id,
  userId,
}: Pick<Account, "id"> & { userId: User["id"] }) {
  return prisma.account.deleteMany({
    where: { id, userId },
  });
}
