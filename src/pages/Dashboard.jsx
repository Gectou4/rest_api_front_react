import { useState, useEffect } from 'react'
import { getUserTasks } from '../api/users'
import TaskList from '../components/TaskList'

const USER_IDS = [1]

export default function Dashboard() {
  const [stats, setStats] = useState({ users: 0, tasks: 0, byStatus: {} })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchStats() {
      try {
        let totalTasks = 0
        const byStatus = {}

        const results = await Promise.allSettled(USER_IDS.map((id) => getUserTasks(id)))

        const usersWithData = results.filter((r) => r.status === 'fulfilled').length

        results.forEach((result) => {
          if (result.status === 'fulfilled' && result.value?.tasks) {
            const tasks = Object.values(result.value.tasks)
            totalTasks += tasks.length
            tasks.forEach((task) => {
              byStatus[task.status] = (byStatus[task.status] || 0) + 1
            })
          }
        })

        setStats({
          users: usersWithData,
          tasks: totalTasks,
          byStatus,
        })
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) return <div className="loading">Loading...</div>
  if (error) return <div className="error">Error: {error}</div>

  const statusLabels = {
    1: 'Backlog',
    2: 'Todo',
    3: 'In Progress',
    4: 'Done',
    5: 'Closed',
  }

  return (
    <div className="page">
      <h1>Dashboard</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Users</h3>
          <p className="stat-value">{stats.users}</p>
        </div>
        <div className="stat-card">
          <h3>Total Tasks</h3>
          <p className="stat-value">{stats.tasks}</p>
        </div>
        {Object.entries(stats.byStatus).map(([status, count]) => (
          <div key={status} className="stat-card">
            <h3>{statusLabels[status]}</h3>
            <p className="stat-value">{count}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
