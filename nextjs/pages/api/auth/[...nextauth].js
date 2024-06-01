/* * */

import { UserModel } from '@/schemas/User/model';
import mongodb from '@/services/OFFERMANAGERDB';
import clientPromise from '@/services/mongodb-adapter';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import NextAuth from 'next-auth';
import EmailProvider from 'next-auth/providers/email';

/* * */

export const authOptions = {
	adapter: MongoDBAdapter(clientPromise),
	callbacks: {
		async session({ session, token }) {
			try {
				if (token.email) {
					await mongodb.connect();
					const foundUser = await UserModel.findOneAndUpdate({ email: token.email }, { last_active: new Date() }, { new: true });
					if (foundUser) session.user = foundUser;
					return session;
				}
				throw new Error('JWT Token did not have the email property.');
			}
			catch (error) {
				console.log(error);
				return false;
			}
		},
		async signIn({ user }) {
			try {
				await mongodb.connect();
				const foundUser = await UserModel.exists({ email: user.email });
				if (!foundUser) return false;
				else return true;
			}
			catch (error) {
				console.log(error);
				return false;
			}
		},
	},
	debug: false,
	pages: {
		error: '/login/error',
		signIn: '/login',
		verifyRequest: '/login/verify',
	},
	providers: [
		EmailProvider({
			from: process.env.EMAIL_FROM,
			server: {
				auth: {
					pass: process.env.EMAIL_SERVER_PASSWORD,
					user: process.env.EMAIL_SERVER_USER,
				},
				host: process.env.EMAIL_SERVER_HOST,
				port: process.env.EMAIL_SERVER_PORT,
			},
		}),
	],
	session: { strategy: 'jwt' },
};

/* * */

export default NextAuth(authOptions);
