interface MailerSendEmailData {
  from: {
    email: string;
    name: string;
  };
  to: Array<{
    email: string;
    name?: string;
  }>;
  subject: string;
  html: string;
  text: string;
}

interface MailerSendResponse {
  message: string;
  [key: string]: unknown;
}

export class MailerSendError extends Error {
  constructor(
    message: string,
    public status?: number,
    public response?: unknown
  ) {
    super(message);
    this.name = "MailerSendError";
  }
}

export async function sendMagicLinkEmail(
  recipientEmail: string,
  magicLinkUrl: string
): Promise<void> {
  const apiToken = process.env.MAILERSEND_API_TOKEN;
  const fromEmail = process.env.EMAIL_FROM;
  const fromName = process.env.EMAIL_FROM_NAME;

  if (!apiToken) {
    throw new MailerSendError(
      "MAILERSEND_API_TOKEN environment variable is not set"
    );
  }

  if (!fromEmail) {
    throw new MailerSendError("EMAIL_FROM environment variable is not set");
  }

  const emailData: MailerSendEmailData = {
    from: {
      email: fromEmail,
      name: fromName || "Tchoupitoulas Data Challenge",
    },
    to: [
      {
        email: recipientEmail,
      },
    ],
    subject: "Sign in to Tchoupitoulas Data Challenge",
    html: createMagicLinkEmailTemplate(magicLinkUrl),
    text: createMagicLinkEmailText(magicLinkUrl),
  };

  try {
    const response = await fetch("https://api.mailersend.com/v1/email", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new MailerSendError(
        `MailerSend API error: ${response.status} ${response.statusText}`,
        response.status,
        errorData
      );
    }

    const result: MailerSendResponse = await response.json();

    // Log success for debugging (remove in production)
    console.log("Magic link email sent successfully:", result.message);
  } catch (error) {
    if (error instanceof MailerSendError) {
      throw error;
    }

    // Handle network errors or other unexpected errors
    throw new MailerSendError(
      `Failed to send magic link email: ${error instanceof Error ? error.message : "Unknown error"}`,
      undefined,
      error
    );
  }
}

function createMagicLinkEmailTemplate(magicLinkUrl: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Sign in to Tchoupitoulas Data Challenge</title>
        <style>
          .container {
            max-width: 600px;
            margin: 0 auto;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .header {
            background: linear-gradient(135deg, #10b981, #f472b6);
            padding: 30px 20px;
            text-align: center;
            color: white;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: bold;
          }
          .content {
            padding: 40px 30px;
            background: #ffffff;
          }
          .content h2 {
            color: #1f2937;
            font-size: 24px;
            margin-bottom: 20px;
          }
          .content p {
            color: #4b5563;
            margin-bottom: 20px;
          }
          .cta-container {
            text-align: center;
            margin: 40px 0;
          }
          .cta-button {
            display: inline-block;
            background: #10b981;
            color: white;
            padding: 16px 32px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            font-size: 16px;
            transition: background-color 0.2s;
          }
          .cta-button:hover {
            background: #059669;
          }
          .security-note {
            background: #f3f4f6;
            padding: 20px;
            border-radius: 8px;
            margin: 30px 0;
            border-left: 4px solid #10b981;
          }
          .security-note p {
            margin: 0;
            color: #374151;
            font-size: 14px;
          }
          .footer {
            text-align: center;
            padding: 30px 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 12px;
          }
          .footer a {
            color: #10b981;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Tchoupitoulas Data Challenge</h1>
          </div>

          <div class="content">
            <h2>Sign in to your account</h2>
            <p>Click the button below to securely sign in to your Tchoupitoulas Data Challenge account:</p>

            <div class="cta-container">
              <a href="${magicLinkUrl}" class="cta-button">Sign In Now</a>
            </div>

            <div class="security-note">
              <p><strong>Security Notice:</strong> This magic link will expire in 24 hours for your protection. If you didn't request this sign-in link, you can safely ignore this email.</p>
            </div>

            <p>Having trouble with the button? Copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #6b7280; font-size: 14px;">${magicLinkUrl}</p>
          </div>

          <div class="footer">
            <p>
              Tchoupitoulas Data Challenge<br>
              <a href="https://tchoupitoulas-data-challenge.vercel.app">Visit our website</a>
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}

function createMagicLinkEmailText(magicLinkUrl: string): string {
  return `
Sign in to Tchoupitoulas Data Challenge

Click the link below to securely sign in to your account:
${magicLinkUrl}

This magic link will expire in 24 hours for your security.

If you didn't request this sign-in link, you can safely ignore this email.

--
Tchoupitoulas Data Challenge
https://tchoupitoulas-data-challenge.vercel.app
  `.trim();
}
