import request from './client'

export function createTask(data) {
  const params = new URLSearchParams(data)
  return request('/task', {
    method: 'POST',
    body: params.toString(),
  })
}

export function updateTask(id, data) {
  const params = new URLSearchParams(data)
  return request(`/task/${id}`, {
    method: 'POST',
    body: params.toString(),
  })
}

export function deleteTask(id) {
  return request(`/task/${id}`, {
    method: 'DELETE',
  })
}
