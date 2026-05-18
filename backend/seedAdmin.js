require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const bcrypt = require('bcrypt');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = 'admin@test.com';
  const password = 'Admin@1234!';
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingAdmin = await prisma.user.findUnique({ where: { email } });

  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        name: 'Super System Administrator',
        email,
        password: hashedPassword,
        address: 'Admin HQ',
        role: 'ADMIN',
      },
    });
    console.log('Admin user created successfully:');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
  } else {
    console.log('Admin user already exists.');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
