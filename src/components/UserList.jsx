import { Link } from 'react-router-dom'

export default function UserList({ users }) {
  if (!users || users.length === 0) {
    return <p className="text-muted">No users found.</p>
  }

  return (
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
  )
}
