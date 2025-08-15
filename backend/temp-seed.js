const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function seed() {
  const prisma = new PrismaClient();
  
  try {
    const hashedPassword = await bcrypt.hash('password123', 10);
    console.log('Creating user with hash:', hashedPassword);
    
    const user = await prisma.user.create({
      data: {
        email: 'admin@wms.com',
        fullName: 'Admin User',
        passwordHash: hashedPassword,
        role: 'admin'
      }
    });
    
    console.log('User created:', user);
  } catch (error) {
    console.error('Error creating user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed().catch(console.error);