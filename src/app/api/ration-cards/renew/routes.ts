import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { memberId, year, allowance } = await req.json();  // e.g., allowance = { beans: 100 }

  // Check if card exists for the year
  const existing = await prisma.rationCard.findUnique({
    where: { memberId_year: { memberId, year } },
  });

  if (existing) {
    return NextResponse.json({ error: 'Card already exists for this year' }, { status: 400 });
  }

  // No carry-over: Create new with fresh allowance
  const newCard = await prisma.rationCard.create({
    data: {
      memberId,
      year,
      allowance,
      consumed: {},  // Reset consumed
      renewalDate: new Date(),
    },
  });

  return NextResponse.json(newCard);
}