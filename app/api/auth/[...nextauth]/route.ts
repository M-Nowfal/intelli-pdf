import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "@/lib/db";
import { User } from "@/models/user.model";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, NEXTAUTH_SECRET } from "@/utils/constants";
import { compare } from "@/lib/password";
import { cookies } from "next/headers";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter email and password");
        }

        try {
          await connectDB();

          const user = await User.findOne({ email: credentials.email }).select("+password");

          if (!user) {
            throw new Error("No user found with this email");
          }

          if (!user.password) {
            throw new Error("Please sign in with Google");
          }

          const isPasswordValid = await compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            throw new Error("Invalid password");
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
          };
        } catch (error: any) {
          throw new Error(error.message || "Authentication failed");
        }
      }
    }),

    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
  ],

  pages: {
    signIn: '/login',
    error: '/login',
  },

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        if (account?.provider === "google") {
          await connectDB();
          const dbUser = await User.findOne({ email: user.email });

          if (dbUser) {
            token.id = dbUser._id.toString();
          }
        } else {
          token.id = user.id;
        }
        if (account) {
          token.accessToken = account.access_token;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },

    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const cookieStore = await cookies();
          const intent = cookieStore.get("auth_intent")?.value;

          await connectDB();

          const existingUser = await User.findOne({ email: user.email });
          console.log("Intent = ", intent)
          if (intent === "login" && !existingUser) {
            return `/login?error=AccountNotFound`;
          }

          if (intent === "signup" && existingUser) {
            return true;
          }

          if (intent === "signup" && !existingUser) {
            await User.create({
              name: user.name,
              email: user.email,
              avatar: user.image,
              isVerified: true,
              stats: {
                totalDocuments: 0,
                flashcardsMastered: 0,
                studyStreak: {
                  streak: 0,
                  lastActive: Date.now()
                },
                aiCredits: 1000
              },
              provider: "google"
            });
            return true;
          }

          if (!existingUser) {
            return `/login?error=AccountNotFound`;
          }

          return true;
        } catch (err: unknown) {
          console.error("Error in Google sign-in:", err);
          return "/login?error=ServerSideError";
        }
      }

      return true;
    },
  },

  secret: NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };