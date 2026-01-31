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

export interface ServiceRequestEmailPayload {
  name: string;
  email: string;
  service: string;
  message: string;
  date: string;
}

export const sendServiceRequestEmail = async (payload: ServiceRequestEmailPayload): Promise<void> => {
  // Silently fail if EmailJS is not configured
  if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
    console.warn('EmailJS not configured. Email notification skipped.');
    return;
  }

  try {
    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        name: payload.name,
        email: payload.email,
        service: payload.service,
        message: payload.message,
        date: payload.date,
      },
      EMAILJS_PUBLIC_KEY
    );
    console.log('Email notification sent successfully');
  } catch (err) {
    // Log error but don't throw - don't block form submission
    console.error('Failed to send email notification:', err);
  }
};
