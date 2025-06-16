import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface ShippingConfirmationEmailProps {
  name: string;
  tracking_number: string;
}

export const ShippingConfirmationEmail = ({
  name,
  tracking_number,
}: ShippingConfirmationEmailProps) => {
  const previewText = `Your order has shipped! Tracking number: ${tracking_number}`;

  return (
    <Html                                                                         >
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Your Order Has Shipped! 🎉</Heading>
          <Text style={text}>Hi {name},</Text>
          <Text style={text}>
            Great news! Your order has been shipped and is on its way to you.
          </Text>
          <Text style={trackingText}>
            Tracking Number: {tracking_number}
          </Text>
          <Text style={text}>
            You can track your package using the tracking number above and/or by visiting the USPS website.
          </Text>
          <Text style={text}>
            Thank you for your patience and support!<br />
            The Integrity Team
          </Text>
          <Text>
            For any questions or concerns, please contact us at <a href="mailto:support@integritythedrop.com">support@integritythedrop.com</a>.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: '#ffffff',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '580px',
};

const h1 = {
  color: '#977B49',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
};

const text = {
  color: '#000000',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
};

const trackingText = {
  color: '#000000',
  fontSize: '18px',
  fontWeight: 'bold',
  lineHeight: '24px',
  margin: '16px 0',
  padding: '16px',
  backgroundColor: '#f4f4f4',
  borderRadius: '4px',
};

export default ShippingConfirmationEmail; 