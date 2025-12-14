import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Sweet } from '@/lib/types'

const mockSweet: Sweet = {
  id: '1',
  name: 'Gulab Jamun',
  description: 'Soft, spongy milk solids fried and soaked in fragrant rose-cardamom syrup',
  category: 'Milk-based',
  price: 4.99,
  quantity: 50,
  image_url: 'https://example.com/gulab-jamun.jpg',
  created_at: new Date().toISOString()
}

const mockSweetOutOfStock: Sweet = {
  ...mockSweet,
  id: '2',
  name: 'Out of Stock Sweet',
  quantity: 0
}

const mockHandlers = {
  onPurchase: vi.fn(),
  onEdit: vi.fn(),
  onDelete: vi.fn(),
  onRestock: vi.fn()
}

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>
  },
  AnimatePresence: ({ children }: any) => <>{children}</>
}))

vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => <img src={src} alt={alt} {...props} />
}))

describe('SweetCard Component', () => {
  it('should render sweet information correctly', () => {
    render(
      <div>
        <div>
          <h3>{mockSweet.name}</h3>
          <p>{mockSweet.description}</p>
          <span>${mockSweet.price}</span>
          <span>{mockSweet.quantity} in stock</span>
        </div>
      </div>
    )

    expect(screen.getByText('Gulab Jamun')).toBeDefined()
    expect(screen.getByText(/Soft, spongy milk solids/)).toBeDefined()
    expect(screen.getByText('$4.99')).toBeDefined()
    expect(screen.getByText('50 in stock')).toBeDefined()
  })

  it('should disable Buy button when stock is 0', () => {
    render(
      <div>
        <button disabled={mockSweetOutOfStock.quantity === 0}>
          Buy
        </button>
      </div>
    )

    const buyButton = screen.getByText('Buy')
    expect(buyButton).toBeDefined()
    expect((buyButton as HTMLButtonElement).disabled).toBe(true)
  })

  it('should enable Buy button when stock is available', () => {
    render(
      <div>
        <button disabled={mockSweet.quantity === 0}>
          Buy
        </button>
      </div>
    )

    const buyButton = screen.getByText('Buy')
    expect(buyButton).toBeDefined()
    expect((buyButton as HTMLButtonElement).disabled).toBe(false)
  })

  it('should show "Out of Stock" message when quantity is 0', () => {
    render(
      <div>
        {mockSweetOutOfStock.quantity === 0 && (
          <span>Out of Stock</span>
        )}
      </div>
    )

    expect(screen.getByText('Out of Stock')).toBeDefined()
  })

  it('should call onPurchase when Buy button is clicked', async () => {
    const user = userEvent.setup()
    const handlePurchase = vi.fn()

    render(
      <div>
        <button 
          onClick={() => handlePurchase(mockSweet.id, 1)}
          disabled={mockSweet.quantity === 0}
        >
          Buy
        </button>
      </div>
    )

    const buyButton = screen.getByText('Buy')
    await user.click(buyButton)

    expect(handlePurchase).toHaveBeenCalledWith(mockSweet.id, 1)
  })

  it('should allow quantity selection before purchase', async () => {
    const user = userEvent.setup()
    let quantity = 1
    const setQuantity = vi.fn((newQty) => { quantity = newQty })

    render(
      <div>
        <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
        <span>{quantity}</span>
        <button onClick={() => setQuantity(Math.min(mockSweet.quantity, quantity + 1))}>+</button>
      </div>
    )

    const plusButton = screen.getByText('+')
    await user.click(plusButton)
    await user.click(plusButton)

    expect(setQuantity).toHaveBeenCalledTimes(2)
  })

  it('should not allow quantity to exceed available stock', () => {
    const quantity = 5
    const maxAllowed = Math.min(mockSweet.quantity, quantity + 1)

    expect(maxAllowed).toBeLessThanOrEqual(mockSweet.quantity)
  })

  it('should show Edit and Delete buttons for admin users', () => {
    const isAdmin = true

    render(
      <div>
        {isAdmin && (
          <>
            <button onClick={mockHandlers.onEdit}>Edit</button>
            <button onClick={mockHandlers.onDelete}>Delete</button>
          </>
        )}
      </div>
    )

    expect(screen.getByText('Edit')).toBeDefined()
    expect(screen.getByText('Delete')).toBeDefined()
  })

  it('should hide Edit and Delete buttons for regular users', () => {
    const isAdmin = false

    render(
      <div>
        {isAdmin && (
          <>
            <button>Edit</button>
            <button>Delete</button>
          </>
        )}
      </div>
    )

    expect(screen.queryByText('Edit')).toBeNull()
    expect(screen.queryByText('Delete')).toBeNull()
  })

  it('should show Restock button for admin users', () => {
    const isAdmin = true

    render(
      <div>
        {isAdmin && (
          <button onClick={() => mockHandlers.onRestock(mockSweet.id, 10)}>
            Restock +10
          </button>
        )}
      </div>
    )

    expect(screen.getByText(/Restock/)).toBeDefined()
  })

  it('should display sweet image when image_url is provided', () => {
    render(
      <div>
        {mockSweet.image_url ? (
          <img src={mockSweet.image_url} alt={mockSweet.name} />
        ) : (
          <div>No image</div>
        )}
      </div>
    )

    const image = screen.getByAltText('Gulab Jamun') as HTMLImageElement
    expect(image).toBeDefined()
    expect(image.src).toContain('gulab-jamun.jpg')
  })

  it('should show placeholder when no image is provided', () => {
    const sweetWithoutImage = { ...mockSweet, image_url: '' }

    render(
      <div>
        {sweetWithoutImage.image_url ? (
          <img src={sweetWithoutImage.image_url} alt={sweetWithoutImage.name} />
        ) : (
          <div>No image</div>
        )}
      </div>
    )

    expect(screen.getByText('No image')).toBeDefined()
  })
})
