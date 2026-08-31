import prisma from "../src/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  const email = "super@admin.ekpratishat.com";
  const rawPassword = "valuator@212";
  const name = "Valuation Administrator";

  console.log("🌱 Seeding database...");

  const hashedPassword = await bcrypt.hash(rawPassword, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      name,
      password: hashedPassword,
    },
    create: {
      email,
      name,
      password: hashedPassword,
    },
  });

  console.log("✅ Seeded user successfully:");
  console.log(`   ID: ${user.id}`);
  console.log(`   Email: ${user.email}`);
  console.log(`   Name: ${user.name}`);
  console.log(`   Password: ${rawPassword} (hashed with bcrypt)`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seeding failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
