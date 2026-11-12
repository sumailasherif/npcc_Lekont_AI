/**
 * Public site settings.
 * NEXT_PUBLIC_BOOKING_URL: where "Book a call" goes (Calendly, Cal.com, a WhatsApp click-to-chat link…).
 * Set it in apps/web/.env.local and in Vercel's environment variables. When it is empty,
 * the booking buttons fall back to the live bot (/try) so no link is ever dead.
 */
export const BOOKING_URL = process.env.NEXT_PUBLIC_BOOKING_URL?.trim() || "";
export const HAS_BOOKING = BOOKING_URL.length > 0;
export const BOOKING_HREF = HAS_BOOKING ? BOOKING_URL : "/try";
