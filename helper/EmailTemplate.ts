export const passwordResetTemplate = ({
  name,
  appName,
  homeUrl,
  resetUrl,
}: {
  name: string;
  appName: string;
  homeUrl: string;
  resetUrl: string;
}) => {
  return `
  <html>
  <head>
    <style type="text/css" rel="stylesheet" media="all">
      @import url("https://fonts.googleapis.com/css?family=Nunito+Sans:400,700&display=swap");
      
      body {
        width: 100% !important;
        height: 100%;
        margin: 0;
        -webkit-text-size-adjust: none;
        font-family: "Nunito Sans", Helvetica, Arial, sans-serif;
        background-color: #F2F4F6;
        color: #51545E;
      }
      
      a {
        color: #ffffff !important;
        text-decoration: none;
      }
      
      .preheader {
        display: none !important;
        visibility: hidden;
        mso-hide: all;
        font-size: 1px;
        line-height: 1px;
        max-height: 0;
        max-width: 0;
        opacity: 0;
        overflow: hidden;
      }
      
      td,
      th {
        font-size: 16px;
      }
      
      p,
      ul,
      ol,
      blockquote {
        margin: .4em 0 1.1875em;
        font-size: 16px;
        line-height: 1.625;
        color: #51545E;
      }
      
      .button {
        background-color: #3869D4;
        color: #FFF;
        text-decoration: none;
        border-radius: 3px;
        box-shadow: 0 2px 3px rgba(0, 0, 0, 0.16);
        -webkit-text-size-adjust: none;
        box-sizing: border-box;
        display: inline-block;
        padding: 10px 18px;
      }
      
      .email-wrapper {
        width: 100%;
        margin: 0;
        padding: 0;
        -premailer-width: 100%;
        -premailer-cellpadding: 0;
        -premailer-cellspacing: 0;
        background-color: #F2F4F6;
      }
      
      .email-masthead {
        padding: 25px 0;
        text-align: center;
      }
      
      .email-masthead_name {
        font-size: 16px;
        font-weight: bold;
        color: #A8AAAF;
        text-decoration: none;
        text-shadow: 0 1px 0 white;
      }
      
      .email-body {
        width: 100%;
        margin: 0;
        padding: 0;
        -premailer-width: 100%;
        -premailer-cellpadding: 0;
        -premailer-cellspacing: 0;
      }
      
      .email-body_inner {
        width: 570px;
        margin: 0 auto;
        padding: 0;
        -premailer-width: 570px;
        -premailer-cellpadding: 0;
        -premailer-cellspacing: 0;
        background-color: #FFFFFF;
      }
      
      .email-footer {
        width: 570px;
        margin: 0 auto;
        padding: 0;
        -premailer-width: 570px;
        -premailer-cellpadding: 0;
        -premailer-cellspacing: 0;
        text-align: center;
      }
      
      .email-footer p {
        color: #A8AAAF;
      }
      
      .body-action {
        width: 100%;
        margin: 30px auto;
        padding: 0;
        -premailer-width: 100%;
        -premailer-cellpadding: 0;
        -premailer-cellspacing: 0;
        text-align: center;
      }
      
      .body-sub {
        margin-top: 25px;
        padding-top: 25px;
        border-top: 1px solid #EAEAEC;
      }
      
      .content-cell {
        padding: 45px;
      }
    </style>
  </head>
  <body>
    <span class="preheader">Use this link to reset your password. The link is only valid for 2 hours.</span>
    <table class="email-wrapper" width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td align="center">
          <table class="email-content" width="100%" cellpadding="0" cellspacing="0" role="presentation">
            <tr>
              <td class="email-masthead">
                <a href="${homeUrl}" class="f-fallback email-masthead_name">${appName}</a>
              </td>
            </tr>
            <!-- Email Body -->
            <tr>
              <td class="email-body" width="570" cellpadding="0" cellspacing="0">
                <table class="email-body_inner" align="center" width="570" cellpadding="0" cellspacing="0" role="presentation">
                  <!-- Body content -->
                  <tr>
                    <td class="content-cell">
                      <h1>Hi ${name},</h1>
                      <p>You recently requested to reset your password for your ${appName} account. Use the button below to reset it. <strong>This password reset is only valid for the next 2 hours.</strong></p>
                      <table class="body-action" align="center" width="100%" cellpadding="0" cellspacing="0" role="presentation">
                        <tr>
                          <td align="center">
                            <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                              <tr>
                                <td align="center">
                                  <a href="${resetUrl}" class="f-fallback button button--green" target="_blank">Reset your password</a>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                      <p>If you did not request a password reset, please ignore this email.</p>
                      <p>Thanks,<br>The ${appName} team</p>
                      <!-- Sub copy -->
                      <table class="body-sub" role="presentation">
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
};
export const orderConfirmationTemplate = (name: string, orderId: string, products: Array<{name: string, price: number, quantity: number}>, total: number) => {
  const productRows = products.map(p => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${p.name}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align:center;">${p.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align:right;">₹${p.price * p.quantity}</td>
    </tr>
  `).join("");

  return `
  <html>
  <body style="font-family: 'Nunito Sans', Helvetica, Arial, sans-serif; background-color: #F2F4F6; color: #51545E;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr><td align="center">
        <table width="570" cellpadding="0" cellspacing="0" style="background:#fff; margin:30px auto; border-radius:8px;">
          <tr><td style="padding:30px; text-align:center; background:#0f172a; border-radius:8px 8px 0 0;">
            <h1 style="color:#fff; margin:0;">Student Note Books</h1>
          </td></tr>
          <tr><td style="padding:40px;">
            <h2>Order Confirmed! 🎉</h2>
            <p>Hi ${name}, your order has been placed successfully.</p>
            <p><strong>Order ID:</strong> ${orderId}</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0; border:1px solid #eee; border-radius:4px;">
              <tr style="background:#f8f8f8;">
                <th style="padding:10px; text-align:left;">Product</th>
                <th style="padding:10px; text-align:center;">Qty</th>
                <th style="padding:10px; text-align:right;">Price</th>
              </tr>
              ${productRows}
              <tr>
                <td colspan="2" style="padding:10px; font-weight:bold;">Total</td>
                <td style="padding:10px; text-align:right; font-weight:bold;">₹${total}</td>
              </tr>
            </table>
            <p>Thank you for shopping with us!</p>
            <p>Thanks,<br>Student Note Books Team</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
  </html>
  `;
};

export const welcomeEmailTemplate = (name: string, websiteUrl: string) => {
  return `
  <html>
  <body style="font-family: 'Nunito Sans', Helvetica, Arial, sans-serif; background-color: #F2F4F6; color: #51545E;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr><td align="center">
        <table width="570" cellpadding="0" cellspacing="0" style="background:#fff; margin:30px auto; border-radius:8px;">
          <tr><td style="padding:30px; text-align:center; background:#0f172a; border-radius:8px 8px 0 0;">
            <h1 style="color:#fff; margin:0;">Student Note Books</h1>
          </td></tr>
          <tr><td style="padding:40px;">
            <h2>Welcome, ${name}! 🎒</h2>
            <p>Thank you for creating an account with Student Note Books.</p>
            <p>We have everything you need for your studies - notebooks, pens, stationery and more.</p>
            <a href="${websiteUrl}" style="display:inline-block; padding:12px 24px; background:#0f172a; color:#fff; text-decoration:none; border-radius:6px; margin:20px 0;">Start Shopping</a>
            <p>Thanks,<br>Student Note Books Team</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
  </html>
  `;
};
