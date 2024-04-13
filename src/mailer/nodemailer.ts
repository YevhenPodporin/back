import nodemailer from 'nodemailer';

export const Mail = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  service: "gmail",
  port: 587,
  secure: false,
  auth: {
    user: 'usermeen@gmail.com',
    pass: 'hqcs qrig muxh ohna',
  },
});