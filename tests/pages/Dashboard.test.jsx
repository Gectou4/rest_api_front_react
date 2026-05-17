import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import Dashboard from '../../src/pages/Dashboard'
import * as usersApi from '../../src/api/users'

vi.mock('../../src/api/users', () => ({
  getUserTasks: vi.fn(),
}))

describe('Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders loading state initially', () => {
    usersApi.getUserTasks.mockReturnValue(new Promise(() => {}))
    render(<Dashboard />)
    expect(screen.getByText('Loading...')).toBeTruthy()
  })

  it('renders stats when data loads', async () => {
    usersApi.getUserTasks.mockResolvedValue({
      user_id: 1,
      tasks: {
        1: { task_id: 1, status: 2, title: 'Task 1', description: 'Desc', creation_date: '2024-01-01' },
        2: { task_id: 2, status: 4, title: 'Task 2', description: 'Desc', creation_date: '2024-01-02' },
      },
    })

    render(<Dashboard />)

    const stats = await screen.findAllByRole('heading')
    expect(stats.length).toBeGreaterThan(0)
  })
})
