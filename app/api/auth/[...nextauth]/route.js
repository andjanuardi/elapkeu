import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import query from '@/lib/db';

const cookiesOptions = {
  sessionToken: {
    name: `__Secure-next-auth.session-token`,
    options: {
      httpOnly: true,
      sameSite: 'none',
      path: '/',
      secure: true,
    },
  },
  callbackUrl: {
    name: `__Secure-next-auth.callback-url`,
    options: {
      httpOnly: true,
      sameSite: 'none',
      path: '/',
      secure: true,
    },
  },
  csrfToken: {
    name: `__Host-next-auth.csrf-token`,
    options: {
      httpOnly: true,
      sameSite: 'none',
      path: '/',
      secure: true,
    },
  },
};

export async function loginDB(email, password) {
  const sql = await query({
    query: `SELECT * FROM v_users WHERE email=? AND password=?`,
    values: [email, password],
  });
  return sql;
}

export const authOptions = {
  // cookies: {},
  cookies: cookiesOptions,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      async authorize(credentials, req) {
        try {
          let user = await loginDB(credentials.user, credentials.pass);

          if (user.length > 0) {
            user = { ...user[0], tahun: credentials.tahun };

            return user;
          }
        } catch (error) {
          return null;
        }
        return null;
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },

  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ token, session }) {
      session.user = token;
      return session;
    },
  },

  pages: {
    signIn: '/',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
