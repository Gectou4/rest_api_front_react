import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TaskForm from '../../src/components/TaskForm'

describe('TaskForm', () => {
  it('renders empty form for new task', () => {
    render(<TaskForm onSubmit={vi.fn()} onCancel={vi.fn()} />)
    expect(screen.getByLabelText('Title')).toHaveValue('')
    expect(screen.getByLabelText('Description')).toHaveValue('')
    expect(screen.getByLabelText('Status')).toHaveValue('1')
  })

  it('renders form with task data for editing', () => {
    const task = {
      task_id: 1,
      title: 'Test Task',
      description: 'Test Description',
      status: 3,
    }
    render(<TaskForm task={task} onSubmit={vi.fn()} onCancel={vi.fn()} />)
    expect(screen.getByLabelText('Title')).toHaveValue('Test Task')
    expect(screen.getByLabelText('Description')).toHaveValue('Test Description')
    expect(screen.getByLabelText('Status')).toHaveValue('3')
  })

  it('calls onSubmit with form data', async () => {
    const user = userEvent.setup()
    const handleSubmit = vi.fn()
    render(<TaskForm onSubmit={handleSubmit} onCancel={vi.fn()} />)

    await user.type(screen.getByLabelText('Title'), 'New Task')
    await user.type(screen.getByLabelText('Description'), 'Task description')
    await user.click(screen.getByRole('button', { name: 'Create' }))

    expect(handleSubmit).toHaveBeenCalledWith({
      title: 'New Task',
      description: 'Task description',
      status: 1,
    })
  })

  it('calls onCancel when cancel button clicked', async () => {
    const user = userEvent.setup()
    const handleCancel = vi.fn()
    render(<TaskForm onSubmit={vi.fn()} onCancel={handleCancel} />)

    await user.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(handleCancel).toHaveBeenCalled()
  })
})
