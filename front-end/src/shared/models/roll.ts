export interface Roll {
  id: number
  name: string
  completed_at: Date
  student_roll_states: { studentId: number; rollState: RolllStateType }[]
}

export interface RollInput {
  student_roll_states: { studentId: number; rollState: RolllStateType }[]
}

export type RolllStateType = "unmark" | "present" | "absent" | "late"
