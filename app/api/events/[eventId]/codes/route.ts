// API route to get code for an event
// GET /api/events/[eventId]/codes
// POST /api/events/[eventId]/codes - generate new code

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getUserRole } from '@/lib/queries/user';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {

    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const role = await getUserRole();
    if (role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { eventId } = await params;

    const { data: codes, error } = await supabase
      .from('codes')
      .select('*')
      .eq('event_id', eventId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching codes:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      codes: codes || [],
      count: codes?.length || 0
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'An error occurred :<'
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
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
      );
    }

    const { eventId } = await params;

    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('id, event_name')
      .eq('id', eventId)
      .single();

    if (eventError || !event) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    const { data: existingCodes } = await supabase
      .from('codes')
      .select('code, is_active')
      .eq('event_id', eventId)
      .eq('is_active', true);

    if (existingCodes && existingCodes.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Event already has an active code',
          existingCode: existingCodes[0].code
        },
        { status: 400 }
      );
    }

    // new code generation function
    const generateCode = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let code = '';
      for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return code;
    }

    let newCode = generateCode();
    let attempts = 0;
    const maxAttempts = 10;

    // Ensure code is unique
    while (attempts < maxAttempts) {
      const { data: existing } = await supabase
        .from('codes')
        .select('code')
        .eq('code', newCode);

      if (!existing || existing.length === 0) break;

      newCode = generateCode();
      attempts++;
    }

    if (attempts >= maxAttempts) {
      return NextResponse.json(
        { success: false, error: 'Failed to generate unique code' },
        { status: 500 }
      );
    }

    const { data: code, error: insertError } = await supabase
      .from('codes')
      .insert({
        code: newCode,
        event_id: eventId,
        is_active: true,
        expires_at: null
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating code:', insertError);
      return NextResponse.json(
        { success: false, error: insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      code: code
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'An error occurred :<'
      },
      { status: 500 }
    );
  }
}
