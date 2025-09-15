import { PrismaClient, ItemType } from '../src/generated/prisma'; // Adjust the path if your generated prisma folder is elsewhere

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Seed members
  console.log('Seeding members...');
  const membersData = [
    { name: 'John Doe', email: 'john@example.com', householdSize: 4 },
    { name: 'Jane Smith', email: 'jane@example.com', householdSize: 3 },
    { name: 'Alice Johnson', email: 'alice@example.com', householdSize: 5 },
  ];

  for (const memberData of membersData) {
    const existingMember = await prisma.member.findUnique({
      where: { email: memberData.email }
    });

    if (!existingMember) {
      await prisma.member.create({ data: memberData });
      console.log(`Created member: ${memberData.name}`);
    } else {
      console.log(`Member ${memberData.name} already exists`);
    }
  }

  // Seed items
  console.log('Seeding items...');
  const itemsData = [
    { name: 'Beans', type: ItemType.PRODUCE, wholesalePrice: 2.0, marketPrice: 3.0, unit: 'kg', inventory: 100 },
    { name: 'Maize', type: ItemType.PRODUCE, wholesalePrice: 1.5, marketPrice: 2.5, unit: 'kg', inventory: 200 },
    { name: 'Millet', type: ItemType.PRODUCE, wholesalePrice: 1.8, marketPrice: 2.8, unit: 'kg', inventory: 150 },
    { name: 'Soap', type: ItemType.CONSUMABLE, wholesalePrice: 1.0, marketPrice: 1.5, unit: 'unit', inventory: 50 },
    { name: 'Sugar', type: ItemType.CONSUMABLE, wholesalePrice: 0.8, marketPrice: 1.2, unit: 'kg', inventory: 75 },
    { name: 'Salt', type: ItemType.CONSUMABLE, wholesalePrice: 0.5, marketPrice: 0.8, unit: 'kg', inventory: 100 },
  ];

  for (const itemData of itemsData) {
    const existingItem = await prisma.item.findFirst({
      where: { name: itemData.name }
    });

    if (!existingItem) {
      await prisma.item.create({ data: itemData });
      console.log(`Created item: ${itemData.name}`);
    } else {
      console.log(`Item ${itemData.name} already exists`);
    }
  }

  // Seed branches
  console.log('Seeding branches...');
  const branchesData = [
    { name: 'Main Branch', location: 'Downtown' },
    { name: 'West Branch', location: 'West Side' },
    { name: 'East Branch', location: 'East Side' },
  ];

  for (const branchData of branchesData) {
    const existingBranch = await prisma.branch.findFirst({
      where: { name: branchData.name }
    });

    if (!existingBranch) {
      await prisma.branch.create({ data: branchData });
      console.log(`Created branch: ${branchData.name}`);
    } else {
      console.log(`Branch ${branchData.name} already exists`);
    }
  }

  // Create sample ration cards for current year
  console.log('Creating ration cards...');
  const currentYear = new Date().getFullYear();
  const allMembers = await prisma.member.findMany();

  for (const member of allMembers) {
    const existingCard = await prisma.rationCard.findFirst({
      where: {
        memberId: member.id,
        year: currentYear
      }
    });

    if (!existingCard) {
      const baseRationPerPerson = {
        beans: 25, // kg per person per year
        maize: 50, // kg per person per year
        millet: 20, // kg per person per year
      };

      const allowance = {
        beans: baseRationPerPerson.beans * member.householdSize,
        maize: baseRationPerPerson.maize * member.householdSize,
        millet: baseRationPerPerson.millet * member.householdSize,
      };

      await prisma.rationCard.create({
        data: {
          memberId: member.id,
          year: currentYear,
          allowance,
          consumed: { beans: 0, maize: 0, millet: 0 },
          renewalDate: new Date(currentYear + 1, 0, 1),
        },
      });
      console.log(`Created ration card for ${member.name}`);
    } else {
      console.log(`Ration card for ${member.name} already exists`);
    }
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });