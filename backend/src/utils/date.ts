export const getLocalTime = () => {
    const currentDate = new Date()
    const vietnamTimezoneOffsetMs = 7 * 60 * 60 * 1000
    const localTime = new Date(currentDate.getTime() + vietnamTimezoneOffsetMs )
    return localTime
}

export const getBaseRequiredDate = () => {
    return new Date(getLocalTime().getTime() + 3 * 24 * 60 * 60 * 1000)
}