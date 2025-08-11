import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
  Button,
  Hr,
} from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';

interface PasswordResetEmailProps {
  supabase_url: string;
  email_action_type: string;
  redirect_to: string;
  token_hash: string;
  token: string;
  user_email: string;
}

export const PasswordResetEmail = ({
  token_hash,
  supabase_url,
  email_action_type,
  redirect_to,
  user_email,
}: PasswordResetEmailProps) => {
  const resetUrl = `${supabase_url}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`;

  return (
    <Html>
      <Head />
      <Preview>Réinitialisez votre mot de passe Mariable</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Réinitialisation de votre mot de passe</Heading>
          
          <Text style={text}>
            Bonjour,
          </Text>
          
          <Text style={text}>
            Vous avez demandé la réinitialisation de votre mot de passe pour votre compte Mariable ({user_email}).
          </Text>
          
          <Text style={text}>
            Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :
          </Text>
          
          <Button href={resetUrl} style={button}>
            Réinitialiser mon mot de passe
          </Button>
          
          <Text style={smallText}>
            Ou copiez-collez ce lien dans votre navigateur :
          </Text>
          
          <Text style={linkText}>
            {resetUrl}
          </Text>
          
          <Hr style={hr} />
          
          <Text style={footer}>
            Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email en toute sécurité.
            Ce lien expirera dans 24 heures pour votre sécurité.
          </Text>
          
          <Text style={signature}>
            L'équipe Mariable<br />
            <Link href="https://mariable.fr" style={link}>
              mariable.fr
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default PasswordResetEmail;

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0 40px',
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
  padding: '0 40px',
};

const button = {
  backgroundColor: '#8B5CF6',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: 'fit-content',
  margin: '32px auto',
  padding: '16px 32px',
};

const smallText = {
  color: '#666',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '16px 0 8px',
  padding: '0 40px',
};

const linkText = {
  color: '#8B5CF6',
  fontSize: '12px',
  lineHeight: '18px',
  margin: '0 0 32px',
  padding: '0 40px',
  wordBreak: 'break-all' as const,
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '32px 40px',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  margin: '16px 0',
  padding: '0 40px',
};

const signature = {
  color: '#333',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '32px 0 0',
  padding: '0 40px',
};

const link = {
  color: '#8B5CF6',
  textDecoration: 'underline',
};