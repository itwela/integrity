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
    
    // Extract data from Stripe checkout session completed event
    const checkoutSession = body.data.object;
    
    // Extract required fields from checkout session
    const email = checkoutSession.customer_details?.email || 'no-email-provided';
    const name = checkoutSession.customer_details?.name || 'no-name-provided';
    const payment_amount = checkoutSession.amount_total; // in cents
    const payment_status = checkoutSession.payment_status;
    const session_id = checkoutSession.id;

    console.log('Stripe checkout session', session_id);
    console.log('Customer name:', name);
    console.log('Customer email:', email);

    await convex.mutation(api.stripeLogs.insertStripeData, {
      email: email,
      payment_amount: payment_amount,
      payment_status: payment_status,
      product_id: session_id,
      name: name,
      createdAt: Date.now(),
    });

    console.log('Successfully processed Stripe checkout session');

    return NextResponse.json({ status: 'ok' });
  } catch (err) {
    console.error('Stripe Webhook Error:', err);
    return NextResponse.json({ error: 'Failed to process data' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
} 