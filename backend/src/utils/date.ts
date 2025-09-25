const vietnamTimezoneOffsetMs = 7 * 60 * 60 * 1000

export const getLocalTime = () => {
  const currentDate = new Date()
  const localTime = new Date(currentDate.getTime() + vietnamTimezoneOffsetMs)
  return localTime
}

export const getBaseRequiredDate = () => {
  return new Date(getLocalTime().getTime() + 3 * 24 * 60 * 60 * 1000)
}

export const getVnMidnight = () => {
  const now = new Date()
  now.setHours(0, 0, 0, 0)

  return new Date(now.getTime() + vietnamTimezoneOffsetMs)
}
