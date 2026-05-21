const API_BASE = import.meta.env.VITE_API_BASE || '/api'

async function request(path, options = {}) {
  const url = `${API_BASE}${path}`
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      ...options.headers,
    },
  }

  const response = await fetch(url, config)

  if (!response.ok) {
    const error = await response.text()
    throw new Error(error || `HTTP ${response.status}`)
  }

  const contentType = response.headers.get('content-type')
  if (contentType && contentType.includes('application/json')) {
    const json = await response.json()
    return json && typeof json === 'object' && 'data' in json ? json.data : json
  }

  return response.text()
}

export default request
