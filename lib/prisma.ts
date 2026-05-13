import { PrismaPg } from "@prisma/adapter-pg";
import { withAccelerate } from "@prisma/extension-accelerate";
import { PrismaClient } from "@/app/generated/prisma/client";

function createPrismaClient() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }

  if (url.startsWith("prisma+postgres://")) {
    return new PrismaClient({
      accelerateUrl: url,
    }).$extends(withAccelerate());
  }

  const adapter = new PrismaPg({ connectionString: url });
  return new PrismaClient({ adapter });
}

type PrismaResolved = InstanceType<typeof PrismaClient>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaResolved | undefined;
};

/** Single runtime client; cast unifies Accelerate-extended vs adapter-only typings for consumers. */
export const prisma: PrismaResolved = (globalForPrisma.prisma ??
  createPrismaClient()) as PrismaResolved;

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
