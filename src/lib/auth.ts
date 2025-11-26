import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { createAdminClient } from "@/lib/supabase/admin"
import bcrypt from "bcryptjs"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const supabase = createAdminClient()

        // Get user profile with password hash
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('id, email, full_name, avatar_url, password_hash')
          .eq('email', credentials.email as string)
          .single()

        if (error || !profile || !profile.password_hash) {
          return null
        }

        // Verify password
        const isValid = await bcrypt.compare(
          credentials.password as string,
          profile.password_hash
        )

        if (!isValid) {
          return null
        }

        // Return user object for session
        return {
          id: profile.id,
          email: profile.email,
          name: profile.full_name,
          image: profile.avatar_url,
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) return false

      try {
        const supabase = createAdminClient()

        // Check if profile exists
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', user.email)
          .single()

        if (!existingProfile) {
          // Create new profile (Supabase will generate UUID)
          const { error } = await supabase
            .from('profiles')
            .insert({
              email: user.email,
              full_name: user.name,
              avatar_url: user.image,
            })

          if (error) {
            console.error('Error creating profile:', error)
            return false
          }
        }

        return true
      } catch (error) {
        console.error('Sign in error:', error)
        return false
      }
    },
    async session({ session, token }) {
      if (session.user && session.user.email) {
        // Get the actual Supabase profile ID
        const supabase = createAdminClient()
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', session.user.email)
          .single()

        if (profile) {
          session.user.id = profile.id
        }
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
})
