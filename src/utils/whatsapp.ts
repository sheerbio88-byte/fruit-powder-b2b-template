const WHATSAPP_PHONE = String(import.meta.env.PUBLIC_CONTACT_WHATSAPP_NUMBER ?? '').replace(/\D/g, '');

export const WHATSAPP_PHONES = [WHATSAPP_PHONE] as const;

export const DEFAULT_WHATSAPP_MESSAGE =
  'Hello, I would like to inquire about fruit or vegetable powder. Is that convenient for you?';

export function getWhatsAppPhoneNumber(_date: Date = new Date()): string {
  return WHATSAPP_PHONE;
}

export function getWhatsAppUrl(message: string = DEFAULT_WHATSAPP_MESSAGE, date: Date = new Date()): string {
  const phoneNumber = getWhatsAppPhoneNumber(date);
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}