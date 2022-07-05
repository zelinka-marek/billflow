import type { Transaction, User } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Transaction } from "@prisma/client";

export function getTransaction({
  id,
  userId,
}: Pick<Transaction, "id"> & {
  userId: User["id"];
}) {
  return prisma.transaction.findFirst({
    where: { id, userId },
  });
}

export function getTransactionListItems({ userId }: { userId: User["id"] }) {
  return prisma.transaction.findMany({
    where: { userId },
  });
}

export function createTransaction({
  type,
  amount,
  category,
  dateTime,
  userId,
}: Pick<Transaction, "type" | "amount" | "category" | "dateTime"> & {
  userId: User["id"];
}) {
  return prisma.transaction.create({
    data: {
      type,
      amount,
      category,
      dateTime,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export function updateTransaction({
  id,
  type,
  amount,
  category,
  dateTime,
  userId,
}: Pick<Transaction, "id" | "type" | "amount" | "category" | "dateTime"> & {
  userId: User["id"];
}) {
  return prisma.transaction.updateMany({
    where: { id, userId },
    data: {
      type,
      amount,
      category,
      dateTime,
    },
  });
}

export function deleteTransaction({
  id,
  userId,
}: Pick<Transaction, "id"> & { userId: User["id"] }) {
  return prisma.transaction.deleteMany({
    where: { id, userId },
  });
}
