//server actions for event management MUTATIONS

'use server'

import { revalidatePath } from 'next/cache'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { requireUser } from '@/lib/supabase/auth'
import type { Event } from '@/types/database'


export async function createEvent(eventData: {
  event_name: string
  event_date: string
  description?: string
}): Promise<{
  success: boolean
  event?: Event
  error?: string
  message?: string
}> {
  try {
    await requireUser()
    const supabase = await createSupabaseServerClient()

    // code is no longer used, but we keep it for record-keeping purposes
    const code = Math.random().toString(36).substring(2, 8).toUpperCase()

    // Start a transaction

    const { data: event, error: eventError } = await supabase
      .from('events')
      .insert({
        event_name: eventData.event_name,
        event_code: code,
        event_date: eventData.event_date,
        description: eventData.description || null
      })
      .select()
      .single()

    if (eventError || !event) {
      console.error('Error creating event:', eventError)
      return {
        success: false,
        error: eventError?.message || 'Failed to create event'
      }
    }
    revalidatePath('/admin')
    revalidatePath('/home')

    return {
      success: true,
      event: event as Event,
      message: 'Event created successfully'
    }
  } catch (error) {
    console.error('Unexpected error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
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
      message: 'Code deactivated successfully'
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
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
  updates: Partial<Omit<Event, 'id' | 'created_at' | 'event_code'>>
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