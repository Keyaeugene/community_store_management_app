import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { memberId, amount, remaining } = await request.json();
    
    // Example credit limit (Guideline 8)
    const MAX_CREDIT = 500; // Adjust as needed
    if (amount > MAX_CREDIT) {
      return NextResponse.json({ error: `Credit cannot exceed $${MAX_CREDIT}` }, { status: 400 });
    }

    const credit = await prisma.credit.create({
      data: {
        memberId,
        amount,
        remaining,
        dateIssued: new Date(),
      },
    });

    return NextResponse.json(credit);
  } catch (error) {
    console.error('Error creating credit:', error);
    return NextResponse.json({ error: 'Failed to create credit' }, { status: 500 });
  }
}