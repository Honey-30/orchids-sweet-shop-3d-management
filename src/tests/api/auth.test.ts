import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST as registerHandler } from '@/app/api/auth/register/route'
import { POST as loginHandler } from '@/app/api/auth/login/route'

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn((table: string) => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: null, error: null }))
        }))
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({
            data: { id: '123', email: 'test@example.com', name: 'Test User', role: 'user' },
            error: null
          }))
        }))
      }))
    }))
  }))
}))

vi.mock('bcrypt', () => ({
  default: {
    hash: vi.fn(() => Promise.resolve('hashed_password')),
    compare: vi.fn(() => Promise.resolve(true))
  }
}))

vi.mock('jsonwebtoken', () => ({
  default: {
    sign: vi.fn(() => 'mock_jwt_token')
  }
}))

describe('Auth API Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('POST /api/auth/register', () => {
    it('should successfully register a new user with valid data', async () => {
      const request = new Request('http://localhost/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'newuser@example.com',
          password: 'SecurePass123',
          name: 'New User'
        })
      })

      const response = await registerHandler(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data).toHaveProperty('token')
      expect(data.user).toHaveProperty('email', 'test@example.com')
    })

    it('should reject registration with duplicate email', async () => {
      const { createClient } = await import('@/lib/supabase/server')
      const mockClient = createClient()
      
      vi.mocked(mockClient.from('users').select().eq).mockReturnValueOnce({
        single: vi.fn(() => Promise.resolve({
          data: { id: '123', email: 'existing@example.com' },
          error: null
        }))
      } as any)

      const request = new Request('http://localhost/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'existing@example.com',
          password: 'SecurePass123',
          name: 'Existing User'
        })
      })

      const response = await registerHandler(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.message).toBe('User already exists')
    })

    it('should reject registration without required fields', async () => {
      const request = new Request('http://localhost/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com'
        })
      })

      const response = await registerHandler(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.message).toBe('Missing required fields')
    })

    it('should reject registration with invalid email format', async () => {
      const request = new Request('http://localhost/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'invalid-email',
          password: 'SecurePass123',
          name: 'Test User'
        })
      })

      const response = await registerHandler(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.message).toBe('Invalid email format')
    })

    it('should hash password before storing', async () => {
      const bcrypt = (await import('bcrypt')).default
      
      const request = new Request('http://localhost/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'PlainPassword123',
          name: 'Test User'
        })
      })

      await registerHandler(request)

      expect(bcrypt.hash).toHaveBeenCalledWith('PlainPassword123', 10)
    })
  })

  describe('POST /api/auth/login', () => {
    it('should successfully login with correct credentials', async () => {
      const { createClient } = await import('@/lib/supabase/server')
      const mockClient = createClient()
      
      vi.mocked(mockClient.from('users').select().eq).mockReturnValueOnce({
        single: vi.fn(() => Promise.resolve({
          data: {
            id: '123',
            email: 'user@example.com',
            password_hash: 'hashed_password',
            name: 'Test User',
            role: 'user'
          },
          error: null
        }))
      } as any)

      const request = new Request('http://localhost/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'user@example.com',
          password: 'CorrectPassword123'
        })
      })

      const response = await loginHandler(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toHaveProperty('token')
      expect(data.user).toHaveProperty('email', 'user@example.com')
    })

    it('should reject login with non-existent email', async () => {
      const { createClient } = await import('@/lib/supabase/server')
      const mockClient = createClient()
      
      vi.mocked(mockClient.from('users').select().eq).mockReturnValueOnce({
        single: vi.fn(() => Promise.resolve({
          data: null,
          error: { message: 'User not found' }
        }))
      } as any)

      const request = new Request('http://localhost/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'nonexistent@example.com',
          password: 'Password123'
        })
      })

      const response = await loginHandler(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.message).toBe('Invalid credentials')
    })

    it('should reject login with incorrect password', async () => {
      const bcrypt = (await import('bcrypt')).default
      vi.mocked(bcrypt.compare).mockResolvedValueOnce(false as never)

      const { createClient } = await import('@/lib/supabase/server')
      const mockClient = createClient()
      
      vi.mocked(mockClient.from('users').select().eq).mockReturnValueOnce({
        single: vi.fn(() => Promise.resolve({
          data: {
            id: '123',
            email: 'user@example.com',
            password_hash: 'hashed_password',
            name: 'Test User',
            role: 'user'
          },
          error: null
        }))
      } as any)

      const request = new Request('http://localhost/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'user@example.com',
          password: 'WrongPassword'
        })
      })

      const response = await loginHandler(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.message).toBe('Invalid credentials')
    })

    it('should return JWT token on successful login', async () => {
      const jwt = (await import('jsonwebtoken')).default
      
      const { createClient } = await import('@/lib/supabase/server')
      const mockClient = createClient()
      
      vi.mocked(mockClient.from('users').select().eq).mockReturnValueOnce({
        single: vi.fn(() => Promise.resolve({
          data: {
            id: '123',
            email: 'user@example.com',
            password_hash: 'hashed_password',
            name: 'Test User',
            role: 'user'
          },
          error: null
        }))
      } as any)

      const request = new Request('http://localhost/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'user@example.com',
          password: 'CorrectPassword123'
        })
      })

      const response = await loginHandler(request)
      const data = await response.json()

      expect(jwt.sign).toHaveBeenCalled()
      expect(data.token).toBe('mock_jwt_token')
    })
  })
})
