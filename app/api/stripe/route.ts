import { api } from '@/convex/_generated/api';
import { ConvexHttpClient } from 'convex/browser';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

import { sendNextStepsEmail } from '@/emails/actions';
import dotenv from 'dotenv';

dotenv.config();

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL!;

const convex = new ConvexHttpClient(CONVEX_URL);


export async function POST(request: Request) {
  
  const resendApiKey = process.env.NODE_ENV === 'production' ? process.env.RESEND_API_KEY : process.env.NEXT_PUBLIC_RESEND_API_KEY;
  const resend = new Resend(resendApiKey);
  console.log('Stripe Webhook Received');
  // just need to use the value of resend
  console.log('resend', resend.domains.list());
  
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
    const tracking_number = checkoutSession.metadata.tracking_number || '';
    const has_shipped = checkoutSession.metadata.has_shipped || false;
    const address = {
      name: checkoutSession.customer_details?.name || 'no-name-provided',
      line_1: checkoutSession.customer_details?.address?.line1 || 'no-address-provided',
      line_2: checkoutSession.customer_details?.address?.line2 || null,
      city: checkoutSession.customer_details?.address?.city || 'no-city-provided',
      state: checkoutSession.customer_details?.address?.state || 'no-state-provided',
      zip: checkoutSession.customer_details?.address?.postal_code || 'no-zip-provided',
    };
    const quantity_to_ship = checkoutSession.metadata.quantity_to_ship || 0;

    console.log('Stripe checkout session', session_id);
    console.log('Customer name:', name);
    console.log('Customer email:', email);

    await convex.mutation(api.stripeLogs.insertStripeData, {
      email: email,
      payment_amount: payment_amount,
      payment_status: payment_status,
      product_id: session_id,
      name: name,
      tracking_number: tracking_number,
      has_shipped: has_shipped,
      address: address,
      quantity_to_ship: quantity_to_ship,
      createdAt: Date.now(),
    });

    console.log('Successfully processed Stripe checkout session');

    await sendNextStepsEmail(email, name, address, quantity_to_ship);

    return NextResponse.json({ status: 'ok' });
  } catch (err) {
    console.error('Stripe Webhook Error:', err);
    return NextResponse.json({ error: 'Failed to process data' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
} 