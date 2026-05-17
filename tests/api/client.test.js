import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import request from '../../src/api/client'

describe('api/client', () => {
  beforeEach(() => {
    vi.stubGlobal('import', { meta: { env: { VITE_API_BASE: '/api' } } })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should call fetch with correct URL and headers', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        headers: { get: () => 'application/json' },
        json: () => Promise.resolve({ success: true }),
      })
    )

    await request('/test')

    expect(global.fetch).toHaveBeenCalledWith('/api/test', {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
  })

  it('should throw on non-ok response', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        text: () => Promise.resolve('Not found'),
      })
    )

    await expect(request('/test')).rejects.toThrow('Not found')
  })

  it('should return text response for non-json content', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        headers: { get: () => 'text/plain' },
        text: () => Promise.resolve('plain text'),
      })
    )

    const result = await request('/test')
    expect(result).toBe('plain text')
  })
})
