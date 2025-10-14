//server actions for event management MUTATIONS

'use server'

import { revalidatePath } from 'next/cache'
import { supabase } from '@/lib/supabase/server'
import type { Event, Code } from '@/types/database'

function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 8; i++) {
    const randomIndex = crypto.getRandomValues(new Uint32Array(1))[0] % chars.length
    code += chars.charAt(randomIndex)
  }
  return code
}
export async function createEventWithCode(eventData: {
  event_name: string
  event_date: string
  description?: string
}): Promise<{
  success: boolean
  event?: Event
  code?: Code
  error?: string
  message?: string
}> {
  try {

    let code = generateCode()
    let attempts = 0
    const maxAttempts = 10

    while (attempts < maxAttempts) {
      const { data: existingCode } = await supabase
        .from('codes')
        .select('code')
        .eq('code', code)
        .single()

      if (!existingCode)  {
        break
    }
      code = generateCode()
      attempts++
    }

    if (attempts === maxAttempts) {
      return {
        success: false,
        error: 'Failed to generate unique code after multiple attempts'
      }
    }

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

    const { data: codeData, error: codeError } = await supabase
      .from('codes')
      .insert({
        code: code,
        event_id: event.id,
        is_active: true,
        expires_at: null
      })
      .select()
      .single()

    if (codeError || !codeData) {
      console.error('Error creating code:', codeError)

      const { error: deleteError } = await supabase
        .from('events')
        .delete()
        .eq('id', event.id)
      if (deleteError) {
        console.error('Failed to rollback event creation:', deleteError)
      }

      return {
        success: false,
        error: codeError?.message || 'Failed to create code'
      }
    }
    revalidatePath('/admin')
    revalidatePath('/home')

    return {
      success: true,
      event: event as Event,
      code: codeData as Code,
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