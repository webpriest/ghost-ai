import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

function resolveDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url || url.trim() === "") {
    throw new Error("DATABASE_URL is not set.");
  }
  return url.trim();
}

function createPrismaClient(): PrismaClient {
  const url = resolveDatabaseUrl();

  const useAccelerate =
    url.startsWith("prisma+postgres://") || url.startsWith("prisma://");

  if (useAccelerate) {
    return new PrismaClient({ accelerateUrl: url });
  }

  const adapter = new PrismaPg({ connectionString: url });
  return new PrismaClient({ adapter });
}

export const prisma =
  globalForPrisma.prisma ??
  ((() => createPrismaClient())() as PrismaClient);

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
