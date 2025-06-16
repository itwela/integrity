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

interface NextStepsEmailProps {
  name?: string;
  address: {
    name?: string;
    line_1?: string;
    line_2?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
  quantity_to_ship: number;
}

export const NextStepsEmail = ({
  name,
  address,
  quantity_to_ship,
}: NextStepsEmailProps) => {
  const previewText = `Thank you for your purchase, ${name}!`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Thank You for Your Purchase!</Heading>
          <Text style={text}>Hi {name || 'Customer'},</Text>
          <Text style={text}>
            Your INTEGRITY bundle is more than a product — it's an experience. Let's walk you through what's coming next.
          </Text>
          <Text style={stepText}>
            <strong>Step 1: Purchase the Drop</strong><br />
            You've secured the exclusive INTEGRITY package, which includes an album, fragrance, and audiobook.
          </Text>
          <Text style={stepText}>
            <strong>Step 2: Scan the Code</strong><br />
            Once you receive your package, scan the QR code on the bottle to unlock your content.
          </Text>
          <Text style={stepText}>
            <strong>Step 3: Unlock the Experience</strong><br />
            Sign in with the email you used at checkout to access your exclusive content.
          </Text>

          {address && (
            <>

              <Text style={text}>
                We'll be sending {quantity_to_ship || 1} package{quantity_to_ship > 1 ? 's' : ''} to:
              </Text>

              {address?.line_2 && (
                <Text style={{ ...text, ...addressText, backgroundColor: '#f4f4f4', padding: '16px' }}>
                  {address?.name || ''}<br />
                  {address?.line_1 || ''}<br />
                  {address?.line_2 && `${address?.line_2 || ''}`}<br />
                  {address?.city || ''}, {address?.state || ''} {address?.zip || ''}
                </Text>
              )}

              {!address?.line_2 && (
                <Text style={{ ...text, ...addressText, backgroundColor: '#f4f4f4', padding: '16px' }}>
                  {address?.name || ''}<br />
                  {address?.line_1 || ''}<br />
                  {address?.city || ''}, {address?.state || ''} {address?.zip || ''}
                </Text>
              )}
            </>
          )}


          <Text style={text}>
            We'll send you another email with tracking information as soon as your order ships.
          </Text>
          <Text style={text}>
            Best regards,<br />
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
  padding: '20px',
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

const stepText = {
  color: '#000000',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
  padding: '16px',
  backgroundColor: '#f4f4f4',
  borderRadius: '4px',
};

const addressText = {
  color: '#000000',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
  padding: '16px',
  backgroundColor: '#f4f4f4',
  borderRadius: '4px',
};

export default NextStepsEmail;