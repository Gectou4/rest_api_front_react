import StatusBadge from './StatusBadge'

export default function TaskList({ tasks, onEdit, onDelete, onRemove }) {
  if (!tasks || Object.keys(tasks).length === 0) {
    return <p className="text-muted">No tasks found.</p>
  }

  const taskArray = Object.values(tasks)

  return (
    <table className="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th>Status</th>
          <th>Created</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {taskArray.map((task) => (
          <tr key={task.task_id}>
            <td>{task.task_id}</td>
            <td className="task-title">{task.title}</td>
            <td>
              <StatusBadge status={task.status} />
            </td>
            <td>{task.creation_date}</td>
            <td className="actions-cell">
              {onEdit && (
                <button className="btn btn-sm" onClick={() => onEdit(task)}>
                  Edit
                </button>
              )}
              {onDelete && (
                <button className="btn btn-sm btn-danger" onClick={() => onDelete(task.task_id)}>
                  Delete
                </button>
              )}
              {onRemove && (
                <button className="btn btn-sm btn-danger" onClick={() => onRemove(task.task_id)}>
                  Remove
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
