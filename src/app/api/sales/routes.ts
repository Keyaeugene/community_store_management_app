import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { memberId, branchId, itemId, quantity } = await req.json();

  // Fetch member's household ration (assume stored in member or calculate)
  const member = await prisma.member.findUnique({ where: { id: memberId } });
  if (!member) return NextResponse.json({ error: 'Member not found' }, { status: 404 });

  // Example: Household ration calculation (customize based on needs)
  const householdRation = member.householdSize * 100;  // e.g., 100 units per person
  if (quantity < householdRation * 0.5) {
    return NextResponse.json({ error: 'Minimum sale is 50% of household ration' }, { status: 400 });
  }

  // Record sale and update inventory
  const sale = await prisma.sale.create({
    data: { memberId, branchId, itemId, quantity },
  });

  await prisma.item.update({
    where: { id: itemId },
    data: { inventory: { increment: quantity } },
  });

  return NextResponse.json(sale);
}