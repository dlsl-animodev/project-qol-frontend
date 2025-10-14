export interface Event {
  id: string
  event_name: string
  event_code: string
  event_date: string
  description: string | null
  created_at: string
}

export interface Code {
  id: string
  code: string
  event_id: string
  is_active: boolean
  expires_at: string | null
  created_at: string
}

export interface Attendance {
  id: string
  event_id: string
  student_id: string
  student_name: string
  email_address: string
  tapped_at: string
  created_at: string
}

export interface AttendanceWithEvent extends Attendance {
  events: Event
}

export interface StudentInfo {
  email_address: string
  department: string
  partner_id: string
  card_tag_uid: string
  card_tag?: number
  guest_fullname?: string
}