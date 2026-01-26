import { APP_URL } from "./constants";

export function otpMailTemplate(otp: string) {
  return (`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verification Code</title>
</head>
<body style="margin: 0; padding: 0; background-color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="100%" style="max-width: 600px;" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td align="center" style="padding: 0 0 40px 0;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #000000; letter-spacing: -0.5px;">
                Intelli-PDF
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 0 32px 0;">
              <h2 style="margin: 0 0 16px 0; font-size: 28px; font-weight: 600; color: #000000; letter-spacing: -0.5px; line-height: 1.3;">
                Verify your email address
              </h2>
              <p style="margin: 0; font-size: 16px; line-height: 1.5; color: #666666;">
                To continue setting up your Intelli-PDF account, please verify your email address by entering the code below.
              </p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 0 0 32px 0;">
              <table cellpadding="0" cellspacing="0" border="0" style="background-color: #f5f5f7; border-radius: 12px; padding: 32px 48px;">
                <tr>
                  <td align="center">
                    <div style="font-size: 36px; font-weight: bold; color: #000000; letter-spacing: 8px; font-family: 'Courier New', Courier, monospace;">
                      ${otp}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 0 32px 0;">
              <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #666666; text-align: center;">
                This code will expire in 10 minutes.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 0 32px 0;">
              <div style="border-top: 1px solid #e5e5e5;"></div>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 0 32px 0;">
              <p style="margin: 0 0 12px 0; font-size: 14px; line-height: 1.5; color: #666666;">
                If you didn't request this code, you can safely ignore this email. Someone else might have typed your email address by mistake.
              </p>
              <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #666666;">
                For security reasons, please do not share this code with anyone.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px 0 0 0; border-top: 1px solid #e5e5e5;">
              <p style="margin: 0 0 8px 0; font-size: 12px; line-height: 1.5; color: #999999;">
                This email was sent to verify your identity. If you have questions, contact us at 
                <a href="mailto:intellipdf2026@gmail.com" style="color: #000000; text-decoration: none;">intellipdf2026@gmail.com</a>
              </p>
              <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #999999;">
                © ${new Date().getFullYear()} Intelli-PDF. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`);
}

export function creditAwardMailTemplate(name: string) {
  return (`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Credits Received</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #ffffff; margin: 0; padding: 0; color: #1a1a1a; }
    .container { max-width: 480px; margin: 0 auto; padding: 40px 20px; }
    .btn { background-color: #000000; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 500; display: inline-block; font-size: 14px; }
    .btn:hover { background-color: #333333; }
    .stat-box { border: 1px solid #e5e5e5; border-radius: 8px; padding: 24px; text-align: center; margin: 24px 0; }
    .footer { font-size: 12px; color: #888888; margin-top: 40px; border-top: 1px solid #eaeaea; padding-top: 20px; }
    .link { color: #888888; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <div style="margin-bottom: 32px;">
      <span style="font-weight: 700; font-size: 16px; letter-spacing: -0.5px;">Intelli-PDF</span>
    </div>
    <h1 style="font-size: 24px; font-weight: 600; letter-spacing: -0.5px; margin-bottom: 16px; color: #000;">
      Referral Bonus
    </h1>
    <p style="font-size: 15px; line-height: 1.6; color: #444; margin-bottom: 24px;">
      Hi ${name},
    </p>
    <p style="font-size: 15px; line-height: 1.6; color: #444; margin-bottom: 24px;">
      Your friend just created an account using your invite link. As a thank you, we have added bonus credits to your account.
    </p>
    <div class="stat-box">
      <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #666; margin-bottom: 8px;">
        Credit Balance Adjustment
      </div>
      <div style="font-size: 32px; font-weight: 700; color: #000; letter-spacing: -1px;">
        +500
      </div>
    </div>
    <p style="font-size: 15px; line-height: 1.6; color: #444; margin-bottom: 32px;">
      These credits are available immediately for use on your next document summary or quiz generation.
    </p>
    <div style="text-align: center;">
      <a href="${APP_URL}/settings?tab=billing" class="btn" style="width: 90%;">
        View Account
      </a>
    </div>
    <div class="footer">
      <p>
        Sent by Intelli-PDF • <a href="${APP_URL}" class="link">Generate more invites</a>
      </p>
    </div>
  </div>
</body>
</html>
  `);
}