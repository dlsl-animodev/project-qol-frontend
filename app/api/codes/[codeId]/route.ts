// API route to manage individual codes
// PUT /api/codes/[codeId] - Update code expiration/status
// DELETE /api/codes/[codeId] - Delete code

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getUserRole } from '@/lib/queries/user';

// update code (expiration, is_active)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ codeId: string }> }
) {
  try {

    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const role = await getUserRole();
    if (role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      )
    }

    const { codeId } = await params;
    const body = await request.json();

    const allowedFields = ['is_active', 'expires_at'];
    const updates: { is_active?: boolean; expires_at?: string | null } = {};

    for (const field of allowedFields) {
      if (field in body) {
        updates[field as keyof typeof updates] = body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid fields to update' },
        { status: 400 }
      )
    }

    // update code
    const { data: code, error } = await supabase
      .from('codes')
      .update(updates)
      .eq('id', codeId)
      .select()
      .single();

    if (error) {
      console.error('Error updating code:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      code,
      message: 'Code updated successfully'
    })

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// delete code
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ codeId: string }> }
) {
  try {

    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const role = await getUserRole()
    if (role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      )
    }

    const { codeId } = await params;

    const { error } = await supabase
      .from('codes')
      .delete()
      .eq('id', codeId);

    if (error) {
      console.error('Error deleting code:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Code deleted successfully'
    })

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
