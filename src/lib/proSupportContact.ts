export const PRO_SUPPORT_WHATSAPP_NUMBER = '33760108189';
export const buildProSupportWhatsAppUrl = (message: string) =>
  `https://wa.me/${PRO_SUPPORT_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;