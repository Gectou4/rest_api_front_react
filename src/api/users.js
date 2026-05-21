import request from './client'

export function getUsers() {
  return request('/users')
}

export function getUser(id) {
  return request(`/user/${id}`)
}

export function getUserTasks(id) {
  return request(`/user/${id}/task`)
}

export function addTaskToUser(userId, taskId) {
  return request(`/user/${userId}/task/${taskId}`, {
    method: 'POST',
  })
}

export function removeTaskFromUser(userId, taskId) {
  return request(`/user/${userId}/task/${taskId}`, {
    method: 'DELETE',
  })
}
