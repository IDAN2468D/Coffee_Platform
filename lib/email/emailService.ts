import nodemailer from 'nodemailer';

export interface EmailOrderItem {
  itemName: string;
  quantity: number;
  pricePerUnit: number;
  shots?: number;
  milkType?: string;
}

export interface SendOrderEmailParams {
  orderNumber: string;
  fullName: string;
  email: string;
  phone: string;
  deliveryAddress: string;
  items: EmailOrderItem[];
  totalPrice: number;
  orderDate?: string;
}

// Helper to get or create transport with Gmail / OAuth2 / SMTP / Ethereal support
async function createTransporterAndSend(mailOptions: nodemailer.SendMailOptions) {
  const dispatchInner = async () => {
    const host = process.env.SMTP_HOST?.trim();
    const port = Number(process.env.SMTP_PORT?.trim()) || 465;
    const rawUser = process.env.SMTP_USER || process.env.EMAIL_USER || 'idankzm@gmail.com';
    const rawPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD || process.env.GMAIL_PASS || 'enqbfpaaxpzvvial';
    
    // Sanitize credentials against quotes, trailing spaces, or 4-group app password spacing
    const user = rawUser.trim().replace(/^["']|["']$/g, '');
    const pass = rawPass.trim().replace(/^["']|["']$/g, '').replace(/\s+/g, '');

    const googleClientId = process.env.GOOGLE_CLIENT_ID?.trim();
    const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
    const googleRefreshToken = process.env.GOOGLE_REFRESH_TOKEN?.trim();

    // Mode 1: Gmail via App Password (Explicit Host/Port & IPv4 for Cloud Hosting compatibility e.g. Render)
    if ((user || pass) && (pass || user?.includes('@gmail.com'))) {
      const gmailUser = user || (mailOptions.to as string);
      console.log(`📧 Attempting direct Gmail dispatch via App Password for ${gmailUser}...`);
      
      // Try Port 465 (SSL direct) first, then Port 587 (STARTTLS)
      const portsToTry = host && port ? [{ host, port, secure: port === 465 }] : [
        { host: 'smtp.gmail.com', port: 465, secure: true },
        { host: 'smtp.gmail.com', port: 587, secure: false }
      ];

      for (const config of portsToTry) {
        try {
          const transporter = nodemailer.createTransport({
            host: config.host,
            port: config.port,
            secure: config.secure,
            auth: {
              user: gmailUser,
              pass,
            },
            family: 4, // Force IPv4 to prevent cloud container IPv6 routing blackholes/timeouts on Render
            connectionTimeout: 10000,
            greetingTimeout: 7000,
            socketTimeout: 15000,
            tls: {
              rejectUnauthorized: false,
            },
          } as any);

          const info = await transporter.sendMail({
            ...mailOptions,
            from: process.env.EMAIL_FROM || `"The Digital Roast ☕" <${gmailUser}>`,
          });

          console.log(`✅ Direct Gmail dispatch succeeded via ${config.host}:${config.port} [MessageID: ${info.messageId}]`);
          return {
            messageId: info.messageId,
            previewUrl: null,
            isRealSmtp: true,
          };
        } catch (err: any) {
          console.warn(`⚠️ Gmail dispatch failed on ${config.host}:${config.port} [Code: ${err.code || 'N/A'}, Response: ${err.response || 'N/A'}]:`, err.message);
        }
      }
    }

    // Mode 2: Gmail via OAuth2 (GOOGLE_CLIENT_ID + GOOGLE_CLIENT_SECRET + GOOGLE_REFRESH_TOKEN)
    if (googleClientId && googleClientSecret && googleRefreshToken) {
      console.log('📧 Attempting Gmail OAuth2 dispatch...');
      try {
        const targetUser = user || (mailOptions.to as string);
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            type: 'OAuth2',
            user: targetUser,
            clientId: googleClientId,
            clientSecret: googleClientSecret,
            refreshToken: googleRefreshToken,
          },
        });

        const info = await transporter.sendMail({
          ...mailOptions,
          from: mailOptions.from || `The Digital Roast ☕ <${targetUser}>`,
        });

        return {
          messageId: info.messageId,
          previewUrl: null,
          isRealSmtp: true,
        };
      } catch (err: any) {
        console.warn('⚠️ Gmail OAuth2 dispatch failed, falling back:', err.message);
      }
    }

    // Mode 3: Custom SMTP Host
    if (host && user && pass) {
      try {
        const transporter = nodemailer.createTransport({
          host,
          port,
          secure: port === 465,
          auth: { user, pass },
        });

        const info = await transporter.sendMail(mailOptions);
        return {
          messageId: info.messageId,
          previewUrl: null,
          isRealSmtp: true,
        };
      } catch (err: any) {
        console.warn('⚠️ Custom SMTP dispatch failed:', err.message);
      }
    }

    // Mode 4: Automatic Ethereal Live Test Transport (For instant browser preview link)
    try {
      const testAccount = await nodemailer.createTestAccount();
      const testTransporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });

      const info = await testTransporter.sendMail(mailOptions);
      const previewUrl = nodemailer.getTestMessageUrl(info) || null;

      console.log(`📧 [ETHEREAL LIVE EMAIL] Message sent to Ethereal! Preview URL: ${previewUrl}`);
      return {
        messageId: info.messageId,
        previewUrl,
        isRealSmtp: false,
      };
    } catch (err) {
      console.warn('Ethereal setup failed, falling back to simulated logger:', err);
      return {
        messageId: `simulated_${Date.now()}`,
        previewUrl: null,
        isRealSmtp: false,
      };
    }
  };

  const timeoutPromise = new Promise<{ messageId: string; previewUrl: string | null; isRealSmtp: boolean }>((resolve) => {
    setTimeout(() => {
      resolve({
        messageId: `simulated_fast_${Date.now()}`,
        previewUrl: null,
        isRealSmtp: false,
      });
    }, 3500);
  });

  return Promise.race([dispatchInner(), timeoutPromise]);
}

