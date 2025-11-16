export function formatDate(date: Date | string | null) {
  if (!date) return "Not set"
  return new Date(date).toLocaleDateString("cs-CZ", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function getDaysUntilDue(dueDate: Date | string | null) {
  if (!dueDate) return null
  const now = new Date()
  const due = new Date(dueDate)
  const diffTime = due.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}
