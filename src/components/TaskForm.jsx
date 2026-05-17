import { useState, useEffect } from 'react'

const STATUS_OPTIONS = [
  { value: 1, label: 'Backlog' },
  { value: 2, label: 'Todo' },
  { value: 3, label: 'In Progress' },
  { value: 4, label: 'Done' },
  { value: 5, label: 'Closed' },
]

export default function TaskForm({ task, onSubmit, onCancel }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState(1)

  useEffect(() => {
    if (task) {
      setTitle(task.title || '')
      setDescription(task.description || '')
      setStatus(task.status || 1)
    } else {
      setTitle('')
      setDescription('')
      setStatus(1)
    }
  }, [task])

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit({ title, description, status: Number(status) })
  }

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <div className="form-group">
        <label htmlFor="task-title">Title</label>
        <input
          id="task-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          maxLength={128}
        />
      </div>
      <div className="form-group">
        <label htmlFor="task-desc">Description</label>
        <textarea
          id="task-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />
      </div>
      <div className="form-group">
        <label htmlFor="task-status">Status</label>
        <select id="task-status" value={status} onChange={(e) => setStatus(e.target.value)}>
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {task ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  )
}
