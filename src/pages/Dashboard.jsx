import { useState, useEffect } from 'react'
import { getUsers, getUserTasks } from '../api/users'

export default function Dashboard() {
  const [stats, setStats] = useState({ users: 0, tasks: 0, byStatus: {} })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function fetchStats() {
      try {
        const users = await getUsers()
        const byStatus = {}
        let totalTasks = 0

        const results = await Promise.allSettled(users.map((u) => getUserTasks(u.user_id)))

        results.forEach((result) => {
          if (result.status === 'fulfilled' && result.value?.tasks) {
            const tasks = Object.values(result.value.tasks)
            totalTasks += tasks.length
            tasks.forEach((task) => {
              byStatus[task.status] = (byStatus[task.status] || 0) + 1
            })
          }
        })

        if (!cancelled) {
          setStats({ users: users.length, tasks: totalTasks, byStatus })
        }
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchStats()
    return () => {
      cancelled = true
    }
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
            <h3>{statusLabels[status] || `Status ${status}`}</h3>
            <p className="stat-value">{count}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
