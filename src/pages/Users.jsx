import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getUsers, getUser } from '../api/users'

export default function Users() {
  const [users, setUsers] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lookupId, setLookupId] = useState('')
  const [lookupResult, setLookupResult] = useState(null)
  const [lookupError, setLookupError] = useState(null)

  useEffect(() => {
    getUsers()
      .then(setUsers)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [])

  async function handleLookup(e) {
    e.preventDefault()
    setLookupError(null)
    setLookupResult(null)
    try {
      const user = await getUser(lookupId)
      setLookupResult(user)
    } catch (err) {
      setLookupError(err.message)
    }
  }

  if (loading) return <div className="loading">Loading users...</div>
  if (error) return <div className="error">Error: {error}</div>

  return (
    <div className="page">
      <h1>Users</h1>

      <form onSubmit={handleLookup} className="lookup-form">
        <div className="form-group-inline">
          <label htmlFor="user-lookup">Look up user by ID:</label>
          <input
            id="user-lookup"
            type="number"
            min="1"
            value={lookupId}
            onChange={(e) => setLookupId(e.target.value)}
            placeholder="Enter user ID"
          />
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </div>
        {lookupError && <p className="error">{lookupError}</p>}
        {lookupResult && (
          <div className="lookup-result">
            <Link to={`/users/${lookupResult.user_id}`} className="btn">
              {lookupResult.name} ({lookupResult.email}) &rarr;
            </Link>
          </div>
        )}
      </form>

      <h2>All Users</h2>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.user_id}>
              <td>{user.user_id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <Link to={`/users/${user.user_id}`} className="btn btn-sm">
                  View tasks
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
