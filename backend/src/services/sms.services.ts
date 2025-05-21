import twilio, { Twilio } from 'twilio'

const accountSID: string = process.env.ACCOUNT_SID || '' // Account SID từ Twilio
const authToken: string = process.env.AUTH_TOKEN || '' // Auth Token
const twilioPhone: string = process.env.TWILIO_PHONE || ''
const client: Twilio = twilio(accountSID, authToken)

export const sendSMS = async (to: string, message: string) => {
  try {
    const response = await client.messages.create({
      body: message,
      from: twilioPhone,
      to
    })

    return response
  } catch (error: any) {
    console.log('Error in send SMS message: ', error.message)
    throw new Error(error.message)
  }
}
