import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(
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
    const supabase = await createAdminClient()
    const { data: sweet, error } = await supabase
      .from('sweets')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !sweet) {
      return NextResponse.json(
        { error: 'Not found', message: 'Sweet not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ sweet })
  } catch {
    return NextResponse.json(
      { error: 'Server error', message: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

export async function PUT(
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
        { error: 'Forbidden', message: 'Admin access required' },
        { status: 403 }
      )
    }

    const { id } = await params
    const updates = await request.json()
    
    const supabase = await createAdminClient()
    const { data: sweet, error } = await supabase
      .from('sweets')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error || !sweet) {
      return NextResponse.json(
        { error: 'Update failed', message: error?.message || 'Sweet not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ sweet })
  } catch {
    return NextResponse.json(
      { error: 'Server error', message: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

export async function DELETE(
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
    const supabase = await createAdminClient()
    const { error } = await supabase
      .from('sweets')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json(
        { error: 'Delete failed', message: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'Sweet deleted successfully' })
  } catch {
    return NextResponse.json(
      { error: 'Server error', message: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
