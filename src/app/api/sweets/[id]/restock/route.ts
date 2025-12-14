import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { getUserFromRequest } from '@/lib/auth'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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
        { error: 'Forbidden', message: 'Admin only' },
        { status: 403 }
      )
    }

    const { id } = await params
    const { quantity } = await request.json()

    if (!quantity || quantity < 1) {
      return NextResponse.json(
        { error: 'Invalid quantity', message: 'Quantity must be at least 1' },
        { status: 400 }
      )
    }

    const supabase = await createAdminClient()

    const { data: sweet, error: fetchError } = await supabase
      .from('sweets')
      .select('quantity')
      .eq('id', id)
      .single()

    if (fetchError || !sweet) {
      return NextResponse.json(
        { error: 'Not found', message: 'Sweet not found' },
        { status: 404 }
      )
    }

    const { data: updatedSweet, error: updateError } = await supabase
      .from('sweets')
      .update({
        quantity: sweet.quantity + quantity,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      return NextResponse.json(
        { error: 'Restock failed', message: updateError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Restock successful',
      sweet: updatedSweet,
      added_quantity: quantity,
      new_total: updatedSweet.quantity
    })
  } catch {
    return NextResponse.json(
      { error: 'Server error', message: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
