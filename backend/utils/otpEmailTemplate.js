const escapeHtml = (value) =>
    String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');

const buildRegistrationOtpEmail = ({ name, email, otp }) => {
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeOtp = escapeHtml(otp);

    const text = [
        `Welcome to Swap Ecommerce Store, ${name}!`,
        '',
        'Thank you for registering with us.',
        '',
        `Your One-Time Password (OTP) is: ${otp}`,
        '',
        'Enter this code to complete your registration. Do not share this OTP with anyone.',
        '',
        `This email was sent to ${email}.`,
        '',
        'Swap Ecommerce Store',
    ].join('\n');

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Registration OTP</title>
  <style>
    @media only screen and (max-width: 620px) {
      .email-container { width: 100% !important; }
      .mobile-padding { padding-left: 16px !important; padding-right: 16px !important; }
      .otp-code { font-size: 28px !important; letter-spacing: 0.25em !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:Arial,Helvetica,sans-serif;color:#334155;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f1f5f9;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" class="email-container" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 24px rgba(15,23,42,0.08);">
          <tr>
            <td style="background:linear-gradient(135deg,#0f766e 0%,#0d9488 100%);padding:28px 32px;" class="mobile-padding">
              <p style="margin:0 0 6px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:rgba(255,255,255,0.85);">Swap Ecommerce Store</p>
              <h1 style="margin:0;font-size:24px;line-height:1.3;color:#ffffff;">Welcome aboard</h1>
              <p style="margin:10px 0 0;font-size:14px;color:rgba(255,255,255,0.92);">Complete your registration with the OTP below.</p>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 32px 12px;" class="mobile-padding">
              <p style="margin:0 0 12px;font-size:16px;line-height:1.6;color:#0f172a;">Hello <strong>${safeName}</strong>,</p>
              <p style="margin:0;font-size:14px;line-height:1.7;color:#475569;">Thank you for registering with Swap Ecommerce Store. Use the one-time password below to verify your account.</p>
            </td>
          </tr>

          <tr>
            <td style="padding:8px 32px 20px;" class="mobile-padding" align="center">
              <div style="display:inline-block;width:100%;max-width:360px;background:#f8fafc;border:1px dashed #0d9488;border-radius:14px;padding:24px 20px;text-align:center;">
                <p style="margin:0 0 10px;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#0f766e;">Your OTP Code</p>
                <p class="otp-code" style="margin:0;font-size:34px;font-weight:700;letter-spacing:0.35em;color:#0f172a;font-family:Consolas,Monaco,monospace;">${safeOtp}</p>
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding:0 32px 24px;" class="mobile-padding">
              <div style="background:#fffbeb;border:1px solid #fcd34d;border-radius:12px;padding:14px 16px;">
                <p style="margin:0;font-size:13px;line-height:1.6;color:#92400e;"><strong>Security tip:</strong> Never share this OTP with anyone. Our team will never ask for your OTP by phone or email.</p>
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding:0 32px 28px;" class="mobile-padding">
              <p style="margin:0;font-size:13px;line-height:1.6;color:#64748b;">This message was sent to <strong style="color:#334155;">${safeEmail}</strong>. If you did not create an account, you can safely ignore this email.</p>
            </td>
          </tr>

          <tr>
            <td style="padding:20px 32px 28px;background:#f8fafc;border-top:1px solid #e2e8f0;" class="mobile-padding">
              <p style="margin:0;font-size:13px;color:#0f172a;font-weight:600;">Swap Ecommerce Store</p>
              <p style="margin:6px 0 0;font-size:12px;color:#64748b;">Happy shopping!</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    return {
        subject: 'Welcome to Swap Ecommerce Store — Your OTP for registration',
        text,
        html,
    };
};

module.exports = {
    buildRegistrationOtpEmail,
};
