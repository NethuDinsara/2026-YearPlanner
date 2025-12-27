export const generateGoogleCalendarUrl = (task) => {
  const { title, date, startTime, duration, yearGoalTitle, monthlyGoalTitle } = task
  
  const dateObj = new Date(date + 'T' + startTime)
  const endDate = new Date(dateObj.getTime() + duration * 60000)
  
  const formatDate = (d) => {
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const hours = String(d.getHours()).padStart(2, '0')
    const minutes = String(d.getMinutes()).padStart(2, '0')
    const seconds = String(d.getSeconds()).padStart(2, '0')
    return `${year}${month}${day}T${hours}${minutes}${seconds}`
  }
  
  const startFormatted = formatDate(dateObj)
  const endFormatted = formatDate(endDate)
  
  const details = `Yearly Goal: ${yearGoalTitle}\nMonthly Objective: ${monthlyGoalTitle}`
  
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    details: details,
    dates: `${startFormatted}/${endFormatted}`
  })
  
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}