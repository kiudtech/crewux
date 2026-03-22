import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.user.findUnique({
    where: { email: "admin@crewux.com" }
  });

  if (!existing) {
    const hashedPassword = await hash("Admin@123", 12);
    
    await prisma.user.create({
      data: {
        email: "admin@crewux.com",
        password: hashedPassword,
        role: "SUPER_ADMIN",
        emailVerified: true
      }
    });
    
    console.log("✅ Admin created!");
    console.log("Email: admin@crewux.com");
    console.log("Password: Admin@123");
  } else {
    console.log("Admin already exists!");
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());