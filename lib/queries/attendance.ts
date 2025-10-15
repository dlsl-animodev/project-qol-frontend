// queries for attendance-related operations

import type { SupabaseClient } from '@supabase/supabase-js'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { Attendance, AttendanceWithEvent } from '@/types/database'

type Supabase = SupabaseClient<any, 'public', any>

async function resolveClient(client?: Supabase): Promise<Supabase> {
  if (client) return client
  return createSupabaseServerClient()
}

export async function getEventAttendance(eventId: string, client?: Supabase): Promise<Attendance[]> {
  const supabase = await resolveClient(client)
  const { data, error } = await supabase
    .from('attendance')
    .select('*')
    .eq('event_id', eventId)
    .order('tapped_at', { ascending: false })

  if (error) {
    console.error('Error fetching attendance:', error)
    return []
  }

  return data as Attendance[]
}

export async function hasAttended(eventId: string, studentId: string, client?: Supabase): Promise<boolean> {
  const supabase = await resolveClient(client)
  const { data, error } = await supabase
    .from('attendance')
    .select('id')
    .eq('event_id', eventId)
    .eq('student_id', studentId)
    .single()

  return !error && data !== null
}

export async function getRecentAttendance(limit: number = 10, client?: Supabase): Promise<AttendanceWithEvent[]> {
  const supabase = await resolveClient(client)
  const { data, error } = await supabase
    .from('attendance')
    .select(`
      *,
      events (*)
    `)
    .order('tapped_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching recent attendance:', error)
    return []
  }

  return data as AttendanceWithEvent[]
}

export async function getAttendanceCount(eventId: string, client?: Supabase): Promise<number> {
  const supabase = await resolveClient(client)
  const { count, error } = await supabase
    .from('attendance')
    .select('*', { count: 'exact', head: true })
    .eq('event_id', eventId)

  if (error) {
    console.error('Error counting attendance:', error)
    return 0
  }

  return count || 0
}

// lib/queries/attendance.ts

export async function getStudentAttendance(
  studentId: string,
  limit: number = 50,
  client?: Supabase
): Promise<AttendanceWithEvent[]> {
  const supabase = await resolveClient(client)
  const { data, error } = await supabase
    .from('attendance')
    .select(`
      *,
      events (*)
    `)
    .eq('student_id', studentId)
    .order('tapped_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching student attendance:', error)
    return []
  }

  return data as AttendanceWithEvent[]
}