export const DateFormat = (date?: Date | number): string => {
  return Intl.DateTimeFormat('kr', {
    dateStyle: 'medium',
    timeStyle: 'medium',
    hour12: false
  }).format(date)
}

export const nullFunction = () => {
  null
}
