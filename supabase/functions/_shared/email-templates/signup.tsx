/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface SignupEmailProps {
  siteName: string
  siteUrl: string
  recipient: string
  confirmationUrl: string
}

export const SignupEmail = ({
  siteName,
  siteUrl,
  recipient,
  confirmationUrl,
}: SignupEmailProps) => (
  <Html lang="fr" dir="ltr">
    <Head>
      <style>{darkModeCss}</style>
    </Head>
    <Preview>Confirmez votre email · Confirm your email — {siteName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img src="https://mariable.fr/logo-mariable-clean.png" alt="Mariable" height="40" style={{ margin: '0 0 24px' }} />
        <Heading style={h1}>Confirmez votre adresse email</Heading>
        <Text style={text}>
          Merci de votre inscription sur{' '}
          <Link href={siteUrl} style={link}><strong>{siteName}</strong></Link> !
          Confirmez votre adresse ({recipient}) en cliquant sur le bouton ci-dessous.
        </Text>
        <Button className="dm-btn" style={button} href={confirmationUrl}>
          Confirmer mon email
        </Button>
        <Heading style={{ ...h1, fontSize: '18px', margin: '36px 0 16px' }}>Confirm your email address</Heading>
        <Text style={text}>
          Thanks for signing up to <strong>{siteName}</strong>! Please confirm your address ({recipient}) by clicking the button below.
        </Text>
        <Button className="dm-btn" style={button} href={confirmationUrl}>
          Confirm my email
        </Button>
        <Text style={footer}>
          Si vous n'avez pas créé de compte, ignorez cet email. · If you didn't create an account, you can safely ignore this email.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default SignupEmail

const main = { backgroundColor: '#ffffff', fontFamily: 'Georgia, "Times New Roman", serif' }
const container = { padding: '20px 25px' }
const h1 = {
  fontSize: '22px',
  fontWeight: 'bold' as const,
  color: '#1a1a18',
  margin: '0 0 20px',
}
const text = {
  fontSize: '14px',
  color: '#55575d',
  lineHeight: '1.5',
  margin: '0 0 25px',
}
const link = { color: 'inherit', textDecoration: 'underline' }
const button = {
  backgroundColor: '#63745A',
  color: '#ffffff',
  fontSize: '14px',
  border: '1px solid #63745A',
  borderRadius: '0px',
  padding: '12px 20px',
  textDecoration: 'none',
}
const footer = { fontSize: '12px', color: '#999999', margin: '30px 0 0' }
// Rendered as a text child, which React may HTML-escape: keep this CSS free of >, &, and quotes.
const darkModeCss = `
  @media (prefers-color-scheme: dark) {
    .dm-btn { background-color: #63745A !important; color: #ffffff !important; }
  }
  [data-ogsc] .dm-btn { background-color: #63745A !important; color: #ffffff !important; }
  [data-ogsb] .dm-btn { background-color: #63745A !important; color: #ffffff !important; }
`
