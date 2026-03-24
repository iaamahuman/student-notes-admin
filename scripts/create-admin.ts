import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@studentnotebooks.com';
  const password = 'password123';
  const name = 'Admin';

  console.log(`Creating admin user: ${email}`);

  const existingUser = await prisma.adminUser.findUnique({
    where: { email },
  });

  if (existingUser) {
    console.log('Admin user already exists.');
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.adminUser.create({
    data: {
      email,
      name,
      password: hashedPassword,
    },
  });

  console.log(`Admin user created with ID: ${admin.id}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
