import NextAuth from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from '../../../lib/mongodb';
import mongodb from '../../../services/mongodb';
import Model from '../../../models/User';

export default NextAuth({
  debug: true,
  adapter: MongoDBAdapter(clientPromise),
  session: { strategy: 'jwt' },
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    verifyRequest: '/auth/verify', // (used for check email message)
    signOut: '/auth/signout',
    error: '/auth/error', // Error code passed in query string as ?error=
    // newUser: '/auth/new-user', // New users will be directed here on first sign in (leave the property out if not of interest)
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      try {
        // 1. Try to connect to mongodb
        await mongodb.connect();
        // 2. Try to fetch the correct document
        const foundDocument = await Model.findOne({ email: user.email });
        if (!foundDocument) return false;
        else return true;
      } catch (err) {
        console.log(err);
        return false;
      }
    },
  },
});
