"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import bcrypt from "bcryptjs"

export async function signUpAction(
  email: string,
  password: string,
  fullName: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Validate inputs
    if (!email || !password || !fullName) {
      return { success: false, error: "All fields are required" }
    }

    if (password.length < 8) {
      return { success: false, error: "Password must be at least 8 characters" }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return { success: false, error: "Invalid email format" }
    }

    const supabase = createAdminClient()

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single()

    if (existingUser) {
      return { success: false, error: "Email already registered" }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)

    // Create user profile
    const { error } = await supabase
      .from('profiles')
      .insert({
        email,
        full_name: fullName,
        password_hash: passwordHash,
      })

    if (error) {
      console.error('Error creating user:', error)
      return { success: false, error: "Failed to create account" }
    }

    return { success: true }
  } catch (error) {
    console.error('Sign up error:', error)
    return { success: false, error: "An unexpected error occurred" }
  }
}
