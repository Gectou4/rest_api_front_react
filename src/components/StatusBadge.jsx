const STATUS_MAP = {
  1: { label: 'Backlog', className: 'status-backlog' },
  2: { label: 'Todo', className: 'status-todo' },
  3: { label: 'In Progress', className: 'status-inprogress' },
  4: { label: 'Done', className: 'status-done' },
  5: { label: 'Closed', className: 'status-closed' },
}

export default function StatusBadge({ status }) {
  const config = STATUS_MAP[status] || { label: `Unknown (${status})`, className: '' }

  return <span className={`badge ${config.className}`}>{config.label}</span>
}
