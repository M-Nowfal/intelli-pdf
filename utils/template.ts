export function emailTemplate(otp: string) {
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
          <!-- Logo/Header -->
          <tr>
            <td align="center" style="padding: 0 0 40px 0;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #000000; letter-spacing: -0.5px;">
                Intelli-PDF
              </h1>
            </td>
          </tr>
          
          <!-- Main Content -->
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
          
          <!-- OTP Code Box -->
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
          
          <!-- Expiry Info -->
          <tr>
            <td style="padding: 0 0 32px 0;">
              <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #666666; text-align: center;">
                This code will expire in 10 minutes.
              </p>
            </td>
          </tr>
          
          <!-- Divider -->
          <tr>
            <td style="padding: 0 0 32px 0;">
              <div style="border-top: 1px solid #e5e5e5;"></div>
            </td>
          </tr>
          
          <!-- Security Notice -->
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
          
          <!-- Footer -->
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