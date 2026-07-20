/* import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const adapter= new PrismaPg({connectionString:process.env.DATABASE_URL})
const prisma = new PrismaClient({adapter});

async function main() {
  await prisma.role.createMany({
    data: [
      { rolename: "CUSTOMER" },
      { rolename: "OWNER" },
      { rolename: "ADMIN" },
    ],
    skipDuplicates: true,
  });

  console.log("Roles seeded successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); */
import { PrismaClient } from "../generated/prisma/client";

export async function seedRoles(prisma: PrismaClient) {
  await prisma.role.createMany({
    data: [
      { rolename: "CUSTOMER" },
      { rolename: "OWNER" },
      { rolename: "ADMIN" },
    ],
    skipDuplicates: true,
  });
}

/* What if one table depends on another?
You can't use createMany to create related records in one call. Instead, seed them in order:
await seedRoles(prisma);
await seedUsers(prisma);
await seedUserRoles(prisma);
This ensures the roles and users exist before creating the entries in the UserRole table. */