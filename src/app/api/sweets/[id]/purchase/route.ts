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

    const { id } = await params
    const { quantity = 1 } = await request.json()

    if (quantity < 1) {
      return NextResponse.json(
        { error: 'Invalid quantity', message: 'Quantity must be at least 1' },
        { status: 400 }
      )
    }

    const supabase = await createAdminClient()

    const { data: sweet, error: fetchError } = await supabase
      .from('sweets')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !sweet) {
      return NextResponse.json(
        { error: 'Not found', message: 'Sweet not found' },
        { status: 404 }
      )
    }

    if (sweet.quantity < quantity) {
      return NextResponse.json(
        { error: 'Insufficient stock', message: `Only ${sweet.quantity} items available` },
        { status: 400 }
      )
    }

    const { error: updateError } = await supabase
      .from('sweets')
      .update({
        quantity: sweet.quantity - quantity,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)

    if (updateError) {
      return NextResponse.json(
        { error: 'Purchase failed', message: updateError.message },
        { status: 500 }
      )
    }

    const totalAmount = sweet.price * quantity

    const { data: purchase, error: purchaseError } = await supabase
      .from('purchase_history')
      .insert({
        user_id: user.id,
        sweet_id: id,
        sweet_name: sweet.name,
        quantity,
        price_at_purchase: sweet.price,
        total_amount: totalAmount
      })
      .select()
      .single()

    if (purchaseError) {
      console.error('Failed to record purchase:', purchaseError)
    }

    return NextResponse.json({
      message: 'Purchase successful',
      purchase: {
        sweet_name: sweet.name,
        quantity,
        price_per_item: sweet.price,
        total_amount: totalAmount
      },
      remaining_stock: sweet.quantity - quantity
    })
  } catch {
    return NextResponse.json(
      { error: 'Server error', message: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
