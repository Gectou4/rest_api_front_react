import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getUser } from '../api/users'

const DEFAULT_USERS = [1]

export default function Users() {
  const [lookupId, setLookupId] = useState('')
  const [lookupResult, setLookupResult] = useState(null)
  const [lookupError, setLookupError] = useState(null)

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

      <h2>Known Users</h2>
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
          {DEFAULT_USERS.map((userId) => (
            <tr key={userId}>
              <td>{userId}</td>
              <td colSpan="2">
                <Link to={`/users/${userId}`}>View user #{userId}</Link>
              </td>
              <td>
                <Link to={`/users/${userId}`} className="btn btn-sm">
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
