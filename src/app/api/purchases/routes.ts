import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, RationCard, Item } from '@prisma/client';

const prisma = new PrismaClient();

// Define the shape of allowance and consumed fields
type RationMap = Record<string, number>;

export async function POST(req: NextRequest) {
  const { memberId, branchId, itemId, quantity, useCredit = false } = await req.json();

  const item = await prisma.item.findUnique({ where: { id: itemId } });
  if (!item || item.inventory < quantity)
    return NextResponse.json({ error: 'Insufficient stock' }, { status: 400 });

  // Get current year's ration card
  const year = new Date().getFullYear();
  const rationCard = await prisma.rationCard.findUnique({
    where: { memberId_year: { memberId, year } },
  });

  let pricePerUnit = item.wholesalePrice;
  let updateConsumed = false;

  if (rationCard) {
    const itemName = item.name;
    // Cast to RationMap for type safety
    const allowance = rationCard.allowance as unknown as RationMap;
    const consumed = rationCard.consumed as unknown as RationMap;
    const remainingAllowance = (allowance[itemName] || 0) - (consumed[itemName] || 0);
    if (remainingAllowance >= quantity) {
      updateConsumed = true;
    } else {
      pricePerUnit = item.marketPrice; // Market price if exhausted
    }
  } else {
    pricePerUnit = item.marketPrice; // No card: Market price
  }

  let totalPrice = pricePerUnit * quantity;

  if (useCredit) {
    // Credit at market price
    pricePerUnit = item.marketPrice;
    totalPrice = pricePerUnit * quantity;
    const credit = await prisma.credit.findFirst({ where: { memberId, remaining: { gte: totalPrice } } });
    if (!credit)
      return NextResponse.json({ error: 'Insufficient credit' }, { status: 400 });

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
    const consumed = rationCard.consumed as unknown as RationMap;
    await prisma.rationCard.update({
      where: { id: rationCard.id },
      data: {
        consumed: {
          ...consumed,
          [itemName]: (consumed[itemName] || 0) + quantity,
        },
      },
    });
  }

  return NextResponse.json(purchase);
}