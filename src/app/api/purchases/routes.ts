import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { memberId, branchId, itemId, quantity, useCredit = false } = await req.json();

  const item = await prisma.item.findUnique({ where: { id: itemId } });
  if (!item || item.inventory < quantity) return NextResponse.json({ error: 'Insufficient stock' }, { status: 400 });

  // Get current year's ration card
  const year = new Date().getFullYear();
  const rationCard = await prisma.rationCard.findUnique({
    where: { memberId_year: { memberId, year } },
  });

  let pricePerUnit = item.wholesalePrice;
  let updateConsumed = false;

  if (rationCard) {
    const itemName = item.name;
    const remainingAllowance = (rationCard.allowance as any)[itemName] - ((rationCard.consumed as any)[itemName] || 0);
    if (remainingAllowance >= quantity) {
      updateConsumed = true;
    } else {
      pricePerUnit = item.marketPrice;  // Guideline 7: Market price if exhausted
    }
  } else {
    pricePerUnit = item.marketPrice;  // No card: Market price
  }

  const totalPrice = pricePerUnit * quantity;

  if (useCredit) {
    // Guideline 8: Credit at market price (even if wholesale applicable?)
    pricePerUnit = item.marketPrice;  // Enforce market for credit
    const credit = await prisma.credit.findFirst({ where: { memberId, remaining: { gte: totalPrice } } });
    if (!credit) return NextResponse.json({ error: 'Insufficient credit' }, { status: 400 });

    await prisma.credit.update({
      where: { id: credit.id },
      data: { remaining: { decrement: totalPrice } },
    });
  }

  // Record purchase and update inventory/consumed
  const purchase = await prisma.purchase.create({
    data: { memberId, branchId, itemId, quantity, pricePaid: totalPrice, onCredit: useCredit },
  });

  await prisma.item.update({
    where: { id: itemId },
    data: { inventory: { decrement: quantity } },
  });

  if (updateConsumed && rationCard) {
    const itemName = item.name;
    await prisma.rationCard.update({
      where: { id: rationCard.id },
      data: {
        consumed: {
          ...rationCard.consumed as any,
          [itemName]: ((rationCard.consumed as any)[itemName] || 0) + quantity,
        },
      },
    });
  }

  return NextResponse.json(purchase);
}