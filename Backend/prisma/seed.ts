import { PrismaClient, TaskStatus } from '@prisma/client';
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from 'bcrypt';
import { config } from "dotenv";

config();
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set. Check Backend/.env");
}
const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({adapter});

async function main() {
  console.log('🌱 Starting database seed...');

  // Create test user
  const hashedPassword = await bcrypt.hash('Test123!', 10);

  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      password: hashedPassword,
      name: 'Test User',
    },
  });

  console.log('✅ Created test user:', user.email);

  // Create sample tasks
  const tasks = await Promise.all([
    prisma.task.create({
      data: {
        title: 'Complete project setup',
        description: 'Set up the initial project structure and dependencies',
        status: TaskStatus.COMPLETED,
        userId: user.id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Implement authentication',
        description: 'Build JWT-based authentication with bcrypt password hashing',
        status: TaskStatus.COMPLETED,
        userId: user.id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Create task CRUD APIs',
        description: 'Implement create, read, update, delete operations for tasks',
        status: TaskStatus.IN_PROGRESS,
        userId: user.id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Add pagination and filtering',
        description: 'Implement pagination, status filtering, and search functionality',
        status: TaskStatus.IN_PROGRESS,
        userId: user.id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Deploy to production',
        description: 'Deploy backend to Render and frontend to Vercel',
        status: TaskStatus.PENDING,
        userId: user.id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Write documentation',
        description: 'Create comprehensive API documentation and README',
        status: TaskStatus.PENDING,
        userId: user.id,
      },
    }),
  ]);

  console.log(`✅ Created ${tasks.length} sample tasks`);
  console.log('\n🎉 Database seeded successfully!');
  console.log('\nTest credentials:');
  console.log('Email: test@example.com');
  console.log('Password: Test123!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
