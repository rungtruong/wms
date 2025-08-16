import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

interface TicketEmailData {
  id: string;
  ticketNumber: string;
  customerEmail: string;
  customerName: string;
  issueDescription: string;
  status: string;
  createdAt: string;
  resolvedAt?: string;
  assignedTechnician?: {
    fullName: string;
    email: string;
  };
  product?: {
    name: string;
    serial: string;
  };
}

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST'),
      port: this.configService.get('SMTP_PORT'),
      secure: false,
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASS'),
      },
    });
  }

  async sendTicketNotification(ticketData: TicketEmailData, emailType: 'created' | 'updated' | 'assigned' | 'resolved' | 'closed' = 'updated') {
    const subject = this.getEmailSubject(ticketData, emailType);
    const html = this.generateEmailTemplate(ticketData, emailType);

    const mailOptions = {
      from: this.configService.get('SMTP_FROM'),
      to: ticketData.customerEmail,
      subject,
      html,
    };

    return await this.transporter.sendMail(mailOptions);
  }

  private getEmailSubject(ticketData: TicketEmailData, emailType: string): string {
    const subjects = {
      'created': `Yêu cầu bảo hành #${ticketData.ticketNumber} đã được tiếp nhận`,
      'updated': `Cập nhật yêu cầu bảo hành #${ticketData.ticketNumber}`,
      'assigned': `Kỹ thuật viên đã được phân công cho yêu cầu #${ticketData.ticketNumber}`,
      'resolved': `Yêu cầu bảo hành #${ticketData.ticketNumber} đã được hoàn thành`,
      'closed': `Yêu cầu bảo hành #${ticketData.ticketNumber} đã được đóng`
    };
    return subjects[emailType] || subjects['updated'];
  }

  private generateEmailTemplate(ticketData: TicketEmailData, emailType: string): string {
    const statusText = this.getStatusText(ticketData.status);
    const statusColor = this.getStatusColor(ticketData.status);
    
    return `
      <!DOCTYPE html>
      <html lang="vi">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>WMS - Thông báo bảo hành</title>
        <style>
          @media only screen and (max-width: 600px) {
            .container { width: 100% !important; padding: 10px !important; }
            .header { padding: 20px 15px !important; }
            .content { padding: 15px !important; }
            .info-card { padding: 15px !important; }
          }
        </style>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f7fa;">
        <div class="container" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <div class="header" style="background: linear-gradient(135deg, #21808D 0%, #1a6b75 100%); color: white; padding: 30px 20px; text-align: center;">
            <div style="font-size: 28px; font-weight: bold; margin-bottom: 8px;">WMS</div>
            <div style="font-size: 16px; opacity: 0.9;">Hệ thống quản lý bảo hành</div>
          </div>

          <!-- Main Content -->
          <div class="content" style="padding: 30px 20px;">
            
            <!-- Title -->
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2d3748; font-size: 24px; margin: 0 0 10px 0; font-weight: 600;">
                ${this.getEmailTitle(emailType)}
              </h1>
              <div style="width: 60px; height: 3px; background: linear-gradient(90deg, #21808D, #4299e1); margin: 0 auto;"></div>
            </div>

            <!-- Status Badge -->
            <div style="text-align: center; margin-bottom: 25px;">
              <span style="display: inline-block; padding: 8px 20px; background-color: ${statusColor}; color: white; border-radius: 20px; font-weight: 600; font-size: 14px;">
                ${statusText}
              </span>
            </div>

            <!-- Ticket Information Card -->
            <div class="info-card" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 25px; margin-bottom: 25px;">
              <h3 style="color: #2d3748; margin: 0 0 20px 0; font-size: 18px; font-weight: 600;">Thông tin yêu cầu</h3>
              
              <div style="display: grid; gap: 15px;">
                <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
                  <span style="color: #4a5568; font-weight: 500;">Mã yêu cầu:</span>
                  <span style="color: #2d3748; font-weight: 600;">#${ticketData.ticketNumber}</span>
                </div>
                
                <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
                  <span style="color: #4a5568; font-weight: 500;">Khách hàng:</span>
                  <span style="color: #2d3748; font-weight: 600;">${ticketData.customerName}</span>
                </div>
                
                ${ticketData.product ? `
                <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
                  <span style="color: #4a5568; font-weight: 500;">Sản phẩm:</span>
                  <span style="color: #2d3748; font-weight: 600;">${ticketData.product.name}</span>
                </div>
                
                <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
                  <span style="color: #4a5568; font-weight: 500;">Số serial:</span>
                  <span style="color: #2d3748; font-weight: 600;">${ticketData.product.serial}</span>
                </div>
                ` : ''}
                
                <div style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
                  <span style="color: #4a5568; font-weight: 500; display: block; margin-bottom: 8px;">Mô tả vấn đề:</span>
                  <span style="color: #2d3748; line-height: 1.6;">${ticketData.issueDescription}</span>
                </div>
                
                <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
                  <span style="color: #4a5568; font-weight: 500;">Ngày tạo:</span>
                  <span style="color: #2d3748; font-weight: 600;">${new Date(ticketData.createdAt).toLocaleDateString('vi-VN', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</span>
                </div>
                
                ${ticketData.assignedTechnician ? `
                <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
                  <span style="color: #4a5568; font-weight: 500;">Kỹ thuật viên:</span>
                  <span style="color: #2d3748; font-weight: 600;">${ticketData.assignedTechnician.fullName}</span>
                </div>
                ` : ''}
                
                ${ticketData.resolvedAt ? `
                <div style="display: flex; justify-content: space-between; padding: 10px 0;">
                  <span style="color: #4a5568; font-weight: 500;">Ngày hoàn thành:</span>
                  <span style="color: #2d3748; font-weight: 600;">${new Date(ticketData.resolvedAt).toLocaleDateString('vi-VN', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</span>
                </div>
                ` : ''}
              </div>
            </div>

            <!-- Message Card -->
            <div style="background: linear-gradient(135deg, #e6fffa 0%, #f0fff4 100%); border-left: 4px solid #21808D; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
              <p style="margin: 0 0 10px 0; color: #2d3748; font-size: 16px; line-height: 1.6;">
                ${this.getEmailMessage(emailType, ticketData)}
              </p>
            </div>

            <!-- Contact Information -->
            <div style="background-color: #f7fafc; border-radius: 8px; padding: 20px; text-align: center;">
              <h4 style="color: #2d3748; margin: 0 0 15px 0; font-size: 16px;">Cần hỗ trợ?</h4>
              <p style="margin: 0 0 10px 0; color: #4a5568;">Liên hệ với chúng tôi:</p>
              <div style="color: #21808D; font-weight: 600;">
                📞 Hotline: 1900-xxxx<br>
                📧 Email: support@wms.com<br>
                🕒 Thời gian: 8:00 - 17:30 (T2-T6)
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div style="background-color: #2d3748; color: #a0aec0; text-align: center; padding: 20px;">
            <p style="margin: 0 0 10px 0; font-size: 14px;">© 2024 WMS - Hệ thống quản lý bảo hành</p>
            <p style="margin: 0; font-size: 12px; opacity: 0.8;">Email này được gửi tự động, vui lòng không trả lời trực tiếp.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private getEmailTitle(emailType: string): string {
    const titles = {
      'created': 'Yêu cầu bảo hành đã được tiếp nhận',
      'updated': 'Cập nhật trạng thái yêu cầu',
      'assigned': 'Kỹ thuật viên đã được phân công',
      'resolved': 'Yêu cầu đã được hoàn thành',
      'closed': 'Yêu cầu đã được đóng'
    };
    return titles[emailType] || titles['updated'];
  }

  private getEmailMessage(emailType: string, ticketData: TicketEmailData): string {
    const messages = {
      'created': `Chúng tôi đã tiếp nhận yêu cầu bảo hành của quý khách. Chúng tôi sẽ xử lý và phản hồi trong thời gian sớm nhất.`,
      'updated': `Trạng thái yêu cầu bảo hành của quý khách đã được cập nhật. Vui lòng kiểm tra thông tin chi tiết ở trên.`,
      'assigned': `Kỹ thuật viên ${ticketData.assignedTechnician?.fullName || ''} đã được phân công xử lý yêu cầu của quý khách.`,
      'resolved': `Yêu cầu bảo hành của quý khách đã được hoàn thành thành công. Cảm ơn quý khách đã tin tưởng sử dụng dịch vụ của chúng tôi.`,
      'closed': `Yêu cầu bảo hành của quý khách đã được đóng. Nếu có thắc mắc, vui lòng liên hệ với chúng tôi.`
    };
    return messages[emailType] || messages['updated'];
  }

  private getStatusText(status: string): string {
    const statusMap = {
      'new': 'Tiếp nhận',
      'received': 'Tiếp nhận',
      'in_progress': 'Đang xử lý',
      'resolved': 'Đã giải quyết',
      'closed': 'Đã đóng'
    };
    return statusMap[status] || status;
  }

  private getStatusColor(status: string): string {
    const colorMap = {
      'new': '#805ad5',
      'received': '#3182ce',
      'in_progress': '#d69e2e',
      'resolved': '#38a169',
      'closed': '#718096'
    };
    return colorMap[status] || '#718096';
  }
}