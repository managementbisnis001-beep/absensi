import { db } from "../src/lib/db";
import bcrypt from "bcryptjs";

async function main() {
  // Check if admin already exists
  const existingAdmin = await db.user.findUnique({
    where: { username: "admin" },
  });

  if (existingAdmin) {
    console.log("Admin user already exists");
    return;
  }

  // Create default admin user
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = await db.user.create({
    data: {
      username: "admin",
      password: hashedPassword,
      name: "Administrator",
      email: "admin@example.com",
      role: "admin",
    },
  });

  console.log("Created admin user:", admin.username);
  console.log("Password: admin123");
  console.log("Please change the password after first login!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