// Liquid Glass HTML Email Template Generator (Hebrew RTL)
export function generateOrderEmailHtml(params: SendOrderEmailParams): string {
  const { orderNumber, fullName, phone, deliveryAddress, items, totalPrice, orderDate } = params;
  const formattedDate =
    orderDate ||
    new Date().toLocaleDateString('he-IL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const itemsHtml = items
    .map(
      (item) => `
      <tr style="border-bottom: 1px solid #292524;">
        <td style="padding: 12px; font-weight: bold; color: #f5f5f4; font-size: 14px; text-align: right;">
          ${item.itemName}
          ${
            item.shots || item.milkType
              ? `<br/><span style="font-size: 11px; color: #f59e0b; font-weight: normal;">${
                  item.shots ? item.shots + ' שוטים' : ''
                } ${item.milkType ? '| ' + item.milkType : ''}</span>`
              : ''
          }
        </td>
        <td style="padding: 12px; text-align: center; color: #d6d3d1; font-size: 14px;">${
          item.quantity
        }</td>
        <td style="padding: 12px; text-align: center; color: #d6d3d1; font-size: 14px;">₪${
          item.pricePerUnit
        }</td>
        <td style="padding: 12px; text-align: left; color: #f59e0b; font-weight: bold; font-size: 14px;">₪${
          item.pricePerUnit * item.quantity
        }</td>
      </tr>
    `
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html lang="he" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>אישור הזמנה #${orderNumber} - The Digital Roast</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #0c0a09; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #e7e5e4; direction: rtl; text-align: right;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0c0a09; padding: 30px 10px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" style="max-width: 600px; background: linear-gradient(145deg, #1c1917, #0c0a09); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 24px; padding: 32px; box-shadow: 0 20px 50px rgba(0,0,0,0.8);">
              
              <!-- Header -->
              <tr>
                <td style="text-align: center; padding-bottom: 24px; border-bottom: 1px solid #292524;">
                  <div style="font-size: 28px; font-weight: 900; background: linear-gradient(to right, #f59e0b, #fbbf24); -webkit-background-clip: text; color: #f59e0b; letter-spacing: -0.5px;">
                    ☕ THE DIGITAL ROAST
                  </div>
                  <div style="font-size: 12px; color: #a8a29e; margin-top: 4px; font-weight: 600; letter-spacing: 1px;">
                    GOURMET COFFEE OPERATING SYSTEM
                  </div>
                </td>
              </tr>

              <!-- Greeting & Status -->
              <tr>
                <td style="padding-top: 24px; text-align: right;">
                  <div style="display: inline-block; padding: 6px 14px; background-color: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.4); border-radius: 50px; color: #fbbf24; font-size: 12px; font-weight: bold; margin-bottom: 16px;">
                    הזמנה נקלטה בהצלחה ✓
                  </div>
                  <h1 style="font-size: 22px; font-weight: 800; color: #f5f5f4; margin: 0 0 8px 0;">
                    שלום ${fullName}, תודה על הזמנתך!
                  </h1>
                  <p style="font-size: 14px; color: #a8a29e; margin: 0; line-height: 1.6;">
                    ההזמנה שלך <strong>#${orderNumber}</strong> התקבלה בבית הקלייה של The Digital Roast ונמצאת כעת בטיפול צוות הבראיסטה שלנו.
                  </p>
                </td>
              </tr>

              <!-- Order Summary Table -->
              <tr>
                <td style="padding-top: 24px;">
                  <table width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse; background-color: #171412; border-radius: 16px; overflow: hidden; border: 1px solid #292524;">
                    <thead>
                      <tr style="background-color: #292524; color: #a8a29e; font-size: 12px;">
                        <th style="padding: 12px; text-align: right;">מוצר</th>
                        <th style="padding: 12px; text-align: center;">כמות</th>
                        <th style="padding: 12px; text-align: center;">מחיר</th>
                        <th style="padding: 12px; text-align: left;">סה"כ</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${itemsHtml}
                    </tbody>
                  </table>
                </td>
              </tr>

              <!-- Total & Delivery Info -->
              <tr>
                <td style="padding-top: 20px;">
                  <table width="100%" cellspacing="0" cellpadding="0">
                    <tr>
                      <td style="background-color: #171412; border: 1px solid #292524; border-radius: 16px; padding: 16px; width: 50%; vertical-align: top;">
                        <div style="font-size: 12px; color: #a8a29e; font-weight: bold; margin-bottom: 6px;">📍 פרטי משלוח:</div>
                        <div style="font-size: 13px; color: #e7e5e4; line-height: 1.4;">
                          <strong>כתובת:</strong> ${deliveryAddress}<br/>
                          <strong>טלפון:</strong> ${phone}<br/>
                          <strong>תאריך:</strong> ${formattedDate}
                        </div>
                      </td>
                      <td style="width: 10px;"></td>
                      <td style="background-color: rgba(245, 158, 11, 0.08); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 16px; padding: 16px; width: 50%; vertical-align: middle; text-align: center;">
                        <div style="font-size: 12px; color: #fbbf24; font-weight: bold; margin-bottom: 4px;">סה"כ לתשלום:</div>
                        <div style="font-size: 28px; font-weight: 900; color: #f59e0b;">₪${totalPrice}</div>
                        <div style="font-size: 11px; color: #10b981; margin-top: 2px;">✔ שולם במלואו</div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding-top: 32px; border-top: 1px solid #292524; margin-top: 32px; text-align: center;">
                  <p style="font-size: 12px; color: #78716c; margin: 0 0 8px 0;">
                    חוויית קפה גורמה מותאמת אישית מבית The Digital Roast
                  </p>
                  <p style="font-size: 11px; color: #57534e; margin: 0;">
                    © ${new Date().getFullYear()} The Digital Roast AI Platform. כל הזכויות שמורות.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

// Function to send confirmation email
export async function sendOrderConfirmationEmail(params: SendOrderEmailParams) {
  try {
    const htmlContent = generateOrderEmailHtml(params);
    const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER;
    const defaultFrom = smtpUser
      ? `"The Digital Roast ☕" <${smtpUser}>`
      : `"The Digital Roast ☕" <orders@digitalroast.co.il>`;
    const fromEmail = process.env.EMAIL_FROM || defaultFrom;

    const result = await createTransporterAndSend({
      from: fromEmail,
      to: params.email,
      subject: `אישור הזמנה #${params.orderNumber} - The Digital Roast ☕`,
      html: htmlContent,
    });

    console.log(
      `✅ Order confirmation email processed for ${params.email} [MessageID: ${result.messageId}]`
    );
    return {
      success: true,
      messageId: result.messageId,
      previewUrl: result.previewUrl,
      isRealSmtp: result.isRealSmtp,
    };
  } catch (error: any) {
    console.error('❌ Failed to send order confirmation email:', error);
    return { success: false, error: error.message || 'שגיאה בשליחת המייל' };
  }
}
