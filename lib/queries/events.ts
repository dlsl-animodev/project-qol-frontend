// query functions for events

import { createSupabaseServerClient, Supabase } from '@/lib/supabase/server'
import type { Event, Code } from '@/types/database'

const SUPABASE_NO_ROWS_ERROR = 'PGRST116'

export async function getEventsForUser(userId: string): Promise<Event[]> {
  const client = await createSupabaseServerClient();

  const { data: session } = await client.auth.getSession();
  if (!session?.session?.user) {
    return [];
  }

  const { data, error } = await client
    .from('events')
    .select('*')
    .eq('user_id', userId)
    .order('event_date', { ascending: false });

  if (error) {
    throw new Error(`Error fetching events for user: ${error.message}`);
  }

  return data as Event[];
}



export async function getEventById(eventId: string, client: Supabase): Promise<Event | null> {
  const { data, error } = await client
    .from('events')
    .select('*')
    .eq('id', eventId)
    .single()

  if (error) {
    if (error.code === SUPABASE_NO_ROWS_ERROR) return null
    console.error('Error fetching event:', error)
    return null
  }

  return data as Event
}

export async function getAllEvents(client: Supabase): Promise<Event[]> {
  const { data, error } = await client
    .from('events')
    .select('*')
    .order('event_date', { ascending: false })

  if (error) {
    console.error('Error fetching events:', error)
    return []
  }

  return data as Event[]
}

export async function getUpcomingEvents(client: Supabase): Promise<Event[]> {
  const { data, error } = await client
    .from('events')
    .select('*')
    .gte('event_date', new Date().toISOString())
    .order('event_date', { ascending: true })

  if (error) {
    console.error('Error fetching upcoming events:', error)
    return []
  }

  return data as Event[]
}

export async function getCodeByEventId(eventId: string, client: Supabase): Promise<Code | null> {
  const { data, error } = await client
    .from('codes')
    .select('*')
    .eq('event_id', eventId)
    .single()

  if (error) {
    if (error.code === SUPABASE_NO_ROWS_ERROR) return null
    console.error('Error fetching code:', error)
    return null
  }

  return data as Code
}

export async function validateCodeAndGetEvent(code: string, client: Supabase): Promise<{
  valid: boolean
  event?: Event
  code?: Code
  reason?: string
}> {
  const { data: codeData, error: codeError } = await client
    .from('codes')
    .select('*')
    .eq('code', code.toUpperCase())
    .single()

  if (codeError || !codeData) {
    return {
      valid: false,
      reason: 'Code not found'
    }
  }

  if (!codeData.is_active) {
    return {
      valid: false,
      code: codeData as Code,
      reason: 'Code is inactive'
    }
  }

  if (codeData.expires_at) {
    const expirationDate = new Date(codeData.expires_at)
    if (expirationDate < new Date()) {
      return {
        valid: false,
        code: codeData as Code,
        reason: 'Code has expired'
      }
    }
  }

  const event = await getEventById(codeData.event_id, client)

  if (!event) {
    return {
      valid: false,
      code: codeData as Code,
      reason: 'Event not found'
    }
  }

  return {
    valid: true,
    event,
    code: codeData as Code
  }
}