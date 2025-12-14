import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required' },
        { status: 401 }
      )
    }

    const supabase = await createAdminClient()
    const { data: sweets, error } = await supabase
      .from('sweets')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json(
        { error: 'Fetch failed', message: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ sweets })
  } catch {
    return NextResponse.json(
      { error: 'Server error', message: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required' },
        { status: 401 }
      )
    }

    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden', message: 'Admin access required' },
        { status: 403 }
      )
    }

    const { name, description, category, price, quantity, image_url } = await request.json()

    if (!name || !category || price === undefined) {
      return NextResponse.json(
        { error: 'Missing fields', message: 'Name, category, and price are required' },
        { status: 400 }
      )
    }

    const supabase = await createAdminClient()
    const { data: sweet, error } = await supabase
      .from('sweets')
      .insert({
        name,
        description: description || null,
        category,
        price: parseFloat(price),
        quantity: quantity || 0,
        image_url: image_url || null
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Create failed', message: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ sweet }, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'Server error', message: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
