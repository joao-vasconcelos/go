/* * */

import nodemailer from 'nodemailer';

/* * */

const SMTP = nodemailer.createTransport({
  pool: true,
  from: process.env.EMAIL_FROM,
  host: process.env.EMAIL_SERVER_HOST,
  port: process.env.EMAIL_SERVER_PORT,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

/* * */

export default SMTP;
