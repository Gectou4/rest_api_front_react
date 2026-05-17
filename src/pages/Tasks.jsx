import { useState, useEffect } from 'react'
import { getUserTasks } from '../api/users'
import { createTask, updateTask, deleteTask } from '../api/tasks'
import TaskList from '../components/TaskList'
import TaskForm from '../components/TaskForm'
import Modal from '../components/Modal'

const DEFAULT_USER_ID = 1

export default function Tasks() {
  const [tasks, setTasks] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [formError, setFormError] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')

  async function loadData() {
    try {
      const data = await getUserTasks(DEFAULT_USER_ID)
      setTasks(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  async function handleCreateTask(data) {
    setFormError(null)
    try {
      const newTask = await createTask(data)
      setShowCreateModal(false)
      await loadData()
      return newTask
    } catch (err) {
      setFormError(err.message)
      throw err
    }
  }

  async function handleEditTask(data) {
    setFormError(null)
    try {
      await updateTask(editingTask.task_id, data)
      setShowEditModal(false)
      setEditingTask(null)
      await loadData()
    } catch (err) {
      setFormError(err.message)
    }
  }

  async function handleDeleteTask(taskId) {
    if (!confirm('Delete this task?')) return
    try {
      await deleteTask(taskId)
      await loadData()
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

  if (loading) return <div className="loading">Loading...</div>

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
        <label htmlFor="status-filter">Filter by status:</label>
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

      <TaskList
        tasks={filteredTasks}
        onEdit={(task) => {
          setEditingTask(task)
          setFormError(null)
          setShowEditModal(true)
        }}
        onDelete={handleDeleteTask}
      />

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
