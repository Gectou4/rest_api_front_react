import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import StatusBadge from '../../src/components/StatusBadge'

describe('StatusBadge', () => {
  it('renders Backlog for status 1', () => {
    render(<StatusBadge status={1} />)
    expect(screen.getByText('Backlog')).toBeTruthy()
  })

  it('renders Todo for status 2', () => {
    render(<StatusBadge status={2} />)
    expect(screen.getByText('Todo')).toBeTruthy()
  })

  it('renders In Progress for status 3', () => {
    render(<StatusBadge status={3} />)
    expect(screen.getByText('In Progress')).toBeTruthy()
  })

  it('renders Done for status 4', () => {
    render(<StatusBadge status={4} />)
    expect(screen.getByText('Done')).toBeTruthy()
  })

  it('renders Closed for status 5', () => {
    render(<StatusBadge status={5} />)
    expect(screen.getByText('Closed')).toBeTruthy()
  })

  it('renders unknown status', () => {
    render(<StatusBadge status={99} />)
    expect(screen.getByText('Unknown (99)')).toBeTruthy()
  })
})
