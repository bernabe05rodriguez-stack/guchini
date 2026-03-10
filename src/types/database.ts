export type OrderStatus = "pending" | "paid" | "preparing" | "ready" | "delivered" | "cancelled"

export interface User {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  phone: string | null
  created_at: string
  total_orders: number
  total_spent: number
}

export interface Sandwich {
  id: string
  name: string
  description: string | null
  ingredients: string[]
  price: number
  image_url: string | null
  available: boolean
  display_order: number
  created_at?: string
  updated_at?: string
}

export interface Drink {
  id: string
  name: string
  description: string | null
  price: number
  image_url: string | null
  available: boolean
  display_order: number
  created_at?: string
  updated_at?: string
}

export interface Order {
  id: string
  order_number: string
  user_id: string | null
  status: OrderStatus
  subtotal: number
  total: number
  estimated_wait_minutes: number | null
  mp_preference_id: string | null
  mp_payment_id: string | null
  mp_status: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  item_type: "sandwich" | "drink"
  item_id: string
  item_name: string
  quantity: number
  unit_price: number
  subtotal: number
}

export interface Setting {
  key: string
  value: string
  description: string | null
}

export interface AdminUser {
  id: string
  username: string
  password_hash: string
  created_at: string
}

export interface CartItem {
  id: string
  type: "sandwich" | "drink"
  name: string
  price: number
  image_url: string | null
  quantity: number
}

export interface OrderWithItems extends Order {
  order_items: OrderItem[]
  user?: User
}
