import emailjs from '@emailjs/browser';

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

// Initialize EmailJS (call once when app loads)
export const initEmailJS = () => {
  if (EMAILJS_PUBLIC_KEY) {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }
};

export interface EmailPayload {
  to_email: string;
  from_name: string;
  from_email: string;
  service_name: string;
  message: string;
  submitted_at: string;
}

export const sendServiceRequestEmail = async (payload: EmailPayload): Promise<void> => {
  // Silently fail if EmailJS is not configured
  if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
    console.warn('EmailJS not configured. Email notification skipped.');
    return;
  }

  try {
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      to_email: payload.to_email,
      from_name: payload.from_name,
      from_email: payload.from_email,
      service_name: payload.service_name,
      message: payload.message,
      submitted_at: payload.submitted_at,
    });
  } catch (err) {
    // Log error but don't throw - don't block form submission
    console.error('Failed to send email notification:', err);
  }
};
