//server actions for event management MUTATIONS

'use server';

import { revalidatePath } from 'next/cache';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { requireUser, requireAdmin } from '@/lib/supabase/auth';
import type { Event, Code } from '@/types/database';


export async function createEvent(eventData: {
  event_name: string;
  event_date: string;
  description?: string;
  user_id?: string;
}): Promise<{
  success: boolean;
  event?: Event;
  code?: Code;
  error?: string;
  message?: string;
}> {
  try {

    const user = await requireAdmin();
    const supabase = await createSupabaseServerClient();

    const assignedUserId = eventData.user_id || user.id;

    const { data: targetUser, error: userError } = await supabase.auth.admin.getUserById(assignedUserId);
    if (userError || !targetUser) {
      return {
        success: false,
        error: 'Target user not found. Please verify the organization user ID.'
      };
    }

    const generateCode = () => {
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      let code = '';
      for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return code;
    };

    let code = '';
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      code = generateCode();

      const { data: existingCode } = await supabase
        .from('codes')
        .select('id')
        .eq('code', code)
        .single();

      if (!existingCode) {
        break;
      }

      attempts++;
    }

    if (attempts === maxAttempts) {
      return {
        success: false,
        error: 'Failed to generate unique code after multiple attempts'
      };
    }

    // create the event (assigned to target user)
    const { data: event, error: eventError } = await supabase
      .from('events')
      .insert({
        event_name: eventData.event_name,
        user_id: assignedUserId,
        event_date: eventData.event_date,
        description: eventData.description || null
      })
      .select()
      .single();

    if (eventError || !event) {
      console.error('Error creating event:', eventError);
      return {
        success: false,
        error: eventError?.message || 'Failed to create event'
      };
    }

    // here, we create the code entry in codes table
    const eventDate = new Date(eventData.event_date);

    // event expires 7 days after event date by default
    const expiresAt = new Date(eventDate);
    expiresAt.setDate(expiresAt.getDate() + 7);

    const { data: codeEntry, error: codeError } = await supabase
      .from('codes')
      .insert({
        code,
        event_id: event.id,
        is_active: true,
        expires_at: expiresAt.toISOString()
      })
      .select()
      .single();

    if (codeError) {
      console.error('Error creating code entry:', codeError);
      console.warn('Event created but code entry failed. Admins, manually create a code entry.');
    }

    revalidatePath('/admin');
    revalidatePath('/home');

    return {
      success: true,
      event: event as Event,
      code: codeEntry as Code,
      message: `Event created successfully with code: ${code}`
    };
  } catch (error) {
    console.error('Unexpected error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function deactivateCode(codeId: string): Promise<{
  success: boolean
  message?: string
  error?: string
}> {
  try {
    await requireUser()
    const supabase = await createSupabaseServerClient()
    const { error } = await supabase
      .from('codes')
      .update({ is_active: false })
      .eq('id', codeId);

    if (error) {
      return {
        success: false,
        error: error.message
      };
    }

    revalidatePath('/admin');

    return {
      success: true,
      message: 'Event deleted successfully'
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function reactivateCode(codeId: string): Promise<{
  success: boolean
  message?: string
  error?: string
}> {
  try {
    await requireUser()
    const supabase = await createSupabaseServerClient()
    const { error } = await supabase
      .from('codes')
      .update({ is_active: true })
      .eq('id', codeId)

    if (error) {
      return {
        success: false,
        error: error.message
      }
    }

    revalidatePath('/admin')

    return {
      success: true,
      message: 'Code reactivated successfully'
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export async function updateEvent(
  eventId: string,
  updates: Partial<Omit<Event, 'id' | 'created_at' | 'user_id'>>
): Promise<{
  success: boolean
  event?: Event
  message?: string
  error?: string
}> {
  try {
    await requireUser()
    const supabase = await createSupabaseServerClient()
    const { data, error } = await supabase
      .from('events')
      .update(updates)
      .eq('id', eventId)
      .select()
      .single()

    if (error) {
      return {
        success: false,
        error: error.message
      }
    }

    revalidatePath('/admin')
    revalidatePath('/home')

    return {
      success: true,
      event: data as Event,
      message: 'Event updated successfully'
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export async function deleteEvent(eventId: string): Promise<{
  success: boolean
  message?: string
  error?: string
}> {
  try {
    await requireUser()
    const supabase = await createSupabaseServerClient()
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId)

    if (error) {
      return {
        success: false,
        error: error.message
      }
    }

    revalidatePath('/admin')
    revalidatePath('/home')

    return {
      success: true,
      message: 'Event deleted successfully'
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}