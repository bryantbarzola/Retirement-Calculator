import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()

    // Test database connection by querying profiles table
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1)

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Database connection successful!',
      profileCount: data?.length || 0
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to connect to database'
    }, { status: 500 })
  }
}
