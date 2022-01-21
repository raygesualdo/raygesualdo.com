export function formatDate(date: string) {
  const d = new Date(date)
  return d.toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'utc',
  })
}
