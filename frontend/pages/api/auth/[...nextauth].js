import NextAuth from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from '../../../services/mongodb-adapter';
import mongodb from '../../../services/mongodb';
import { Model as UserModel } from '../../../schemas/User/model';

export default NextAuth({
  debug: false,
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
    verifyRequest: '/auth/verify',
    signOut: '/auth/signout',
    error: '/auth/error',
  },
  callbacks: {
    async signIn({ user }) {
      try {
        await mongodb.connect();
        const foundUser = await UserModel.findOne({ email: user.email });
        if (!foundUser) return false;
        else return true;
      } catch (err) {
        console.log(err);
        return false;
      }
    },
    async jwt({ token, user }) {
      if (user) token.user = user;
      return token;
    },
    async session({ session, token }) {
      try {
        if (token.user) {
          await mongodb.connect();
          const foundUser = await UserModel.findOneAndUpdate({ _id: token.user.id }, { last_active: new Date() }, { new: true });
          if (foundUser) session.user = foundUser;
          return session;
        }
      } catch (err) {
        console.log(err);
        return false;
      }
    },
  },
});
