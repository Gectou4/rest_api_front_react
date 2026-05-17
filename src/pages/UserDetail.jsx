import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getUser, getUserTasks, addTaskToUser, removeTaskFromUser } from '../api/users'
import { createTask, updateTask, deleteTask } from '../api/tasks'
import TaskList from '../components/TaskList'
import TaskForm from '../components/TaskForm'
import Modal from '../components/Modal'

export default function UserDetail() {
  const { id } = useParams()
  const [user, setUser] = useState(null)
  const [userTasks, setUserTasks] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [formError, setFormError] = useState(null)

  async function loadData() {
    try {
      const [userData, tasksData] = await Promise.all([getUser(id), getUserTasks(id)])
      setUser(userData)
      setUserTasks(tasksData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [id])

  async function handleCreateTask(data) {
    setFormError(null)
    try {
      const newTask = await createTask(data)
      await addTaskToUser(id, newTask.task_id)
      setShowCreateModal(false)
      await loadData()
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

  async function handleRemoveTask(taskId) {
    if (!confirm('Remove this task from user?')) return
    try {
      await removeTaskFromUser(id, taskId)
      await loadData()
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <div className="loading">Loading...</div>
  if (error) return <div className="error">Error: {error}</div>
  if (!user) return <div className="error">User not found</div>

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <Link to="/users" className="back-link">
            &larr; Back to Users
          </Link>
          <h1>{user.name}</h1>
          <p className="text-muted">{user.email}</p>
        </div>
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

      <TaskList
        tasks={userTasks?.tasks || {}}
        onEdit={(task) => {
          setEditingTask(task)
          setFormError(null)
          setShowEditModal(true)
        }}
        onDelete={handleDeleteTask}
        onRemove={handleRemoveTask}
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
