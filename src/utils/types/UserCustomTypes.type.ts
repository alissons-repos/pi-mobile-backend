import { Prisma } from '@prisma/client';

// const userWithNotifications = Prisma.validator<Prisma.UserDefaultArgs>()({
//   include: { notifications: true },
// });

const userWithoutHash = Prisma.validator<Prisma.UserDefaultArgs>()({
  select: { hash: false },
});

// export type UserWithNotifications = Prisma.UserGetPayload<typeof userWithNotifications>;
export type UserWithoutHash = Prisma.UserGetPayload<typeof userWithoutHash>;
