import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  await prisma.member.createMany({
    data: [
      { name: 'John Doe', email: 'john@example.com', householdSize: 4 },
      { name: 'Jane Smith', email: 'jane@example.com', householdSize: 3 },
    ],
  });

  await prisma.item.createMany({
    data: [
      { name: 'Beans', type: 'PRODUCE', wholesalePrice: 2.0, marketPrice: 3.0, unit: 'kg', inventory: 100 },
      { name: 'Maize', type: 'PRODUCE', wholesalePrice: 1.5, marketPrice: 2.5, unit: 'kg', inventory: 200 },
      { name: 'Soap', type: 'CONSUMABLE', wholesalePrice: 1.0, marketPrice: 1.5, unit: 'unit', inventory: 50 },
    ],
  });

  await prisma.branch.createMany({
    data: [
      { name: 'Main Branch', location: 'Downtown' },
      { name: 'West Branch', location: 'West Side' },
    ],
  });

  console.log('Seeding completed.');
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());