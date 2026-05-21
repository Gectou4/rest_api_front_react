import { useState, useEffect } from 'react'
import { getUsers, getUserTasks } from '../api/users'
import { createTask, updateTask, deleteTask } from '../api/tasks'
import TaskList from '../components/TaskList'
import TaskForm from '../components/TaskForm'
import Modal from '../components/Modal'

export default function Tasks() {
  const [users, setUsers] = useState([])
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [tasks, setTasks] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [formError, setFormError] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    let cancelled = false
    getUsers()
      .then((list) => {
        if (!cancelled) {
          setUsers(list)
          if (list.length > 0) setSelectedUserId(list[0].user_id)
        }
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (selectedUserId === null) return

    let cancelled = false
    setLoading(true)
    setError(null)

    getUserTasks(selectedUserId)
      .then((data) => {
        if (!cancelled) setTasks(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [selectedUserId])

  async function handleCreateTask(data) {
    setFormError(null)
    try {
      const newTask = await createTask(data)
      setShowCreateModal(false)
      const tasksData = await getUserTasks(selectedUserId)
      setTasks(tasksData)
    } catch (err) {
      setFormError(err.message)
    }
  }

  async function handleEditTask(data) {
    setFormError(null)
    try {
      await updateTask(editingTask.task_id, data)
      setShowEditModal(false)
      setEditingTask(null)
      const tasksData = await getUserTasks(selectedUserId)
      setTasks(tasksData)
    } catch (err) {
      setFormError(err.message)
    }
  }

  async function handleDeleteTask(taskId) {
    if (!confirm('Delete this task?')) return
    try {
      await deleteTask(taskId)
      const tasksData = await getUserTasks(selectedUserId)
      setTasks(tasksData)
    } catch (err) {
      setError(err.message)
    }
  }

  let filteredTasks = tasks?.tasks || {}
  if (filterStatus !== 'all') {
    filteredTasks = Object.fromEntries(
      Object.entries(filteredTasks).filter(([, task]) => task.status === Number(filterStatus)),
    )
  }

  const activeUser = users.find((u) => u.user_id === selectedUserId) || null

  return (
    <div className="page">
      <div className="page-header">
        <h1>Tasks</h1>
        <button
          className="btn btn-primary"
          onClick={() => {
            setFormError(null)
            setShowCreateModal(true)
          }}
        >
          New Task
        </button>
      </div>

      {error && <div className="error">Error: {error}</div>}

      <div className="filter-bar">
        <label htmlFor="user-select">User:</label>
        <select
          id="user-select"
          value={selectedUserId ?? ''}
          onChange={(e) => setSelectedUserId(Number(e.target.value))}
        >
          {users.map((u) => (
            <option key={u.user_id} value={u.user_id}>
              {u.name}
            </option>
          ))}
        </select>

        <label htmlFor="status-filter">Status:</label>
        <select
          id="status-filter"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All</option>
          <option value="1">Backlog</option>
          <option value="2">Todo</option>
          <option value="3">In Progress</option>
          <option value="4">Done</option>
          <option value="5">Closed</option>
        </select>
      </div>

      {!activeUser && !loading && <p className="text-muted">No users found.</p>}
      {loading && <div className="loading">Loading tasks...</div>}
      {!loading && activeUser && (
        <TaskList
          tasks={filteredTasks}
          onEdit={(task) => {
            setEditingTask(task)
            setFormError(null)
            setShowEditModal(true)
          }}
          onDelete={handleDeleteTask}
        />
      )}

      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create Task">
        {formError && <p className="error">{formError}</p>}
        <TaskForm onSubmit={handleCreateTask} onCancel={() => setShowCreateModal(false)} />
      </Modal>

      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setEditingTask(null)
        }}
        title="Edit Task"
      >
        {formError && <p className="error">{formError}</p>}
        <TaskForm
          task={editingTask}
          onSubmit={handleEditTask}
          onCancel={() => {
            setShowEditModal(false)
            setEditingTask(null)
          }}
        />
      </Modal>
    </div>
  )
}
