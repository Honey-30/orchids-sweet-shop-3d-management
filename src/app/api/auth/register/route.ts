import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { hashPassword, generateToken } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Missing required fields', message: 'Email, password, and name are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Invalid password', message: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    const supabase = await createAdminClient()

    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase())
      .single()

    if (existingUser) {
      return NextResponse.json(
        { error: 'User exists', message: 'A user with this email already exists' },
        { status: 409 }
      )
    }

    const passwordHash = await hashPassword(password)

    const { data: newUser, error } = await supabase
      .from('users')
      .insert({
        email: email.toLowerCase(),
        password_hash: passwordHash,
        name,
        role: 'user'
      })
      .select('id, email, name, role, created_at, updated_at')
      .single()

    if (error || !newUser) {
      return NextResponse.json(
        { error: 'Registration failed', message: error?.message || 'Failed to create user' },
        { status: 500 }
      )
    }

    const token = generateToken(newUser)

    return NextResponse.json({
      user: newUser,
      token
    }, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'Server error', message: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
