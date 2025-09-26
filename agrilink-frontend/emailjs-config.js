// EmailJS Configuration
// Your EmailJS credentials

export const EMAILJS_CONFIG = {
  // Your EmailJS Service ID (found in EmailJS dashboard)
  SERVICE_ID: 'service_shanu',
  
  // Your EmailJS Template ID (found in EmailJS dashboard)
  TEMPLATE_ID: 'template001',
  
  // Your EmailJS Public Key (found in EmailJS dashboard)
  PUBLIC_KEY: 'x81NpKL7Q438yTjZK',
  
  // Email template parameters
  TEMPLATE_PARAMS: {
    app_name: 'AgriLink',
    from_name: 'AgriLink Team',
    from_email: 'shanukanthan41@gmail.com'
  }
};

// Instructions for setting up EmailJS:
/*
1. Go to https://www.emailjs.com/
2. Create a free account
3. Create a new service (Gmail, Outlook, etc.)
4. Create a new email template with these variables:
   - {{to_email}} - recipient email
   - {{otp_code}} - the OTP code
   - {{user_name}} - user's name
   - {{app_name}} - application name
5. Get your Service ID, Template ID, and Public Key
6. Replace the values above with your actual credentials
7. Update the configuration in forgetpassword.js
*/

// Example email template:
/*
Subject: Your AgriLink Password Reset Code

Hello {{user_name}},

You requested a password reset for your {{app_name}} account.

Your verification code is: {{otp_code}}

This code will expire in 10 minutes.

If you didn't request this password reset, please ignore this email.

Best regards,
{{app_name}} Team
*/
