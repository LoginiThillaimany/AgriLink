// EmailJS Test File
// Test your EmailJS configuration

import emailjs from '@emailjs/browser';

export const testEmailJS = async () => {
  try {
    console.log('Testing EmailJS configuration...');
    
    // Your actual EmailJS credentials
    const serviceId = 'service_shanu';
    const templateId = 'template001';
    const publicKey = 'x81NpKL7Q438yTjZK';
   
    console.log('Service ID:', serviceId);
    console.log('Template ID:', templateId);
    console.log('Public Key:', publicKey);
    
    // Test email parameters
    const templateParams = {
      email: 'shanukanthan41@gmail.com', // EmailJS expects 'email' parameter
      to_email: 'shanukanthan41@gmail.com', // Also include to_email for compatibility
      otp_code: '123456',
      user_name: 'Test User',
      app_name: 'AgriLink',
      from_name: 'AgriLink Team',
      from_email: 'shanukanthan41@gmail.com'
    };
    
    console.log('Sending test email...');
    console.log('Template parameters:', templateParams);
    
    const result = await emailjs.send(
      serviceId,
      templateId,
      templateParams,
      publicKey
    );
    
    console.log('✅ Email sent successfully!', result);
    return { success: true, result };
    
  } catch (error) {
    console.error('❌ EmailJS Test Error:', error);
    return { success: false, error };
  }
};

// Usage:
// Call testEmailJS() in your browser console or component to test
// This will send a test email to shanukanthan41@gmail.com