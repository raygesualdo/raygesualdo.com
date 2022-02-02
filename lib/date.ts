export function formatDate(date?: string) {
  // @ts-expect-error Date can actually take `null`
  const d = new Date(date ?? null)
  return d.toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'utc',
  })
}
