import { NextResponse } from 'next/server';
import { api } from '@/convex/_generated/api';
import { ConvexHttpClient } from 'convex/browser';

import dotenv from 'dotenv';

dotenv.config();

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL!;

const convex = new ConvexHttpClient(CONVEX_URL);

export async function POST(request: Request) {

  console.log('Stripe Webhook Received');
  
  try {
    const body = await request.json();
    
    // Extract data from Stripe payment intent succeeded event
    const paymentIntent = body.data.object;
    
    // Extract required fields from payment intent
    const email = paymentIntent.receipt_email || 'no-email-provided';
    const name = paymentIntent.shipping?.name || 'no-name-provided';
    const payment_amount = paymentIntent.amount_received; // in cents
    const payment_status = paymentIntent.status;
    const payment_intent_id = paymentIntent.id;

    console.log('Stripe payment intent', payment_intent_id);
    console.log('Customer name:', name);
    console.log('Customer email:', email);

    await convex.mutation(api.stripeLogs.insertStripeData, {
      email: email,
      payment_amount: payment_amount,
      payment_status: payment_status,
      product_id: payment_intent_id,
      name: name,
      createdAt: Date.now(),
    });

    console.log('Successfully processed Stripe payment intent');

    return NextResponse.json({ status: 'ok' });
  } catch (err) {
    console.error('Stripe Webhook Error:', err);
    return NextResponse.json({ error: 'Failed to process data' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
} 