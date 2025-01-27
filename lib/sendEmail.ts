'use server';
import nodemailer from 'nodemailer';

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   host: SMTP_SERVER_HOST,
//   port: 587,
//   secure: true,
//   auth: {
//     user: SMTP_SERVER_USERNAME,
//     pass: SMTP_SERVER_PASSWORD,
//   },
// });

const transporter = nodemailer.createTransport({
    service: 'gmail',
  host: "smtp.gmail.com",
  port: 587,
  secure: true,
  auth: {
    user: "konedieu5@gmqil.com",
    pass: "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",
  }
});

export async function SendMails() {
  try {
    const isVerified = await transporter.verify();
    console.log(isVerified)
  } catch (error) {
    console.error('Something Went Wrong', error);
    return;
  }
  const info = await transporter.sendMail({
    from: "zachary.grady38@ethereal.email",
    to:"konedieu5@gmail.com",
    subject: "Hello",
    text: "text",
    html: 'Goood Morning',
  });
  console.log('Message Sent', info.messageId);
  console.log('Mail sent to', "konedieu5@gmail.com");
  return info;
}
