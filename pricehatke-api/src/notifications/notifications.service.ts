import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private resend: Resend | null = null;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    if (apiKey && apiKey.trim() !== '' && apiKey !== 'replace_me') {
      this.resend = new Resend(apiKey);
    }
  }

  async sendEmail(options: SendEmailOptions): Promise<{ success: boolean; id?: string }> {
    if (!this.resend) {
      this.logger.log(
        `[DEV MODE - RESEND_API_KEY NOT SET] Would send email:
        TO: ${options.to}
        SUBJECT: ${options.subject}
        HTML: ${options.html.slice(0, 150)}...`,
      );
      return { success: true, id: `dev_mock_${Date.now()}` };
    }

    try {
      const response = await this.resend.emails.send({
        from: 'PriceHatke <alerts@pricehatke.com>',
        to: options.to,
        subject: options.subject,
        html: options.html,
      });

      if (response.error) {
        this.logger.error(`Failed to send email via Resend: ${response.error.message}`);
        return { success: false };
      }

      return { success: true, id: response.data?.id };
    } catch (error: any) {
      this.logger.error(`Error sending email: ${error?.message || error}`);
      return { success: false };
    }
  }

  async sendPriceAlertEmail(email: string, productTitle: string, currentPrice: number, targetPrice?: number) {
    const subject = `🔥 Price Drop Alert: ${productTitle} is now ₹${currentPrice}!`;
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #ff6b00;">PriceHatke Drop Alert!</h2>
        <p>Great news! The product you are tracking has dropped in price.</p>
        <div style="background: #f8f9fa; border-left: 4px solid #ff6b00; padding: 15px; margin: 15px 0;">
          <h3 style="margin: 0 0 10px 0;">${productTitle}</h3>
          <p style="font-size: 20px; font-weight: bold; color: #16a34a; margin: 0;">
            Current Price: ₹${currentPrice.toLocaleString('en-IN')}
          </p>
          ${targetPrice ? `<p style="margin: 5px 0 0 0; color: #666;">Your Target Price: ₹${targetPrice.toLocaleString('en-IN')}</p>` : ''}
        </div>
        <p><a href="http://localhost:3000" style="display: inline-block; background: #ff6b00; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Price History & Buy</a></p>
      </div>
    `;

    return this.sendEmail({ to: email, subject, html });
  }

  async sendWelcomeEmail(email: string, name?: string) {
    const subject = 'Welcome to PriceHatke! Start tracking deals today 🎉';
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #ff6b00;">Welcome to PriceHatke, ${name || 'Shopper'}!</h2>
        <p>You're now ready to track price histories, set drop alerts, and discover genuine deals.</p>
      </div>
    `;

    return this.sendEmail({ to: email, subject, html });
  }
}
