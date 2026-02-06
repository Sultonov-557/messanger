import { eq } from "drizzle-orm";

import { hashPassword } from "@/lib/auth";

import { db } from "./index";
import { users } from "./schema";

// Default admin credentials - CHANGE THESE IN PRODUCTION!
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin";

async function seed() {
  console.log("Seeding database...");

  const existingSupervisor = await db.query.users.findFirst({
    where: eq(users.role, "admin"),
  });

  if (existingSupervisor) {
    console.log("Supervisor already exists, skipping seed");
    return;
  }

  const passwordHash = await hashPassword(ADMIN_PASSWORD);

  await db.insert(users).values({
    username: ADMIN_USERNAME,
    password: passwordHash,
    role: "admin",
    isActive: true,
  });

  console.log("Admin user created successfully!");
  console.log(`username: ${ADMIN_USERNAME}`);
  console.log(`Password: ${ADMIN_PASSWORD}`);
  console.log("\nIMPORTANT: Change the default password after first login!");
}

seed()
  .then(() => {
    console.log("Seed completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  });
