import nodemailer from 'nodemailer'
import { Role } from '~/constants/enums'
import Product from '~/models/schemas/Product.schema'
import databaseService from '~/services/database.services'
import { readEmailTemplate } from '~/utils/email-templates'
import { CronJob } from 'cron'
import voucherService from '~/services/voucher.services'
import { ObjectId } from 'mongodb'
import { sendMessage } from '~/services/Kafka/kafka.services'

// Tạo transporter từ biến môi trường
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_APP,
    pass: process.env.EMAIL_PASSWORD_APP
  }
})

const sendDailyEmail = async () => {
  try {
    const products = await databaseService.products.find({ quantity: { $lte: 10 } }).toArray()

    if (products.length <= 0) return

    const staffs = await databaseService.users.find({ roleid: Role.Admin }).toArray()

    if (staffs.length <= 0) return

    const productItemsHtml = products
      .map(
        (p) => `
          <div class="feature-item">
            <span class="feature-icon">📦</span>
            <strong>${p.productName_detail}</strong><br/>
            <small>Số lượng: ${p.quantity}</small>
          </div>
        `
      )
      .join('')

    for (const staff of staffs) {
      const htmlContent = readEmailTemplate('daily-report.html', {
        name: `${staff.first_name}`,
        productsList: productItemsHtml
      })

      const mailOptions = {
        from: `"SKINDORA" <${process.env.EMAIL_APP}>`,
        to: staff.email,
        subject: 'Báo cáo tồn kho hằng ngày từ SKINDORA',
        html: htmlContent
      }

      await transporter.sendMail(mailOptions)
    }
  } catch (error) {
    console.error('Error sending daily email:', error)
  }
}

export const dailyReport = new CronJob(
  '0 7 * * *',
  () => {
    sendDailyEmail()
  },
  null,
  true,
  'Asia/Ho_Chi_Minh'
)

export const checkVoucherJob = new CronJob(
  '0 0 * * *',
  async () => {
    try {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const voucherList = await databaseService.vouchers
        .find({
          endDate: { $lt: today },
          isActive: true
        })
        .toArray()

      if (voucherList.length > 0) {
        await Promise.all(
          voucherList.map(async (v) => {
            const result = await databaseService.vouchers.findOneAndUpdate(
              { _id: new ObjectId(v._id) },
              {
                $set: {
                  isActive: false,
                  updatedAt: new Date()
                }
              },
              { returnDocument: 'after' }
            )

            const voucher = result
            if (voucher) {
              const topic = process.env.VOUCHER_UPDATED ?? 'voucher_updated'
              await sendMessage(
                topic,
                voucher._id.toHexString(),
                JSON.stringify({
                  ...voucher,
                  _id: voucher._id.toHexString()
                })
              )
            }
          })
        )
        console.log(`Updated ${voucherList.length} voucher(s)`)
      }
    } catch (err) {
      console.error('Error inactive voucher expire', err)
    }
  },
  null,
  true,
  'Asia/Ho_Chi_Minh'
)
