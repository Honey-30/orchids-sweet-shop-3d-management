export interface User {
  id: string
  email: string
  name: string
  role: 'user' | 'admin'
  created_at: string
  updated_at: string
}

export interface Sweet {
  id: string
  name: string
  description: string | null
  category: string
  price: number
  quantity: number
  image_url: string | null
  created_at: string
  updated_at: string
}

export interface PurchaseHistory {
  id: string
  user_id: string
  sweet_id: string | null
  sweet_name: string
  quantity: number
  price_at_purchase: number
  total_amount: number
  purchased_at: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface ApiError {
  error: string
  message: string
}
