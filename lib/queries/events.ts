// query functions for events

import type { SupabaseClient } from '@supabase/supabase-js'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { Event, Code } from '@/types/database'

const SUPABASE_NO_ROWS_ERROR = 'PGRST116'

type Supabase = SupabaseClient<any, 'public', any>

async function resolveClient(client?: Supabase): Promise<Supabase> {
  if (client) return client
  return createSupabaseServerClient()
}

export async function getEventByCode(eventCode: string, client?: Supabase): Promise<Event | null> {
  const supabase = await resolveClient(client)
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('event_code', eventCode)
    .single()

  if (error) {
    if (error.code === SUPABASE_NO_ROWS_ERROR) return null
    console.error('Error fetching event:', error)
    return null
  }

  return data as Event
}

export async function getEventById(eventId: string, client?: Supabase): Promise<Event | null> {
  const supabase = await resolveClient(client)
  const { data, error } = await supabase
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

export async function getAllEvents(client?: Supabase): Promise<Event[]> {
  const supabase = await resolveClient(client)
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('event_date', { ascending: false })

  if (error) {
    console.error('Error fetching events:', error)
    return []
  }

  return data as Event[]
}

export async function getUpcomingEvents(client?: Supabase): Promise<Event[]> {
  const supabase = await resolveClient(client)
  const { data, error } = await supabase
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

export async function getCodeByEventId(eventId: string, client?: Supabase): Promise<Code | null> {
  const supabase = await resolveClient(client)
  const { data, error } = await supabase
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

export async function validateCodeAndGetEvent(code: string, client?: Supabase): Promise<{
  valid: boolean
  event?: Event
  code?: Code
  reason?: string
}> {
  const supabase = await resolveClient(client)
  const { data: codeData, error: codeError } = await supabase
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

  const event = await getEventById(codeData.event_id, supabase)

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