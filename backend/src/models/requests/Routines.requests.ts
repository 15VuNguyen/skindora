export interface RoutinePayload {
  startDate: string
  endDate: string
  schedule: Map<string, Map<'AM' | 'PM', string[]>>
}
