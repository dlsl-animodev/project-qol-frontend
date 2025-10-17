'use server'

//server actions for attendance management MUTATIONS

import { revalidatePath } from 'next/cache'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { validateCodeAndGetEvent } from '@/lib/queries/events'
import { fetchStudentInfo, formatStudentName } from '@/lib/api/student'
import { hasAttended } from '@/lib/queries/attendance'
import { requireUser } from '@/lib/supabase/auth'
import type { Attendance, StudentInfo } from '@/types/database'

export async function recordAttendance(
  studentId: string,
  code: string
): Promise<{
  success: boolean
  message?: string
  error?: string
  attendance?: Attendance
  student?: StudentInfo
  event?: { id: string; name: string; date: string }
}> {
  try {
    await requireUser()
    const supabase = await createSupabaseServerClient()

    const validation = await validateCodeAndGetEvent(code, supabase)

    if (!validation.valid || !validation.event) {
      return {
        success: false,
        message: validation.reason || 'Invalid code'
      }
    }

    let studentInfo: StudentInfo
    try {
      studentInfo = await fetchStudentInfo(studentId)
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch student info'
      }
    }

    const alreadyAttended = await hasAttended(validation.event.id, studentId, supabase)

    if (alreadyAttended) {
      return {
        success: false,
        message: 'You have already logged attendance for this event'
      }
    }

    const studentName = formatStudentName(studentInfo.email_address)

    // auth checks are yet to be determined...

    const { data: attendance, error: attendanceError } = await supabase
      .from('attendance')
      .insert({
        event_id: validation.event.id,
        student_id: studentId,
        student_name: studentName,
        email_address: studentInfo.email_address
      })
      .select()
      .single()

    if (attendanceError || !attendance) {
      console.error('Error recording attendance:', attendanceError)
      return {
        success: false,
        error: attendanceError?.message || 'Failed to record attendance'
      }
    }

    revalidatePath('/admin')
    revalidatePath(`/events/${validation.event.id}`)

    return {
      success: true,
      message: 'Attendance logged successfully',
      attendance: attendance as Attendance,
      student: studentInfo,
      event: {
        id: validation.event.id,
        name: validation.event.event_name,
        date: validation.event.event_date
      }
    }
  } catch (error) {
    console.error('Unexpected error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export async function deleteAttendance(attendanceId: string): Promise<{
  success: boolean
  message?: string
  error?: string
}> {
  try {
    await requireUser()
    const supabase = await createSupabaseServerClient()
    const { error } = await supabase
      .from('attendance')
      .delete()
      .eq('id', attendanceId)

    if (error) {
      return {
        success: false,
        error: error.message
      }
    }

    revalidatePath('/admin')

    return {
      success: true,
      message: 'Attendance record deleted'
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}