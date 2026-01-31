# EmailJS Setup Guide

## Overview
This app uses **EmailJS** to send automatic email notifications when users submit the service request form. Emails are sent to `pavankumar.consult@gmail.com` with full request details.

## Setup Steps

### 1. Create EmailJS Account
1. Go to [emailjs.com](https://www.emailjs.com/)
2. Sign up (free tier is sufficient)
3. Verify your email

### 2. Add Email Service
1. In EmailJS dashboard, go to **Email Services**
2. Click **Add Service**
3. Choose Gmail (or your preferred provider)
4. Follow authentication steps
5. Copy the **Service ID** (e.g., `service_xxxxx`)

### 3. Create Email Template
1. Go to **Email Templates**
2. Click **Create New Template**
3. Name it: `kind_bridge_service_request` (or preferred name)
4. Use this template with EXACT variable names:

```
Subject: New Service Request – Kind-Bridge

From: {{name}} ({{email}})

Service: {{service}}

Message:
{{message}}

Submitted: {{date}}
```

5. Set **To Email** to: `pavankumar.consult@gmail.com`
6. Set **Reply-To** to: `{{email}}`
7. Copy the **Template ID** (e.g., `template_xxxxx`)

### 4. Get Public Key
1. Go to **Account** → **API Keys**
2. Copy your **Public Key** (e.g., `xxxxx-xxxxx-xxxxx`)

### 5. Update .env.local
Add these to your `.env.local` file:

```env
VITE_EMAILJS_SERVICE_ID=service_xxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxx
VITE_EMAILJS_PUBLIC_KEY=xxxxx-xxxxx-xxxxx
```

### 6. Test
1. Run the app: `npm run dev`
2. Submit the service request form
3. Check your email inbox for the notification

## Features

- ✅ Automatically sends email after form saves to Firestore
- ✅ Non-blocking: Form submission succeeds even if email fails
- ✅ Includes: Client name, email, service, message, date/time
- ✅ Error logging for debugging (won't show to user)
- ✅ Graceful degradation if EmailJS not configured

## Troubleshooting

**Email not received?**
- Check spam/promotions folder
- Verify all env variables are correct
- Check EmailJS dashboard for failed deliveries

**Form still works without EmailJS?**
- Yes, by design. Form submission succeeds regardless of email.
- Check browser console for error logs.

## Email Template Customization

To modify the email template:

1. Login to EmailJS dashboard
2. Edit the template
3. **REQUIRED Variables** (must match exactly):
   - `{{name}}` - Client name
   - `{{email}}` - Client email/phone
   - `{{service}}` - Selected service name
   - `{{message}}` - Client message
   - `{{date}}` - Submission date & time
