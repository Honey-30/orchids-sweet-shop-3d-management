import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET as getSweetsHandler, POST as createSweetHandler } from '@/app/api/sweets/route'
import { POST as purchaseHandler } from '@/app/api/sweets/[id]/purchase/route'
import { POST as restockHandler } from '@/app/api/sweets/[id]/restock/route'

vi.mock('@/lib/auth', () => ({
  verifyToken: vi.fn(() => ({
    id: 'user123',
    email: 'user@example.com',
    role: 'admin'
  }))
}))

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn((table: string) => ({
      select: vi.fn(() => ({
        order: vi.fn(() => Promise.resolve({
          data: [
            { id: '1', name: 'Gulab Jamun', price: 4.99, quantity: 50, category: 'Milk-based' },
            { id: '2', name: 'Jalebi', price: 3.49, quantity: 60, category: 'Fried' }
          ],
          error: null
        })),
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({
            data: { id: '1', name: 'Gulab Jamun', price: 4.99, quantity: 50 },
            error: null
          }))
        }))
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({
            data: { id: '3', name: 'Ladoo', price: 2.99, quantity: 70 },
            error: null
          }))
        }))
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn(() => Promise.resolve({
              data: { id: '1', name: 'Gulab Jamun', quantity: 45 },
              error: null
            }))
          }))
        }))
      }))
    }))
  }))
}))

describe('Sweets API Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/sweets', () => {
    it('should return list of all sweets', async () => {
      const request = new Request('http://localhost/api/sweets', {
        headers: { Authorization: 'Bearer mock_token' }
      })

      const response = await getSweetsHandler(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.sweets).toHaveLength(2)
      expect(data.sweets[0]).toHaveProperty('name', 'Gulab Jamun')
    })

    it('should reject request without authentication token', async () => {
      const { verifyToken } = await import('@/lib/auth')
      vi.mocked(verifyToken).mockReturnValueOnce(null)

      const request = new Request('http://localhost/api/sweets')

      const response = await getSweetsHandler(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.message).toBe('Unauthorized')
    })
  })

  describe('POST /api/sweets', () => {
    it('should allow admin to create a new sweet', async () => {
      const request = new Request('http://localhost/api/sweets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer admin_token'
        },
        body: JSON.stringify({
          name: 'Ladoo',
          description: 'Golden spherical sweet',
          category: 'Dry',
          price: 2.99,
          quantity: 70,
          image_url: 'https://example.com/ladoo.jpg'
        })
      })

      const response = await createSweetHandler(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.sweet).toHaveProperty('name', 'Ladoo')
    })

    it('should reject non-admin users from creating sweets', async () => {
      const { verifyToken } = await import('@/lib/auth')
      vi.mocked(verifyToken).mockReturnValueOnce({
        id: 'user123',
        email: 'user@example.com',
        role: 'user'
      })

      const request = new Request('http://localhost/api/sweets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer user_token'
        },
        body: JSON.stringify({
          name: 'Ladoo',
          price: 2.99,
          quantity: 70
        })
      })

      const response = await createSweetHandler(request)
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data.message).toBe('Admin access required')
    })

    it('should validate required fields when creating sweet', async () => {
      const request = new Request('http://localhost/api/sweets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer admin_token'
        },
        body: JSON.stringify({
          name: 'Ladoo'
        })
      })

      const response = await createSweetHandler(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.message).toContain('required')
    })

    it('should reject negative price values', async () => {
      const request = new Request('http://localhost/api/sweets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer admin_token'
        },
        body: JSON.stringify({
          name: 'Ladoo',
          description: 'Test',
          category: 'Dry',
          price: -5.99,
          quantity: 70
        })
      })

      const response = await createSweetHandler(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.message).toContain('Price must be positive')
    })
  })

  describe('POST /api/sweets/:id/purchase', () => {
    it('should successfully purchase sweet and decrease quantity', async () => {
      const request = new Request('http://localhost/api/sweets/1/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer user_token'
        },
        body: JSON.stringify({ quantity: 5 })
      })

      const params = { params: Promise.resolve({ id: '1' }) }
      const response = await purchaseHandler(request, params)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.purchase).toHaveProperty('quantity', 5)
      expect(data.purchase).toHaveProperty('total_amount')
    })

    it('should reject purchase when insufficient stock', async () => {
      const { createClient } = await import('@/lib/supabase/server')
      const mockClient = createClient()
      
      vi.mocked(mockClient.from('sweets').select().eq).mockReturnValueOnce({
        single: vi.fn(() => Promise.resolve({
          data: { id: '1', name: 'Gulab Jamun', quantity: 2 },
          error: null
        }))
      } as any)

      const request = new Request('http://localhost/api/sweets/1/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer user_token'
        },
        body: JSON.stringify({ quantity: 10 })
      })

      const params = { params: Promise.resolve({ id: '1' }) }
      const response = await purchaseHandler(request, params)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.message).toContain('stock')
    })

    it('should create purchase history record', async () => {
      const { createClient } = await import('@/lib/supabase/server')
      const mockClient = createClient()
      const insertSpy = vi.spyOn(mockClient.from('purchase_history'), 'insert')

      const request = new Request('http://localhost/api/sweets/1/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer user_token'
        },
        body: JSON.stringify({ quantity: 3 })
      })

      const params = { params: Promise.resolve({ id: '1' }) }
      await purchaseHandler(request, params)

      expect(insertSpy).toHaveBeenCalled()
    })
  })

  describe('POST /api/sweets/:id/restock', () => {
    it('should allow admin to restock sweet', async () => {
      const request = new Request('http://localhost/api/sweets/1/restock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer admin_token'
        },
        body: JSON.stringify({ quantity: 10 })
      })

      const params = { params: Promise.resolve({ id: '1' }) }
      const response = await restockHandler(request, params)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toHaveProperty('new_total')
    })

    it('should reject non-admin from restocking', async () => {
      const { verifyToken } = await import('@/lib/auth')
      vi.mocked(verifyToken).mockReturnValueOnce({
        id: 'user123',
        email: 'user@example.com',
        role: 'user'
      })

      const request = new Request('http://localhost/api/sweets/1/restock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer user_token'
        },
        body: JSON.stringify({ quantity: 10 })
      })

      const params = { params: Promise.resolve({ id: '1' }) }
      const response = await restockHandler(request, params)
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data.message).toBe('Admin access required')
    })

    it('should reject negative restock quantity', async () => {
      const request = new Request('http://localhost/api/sweets/1/restock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer admin_token'
        },
        body: JSON.stringify({ quantity: -5 })
      })

      const params = { params: Promise.resolve({ id: '1' }) }
      const response = await restockHandler(request, params)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.message).toContain('positive')
    })
  })
})
