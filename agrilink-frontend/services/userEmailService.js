// User Email Management Service
// Handles dynamic EmailJS template creation for each user

import emailjs from '@emailjs/browser';

export class UserEmailService {
  constructor() {
    this.baseConfig = {
      SERVICE_ID: 'service_shanu', // Your EmailJS service ID
      TEMPLATE_ID: 'template001', // Your EmailJS template ID
      PUBLIC_KEY: 'x81NpKL7Q438yTjZK', // Your EmailJS public key
      FROM_EMAIL: 'shanukanthan41@gmail.com',
      FROM_NAME: 'AgriLink Team'
    };
  }

  // Create a unique template ID for each user
  generateTemplateId(userEmail) {
    // Convert email to a safe template ID
    const safeEmail = userEmail.replace(/[^a-zA-Z0-9]/g, '_');
    return `template_${safeEmail}_${Date.now()}`;
  }

  // Create EmailJS template for a new user
  async createUserTemplate(userData) {
    try {
      const { email, fullName } = userData;
      const templateId = this.generateTemplateId(email);
      
      // Template content for the user
      const templateContent = {
        name: `AgriLink OTP - ${fullName}`,
        subject: `Your AgriLink Password Reset Code`,
        content: `
Hello {{user_name}},

You requested a password reset for your {{app_name}} account.

Your verification code is: {{otp_code}}

This code will expire in 10 minutes.

If you didn't request this password reset, please ignore this email.

Best regards,
{{from_name}}
        `,
        // Store template info in user data
        templateId: templateId
      };

      // Store template info in localStorage for now
      // In production, you'd store this in your database
      const userTemplates = JSON.parse(localStorage.getItem('userEmailTemplates') || '{}');
      userTemplates[email] = {
        templateId: templateId,
        fullName: fullName,
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('userEmailTemplates', JSON.stringify(userTemplates));

      console.log(`✅ Email template created for ${email}: ${templateId}`);
      return templateId;

    } catch (error) {
      console.error('Error creating user template:', error);
      throw error;
    }
  }

  // Send OTP to user's email
  async sendOTPToUser(userEmail, otpCode) {
    try {
      // Get user template info
      const userTemplates = JSON.parse(localStorage.getItem('userEmailTemplates') || '{}');
      const userTemplate = userTemplates[userEmail];

      if (!userTemplate) {
        throw new Error(`No email template found for ${userEmail}`);
      }

      // EmailJS template parameters
      const templateParams = {
        email: userEmail, // EmailJS expects 'email' parameter
        to_email: userEmail, // Also include to_email for compatibility
        otp_code: otpCode,
        user_name: userTemplate.fullName,
        app_name: 'AgriLink',
        from_name: this.baseConfig.FROM_NAME,
        from_email: this.baseConfig.FROM_EMAIL
      };

      // Send email using EmailJS with master template
      const result = await emailjs.send(
        this.baseConfig.SERVICE_ID,
        this.baseConfig.TEMPLATE_ID, // Use master template for all users
        templateParams,
        this.baseConfig.PUBLIC_KEY
      );

      return { success: true, result };

    } catch (error) {
      console.error('Error sending OTP:', error);
      throw error;
    }
  }

  // Get user template info
  getUserTemplate(userEmail) {
    const userTemplates = JSON.parse(localStorage.getItem('userEmailTemplates') || '{}');
    return userTemplates[userEmail] || null;
  }

  // List all user templates
  getAllUserTemplates() {
    return JSON.parse(localStorage.getItem('userEmailTemplates') || '{}');
  }

  // Delete user template
  deleteUserTemplate(userEmail) {
    const userTemplates = JSON.parse(localStorage.getItem('userEmailTemplates') || '{}');
    delete userTemplates[userEmail];
    localStorage.setItem('userEmailTemplates', JSON.stringify(userTemplates));
  }
}

// Export singleton instance
export const userEmailService = new UserEmailService();
