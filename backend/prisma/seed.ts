import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Tạo admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      passwordHash: adminPassword,
      fullName: 'System Administrator',
      role: 'admin',
      isActive: true,
    },
  });

  console.log('Admin user created:', admin);

  // Tạo manager user
  const managerPassword = await bcrypt.hash('manager123', 10);
  
  const manager = await prisma.user.upsert({
    where: { email: 'manager@example.com' },
    update: {},
    create: {
      email: 'manager@example.com',
      passwordHash: managerPassword,
      fullName: 'System Manager',
      role: 'manager',
      isActive: true,
    },
  });

  console.log('Manager user created:', manager);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });