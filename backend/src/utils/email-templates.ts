import fs from 'fs'
import path from 'path'

interface TemplateData {
  [key: string]: string
}

const FALLBACK_TEMPLATES: Record<string, (data: TemplateData) => string> = {
  'verify-email.html': (data) => `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Xác nhận đăng ký - SKINDORA</title>
    </head>
    <body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #f5f5f5;">
      <div style="max-width: 500px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px;">
        <h1 style="color: #7355cd; text-align: center;">SKINDORA</h1>
        <h2>Xin chào ${data.first_name || 'bạn'},</h2>
        <p>Cảm ơn bạn đã đăng ký tài khoản SKINDORA. Vui lòng xác nhận email của bạn:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.verifyURL || '#'}" style="background: #7355cd; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Xác nhận đăng ký</a>
        </div>
        <p style="color: #666; font-size: 14px;">Trân trọng,<br>Đội ngũ SKINDORA</p>
      </div>
    </body>
    </html>
  `,

  'forgot-password.html': (data) => `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <title>Quên mật khẩu - SKINDORA</title>
    </head>
    <body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #f5f5f5;">
      <div style="max-width: 500px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px;">
        <h1 style="color: #7355cd; text-align: center;">SKINDORA</h1>
        <h2>Xin chào ${data.first_name || 'bạn'},</h2>
        <p>Bạn đã yêu cầu đặt lại mật khẩu. Nhấn vào nút bên dưới để tiếp tục:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.resetURL || '#'}" style="background: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Đặt lại mật khẩu</a>
        </div>
        <p style="color: #666; font-size: 14px;">Trân trọng,<br>Đội ngũ SKINDORA</p>
      </div>
    </body>
    </html>
  `,

  'welcome.html': (data) => `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <title>Chào mừng - SKINDORA</title>
    </head>
    <body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #f5f5f5;">
      <div style="max-width: 500px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px;">
        <h1 style="color: #7355cd; text-align: center;">SKINDORA</h1>
        <h2>Chào mừng ${data.first_name || 'bạn'} đến với SKINDORA!</h2>
        <p>Tài khoản của bạn đã được kích hoạt thành công. Hãy khám phá các tính năng tuyệt vời của chúng tôi!</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.loginURL || '#'}" style="background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Bắt đầu sử dụng</a>
        </div>
        <p style="color: #666; font-size: 14px;">Trân trọng,<br>Đội ngũ SKINDORA</p>
      </div>
    </body>
    </html>
  `,

  'google-register-success.html': (data) => `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <title>Chào mừng bạn đến với SKINDORA</title>
    </head>
    <body>
      <p>Xin chào ${data.userName || 'bạn'},</p>
      <p>Cảm ơn bạn đã đăng ký qua Google. Tài khoản của bạn đã được tạo.</p>
      <p>Đây là thông tin đăng nhập của bạn:</p>
      <ul>
        <li><strong>Email:</strong> ${data.email || ''}</li>
        <li><strong>Mật khẩu tạm thời:</strong> ${data.password || ''}</li>
      </ul>
      <p>Vui lòng đổi mật khẩu sau khi đăng nhập. Một email xác thực cũng đã được gửi đến bạn.</p>
      <a href="${data.loginURL || '#'}">Đăng nhập ngay</a>
    </body>
    </html>
  `
}

export function readEmailTemplate(templateName: string, data: TemplateData): string {
  try {
    const templatePath = path.join(__dirname, 'templates', templateName)

    let htmlContent = fs.readFileSync(templatePath, 'utf-8')

    Object.keys(data).forEach((key) => {
      const regex = new RegExp(`{{${key}}}`, 'g')
      htmlContent = htmlContent.replace(regex, data[key])
    })

    return htmlContent
  } catch (error) {
    console.error(`Error reading email template ${templateName}:`, error)
    const fallbackTemplate = FALLBACK_TEMPLATES[templateName]
    if (fallbackTemplate) {
      console.log(`Using fallback template for ${templateName}`)
      return fallbackTemplate(data)
    }
    return getGenericFallbackTemplate(data)
  }
}

function getGenericFallbackTemplate(data: TemplateData): string {
  return `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Thông báo từ SKINDORA</title>
    </head>
    <body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #f5f5f5;">
      <div style="max-width: 500px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #7355cd; margin: 0; font-size: 24px;">SKINDORA</h1>
          <p style="color: #666; margin: 5px 0 0 0;">Chăm sóc da thông minh</p>
        </div>

        <h2 style="color: #333; font-size: 18px;">
          Xin chào ${data.first_name || data.name || 'bạn'},
        </h2>
        
        <p style="color: #666; line-height: 1.6;">
          Bạn nhận được email này từ hệ thống SKINDORA. 
          Vui lòng kiểm tra thông tin và thực hiện hành động cần thiết.
        </p>

        ${
          data.verifyURL
            ? `
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.verifyURL}" style="background: #7355cd; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
              Xác nhận
            </a>
          </div>
        `
            : ''
        }

        ${
          data.resetURL
            ? `
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.resetURL}" style="background: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
              Đặt lại mật khẩu
            </a>
          </div>
        `
            : ''
        }

        <p style="color: #999; font-size: 14px; text-align: center; margin-top: 30px;">
          Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email.
        </p>

        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        
        <p style="color: #666; font-size: 14px; text-align: center; margin: 0;">
          Trân trọng,<br>
          <strong>Đội ngũ SKINDORA</strong>
        </p>
      </div>
    </body>
    </html>
  `
}
