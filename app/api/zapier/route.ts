import { NextResponse } from 'next/server';
import { api } from '@/convex/_generated/api';
import { ConvexHttpClient } from 'convex/browser';

import dotenv from 'dotenv';

dotenv.config();

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL!;

const convex = new ConvexHttpClient(CONVEX_URL);

export async function POST(request: Request) {

  console.log('Zapier Webhook Received');
  
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['email', 'payment_amount', 'payment_status', 'product_id', 'name'];
    for (const field of requiredFields) {
      if (!(field in body)) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate payment_amount is a number
    if (typeof body.payment_amount !== 'number') {
      body.payment_amount = parseFloat(body.payment_amount);
      if (isNaN(body.payment_amount)) {
        return NextResponse.json(
          { error: 'payment_amount must be a valid number' },
          { status: 400 }
        );
      }
    }

    console.log('body', body);
    console.log('adding to zapier', body.name);
    console.log('adding to zapier', body.email);

    await convex.mutation(api.zapier.insertZapData, {
      email: body.email,
      payment_amount: body.payment_amount,
      payment_status: body.payment_status,
      product_id: body.product_id,
      name: body.name,
      createdAt: Date.now(),
    });

    console.log('done adding to zapier');

    return NextResponse.json({ status: 'ok' });
  } catch (err) {
    console.error('Zapier Webhook Error:', err);
    return NextResponse.json({ error: 'Failed to process data' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
} 