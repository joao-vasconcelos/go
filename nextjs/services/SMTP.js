/* * */

import nodemailer from 'nodemailer';

/* * */

const SMTP = nodemailer.createTransport({
	auth: {
		pass: process.env.EMAIL_SERVER_PASSWORD,
		user: process.env.EMAIL_SERVER_USER,
	},
	from: process.env.EMAIL_FROM,
	host: process.env.EMAIL_SERVER_HOST,
	pool: true,
	port: process.env.EMAIL_SERVER_PORT,
});

/* * */

export default SMTP;
