import { EmailClient } from "@azure/communication-email";

// Azure Communication Services Email Client
let emailClient: EmailClient | null = null;

// Initialize email client
function getEmailClient() {
  if (!emailClient && process.env.AZURE_COMMUNICATION_CONNECTION_STRING) {
    emailClient = new EmailClient(process.env.AZURE_COMMUNICATION_CONNECTION_STRING);
  }
  return emailClient;
}

// Send email using Azure Communication Services
export async function sendEmailWithAzure(options: {
  to: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
}) {
  const client = getEmailClient();
  
  if (!client) {
    throw new Error("Azure Communication Services email client not configured");
  }

  const { to, subject, htmlContent, textContent } = options;
  const fromEmail = process.env.EMAIL_FROM || "noreply@yourdomain.com";

  try {
    const emailMessage = {
      senderAddress: fromEmail,
      content: {
        subject: subject,
        html: htmlContent,
        plainText: textContent || htmlContent.replace(/<[^>]*>/g, '') // Strip HTML for plain text
      },
      recipients: {
        to: [{ address: to }]
      }
    };

    const poller = await client.beginSend(emailMessage);
    const result = await poller.pollUntilDone();
    
    console.log("Email sent successfully:", result);
    return result;
  } catch (error) {
    console.error("Error sending email with Azure:", error);
    throw error;
  }
}

// Check if Azure email is configured
export function isAzureEmailConfigured(): boolean {
  return !!process.env.AZURE_COMMUNICATION_CONNECTION_STRING;
}
