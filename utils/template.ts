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

export function creditAwardMailTemplate(name: string) {
  return (`
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>You earned free credits!</title>
  <style>
    /* Basic Resets for Email Clients */
    body,
    table,
    td,
    a {
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }

    table,
    td {
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }

    img {
      -ms-interpolation-mode: bicubic;
    }

    img {
      border: 0;
      height: auto;
      line-height: 100%;
      outline: none;
      text-decoration: none;
    }

    table {
      border-collapse: collapse !important;
    }

    body {
      height: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
      width: 100% !important;
    }

    /* Button Hover Effect (Works in modern clients) */
    .btn:hover {
      background-color: #4338ca !important;
    }
  </style>
</head>

<body
  style="margin: 0; padding: 0; background-color: #f9fafb; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
      <td align="center" style="padding: 40px 0;">

        <table border="0" cellpadding="0" cellspacing="0" width="600"
          style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); max-width: 600px; width: 100%;">
          <tr>
            <td align="center" style="padding: 40px 30px;">

              <h2 style="color: #4f46e5; margin: 0 0 20px 0; font-size: 24px; font-weight: 700;">
                High five, ${name}! ✋
              </h2>

              <p style="color: #333333; font-size: 16px; line-height: 24px; margin: 0 0 20px 0;">
                Your friend just joined <strong>Intelli-PDF</strong> using your link.
              </p>

              <div
                style="background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 15px; border-radius: 8px; margin: 25px 0; text-align: center;">
                <span style="font-size: 18px; font-weight: bold; color: #166534; display: block;">
                  +500 Credits Added
                </span>
              </div>

              <p style="color: #4b5563; font-size: 16px; line-height: 24px; margin: 0 0 30px 0;">
                You can use these credits immediately to create more quizzes, summarize documents, and chat with your
                PDFs.
              </p>

              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <a href="${APP_URL}/settings?tab=billing" class="btn"
                      style="background-color: #4f46e5; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 16px;">
                      Check My Balance
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin-top: 30px; font-size: 12px; color: #9ca3af; text-align: center;">
                Keep sharing to earn unlimited rewards! <br>
                Intelli-PDF Team
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