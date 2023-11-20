import { Prisma } from '@prisma/client';

// const userWithMatches = Prisma.validator<Prisma.UserDefaultArgs>()({
//   include: { matches: true },
// });

const userWithoutHash = Prisma.validator<Prisma.UserDefaultArgs>()({
  select: { hash: false },
});

// export type UserWithMatches = Prisma.UserGetPayload<typeof userWithMatches>;
export type UserWithoutHash = Prisma.UserGetPayload<typeof userWithoutHash>;
