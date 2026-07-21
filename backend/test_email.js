const nodemailer = require('nodemailer');
require('dotenv').config();

async function testEmail() {
  console.log("Testing with EMAIL_USER:", process.env.EMAIL_USER);
  try {
    let transporter;
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      console.log("Using Gmail");
      transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
    } else {
      console.log("Using Ethereal");
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    }

    const info = await transporter.sendMail({
      from: '"Co-Driver support" <support@codriver.com>',
      to: process.env.EMAIL_USER || "test@example.com",
      subject: "Test Email",
      text: "This is a test email.",
    });

    console.log("Message sent: %s", info.messageId);
    if (!process.env.EMAIL_USER) {
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

testEmail();
