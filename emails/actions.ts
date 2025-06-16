'use server'

import { NextStepsEmail } from './nextSteps';
import { ShippingConfirmationEmail } from './shippingConfirmation';
import { Resend } from 'resend';

const resendApiKey = process.env.NODE_ENV === 'production' ? process.env.RESEND_API_KEY : process.env.NEXT_PUBLIC_RESEND_API_KEY;
const resend = new Resend(resendApiKey);

export async function sendNextStepsEmail(
  email: string,
  name: string,
  address: {
    name: string;
    line_1: string;
    line_2?: string;
    city: string;
    state: string;
    zip: string;
  },
  quantity_to_ship: number
) {
  try {
    const { data, error } = await resend.emails.send({
      from: `Integrity <noreply@integritythedrop.com>`,
      to: email,
      subject: 'Thank You for Your Purchase!',
      react: NextStepsEmail({ name, address, quantity_to_ship }),
    });

    if (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }

    console.log('Email sent:', data);

    return data;
  } catch (err) {
    console.error('Error in sendNextStepsEmail:', err);
    throw err;
  }
}

export async function sendShippingConfirmationEmail(
  email: string,
  name: string,
  tracking_number: string
) {
  try {
    const { data, error } = await resend.emails.send({
      from: `Integrity <noreply@integritythedrop.com>`,
      to: email,
      subject: 'Your Order Has Shipped!',
      react: ShippingConfirmationEmail({ name, tracking_number }),
    });

    if (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }

    console.log('Email sent:', data);

    return data;
  } catch (err) {
    console.error('Error in sendShippingConfirmationEmail:', err);
    throw err;
  }
}