//server actions for event management MUTATIONS

'use server';

import { revalidatePath } from 'next/cache';
import { createSupabaseServerClient, createSupabaseServiceClient } from '@/lib/supabase/server';
import { requireUser, requireAdmin } from '@/lib/supabase/auth';
import type { Event, Code } from '@/types/database';

// admin creates event for an organization
// Auto-generates a unique event code
// Uses service role to bypass RLS policies

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
    // use service role client to bypass RLS when creating events for organizations
    const supabase = createSupabaseServiceClient();

    const assignedUserId = eventData.user_id || user.id;

    // balidate UUID format for assigned user
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(assignedUserId)) {
      return {
        success: false,
        error: 'Invalid user ID format.'
      };
    }

    const generateCode = () => {
      const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let result = "";
        const charactersLength = characters.length;
        for (let i = 0; i < 6; i++) {
            result += characters.charAt(
                Math.floor(Math.random() * charactersLength)
            );
        }
        return result;
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
        code: code,
        event_id: event.id,
        is_active: true,
        expires_at: expiresAt.toISOString()
      })
      .select()
      .single();

    if (codeError || !codeEntry) {
      console.error('Error creating code:', codeError);

      return {
        success: false,
        error: codeError?.message || 'Event created but failed to generate code'
      };
    }

    revalidatePath('/admin');
    revalidatePath('/home');
    revalidatePath(`/events/${assignedUserId}`);

    return {
      success: true,
      event: event,
      code: codeEntry,
      message: `Event "${eventData.event_name}" created with code: ${code}`
    };
  } catch (error) {
    console.error('Error in createEvent:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred'
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