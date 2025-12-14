"use client"

import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Candy, Search, Filter, LogOut, ShoppingBag, Package, 
  Plus, X, Edit2, Trash2, RefreshCw, Loader2, User,
  ChevronDown, Minus, Crown, Sparkles
} from "lucide-react"
import { toast } from "sonner"
import { Sweet } from "@/lib/types"
import Image from "next/image"

const categories = ["All", "Chocolate", "Candy"]

function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const router = useRouter()
  
  const handleLogout = () => {
    logout()
    router.push("/")
  }
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-gold blur-md opacity-50"></div>
              <div className="relative w-11 h-11 rounded-xl bg-gradient-gold flex items-center justify-center shadow-lg">
                <Candy className="w-6 h-6 text-black" />
              </div>
            </div>
            <div>
              <span className="text-xl font-bold text-white tracking-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Maison du Chocolat
              </span>
              <p className="text-[10px] text-white/40 tracking-[0.2em] uppercase font-medium">Premium Confections</p>
            </div>
          </motion.div>
          
          <div className="flex items-center gap-4">
            <motion.div 
              className="hidden md:flex items-center gap-3 px-5 py-2.5 rounded-xl glass-light"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-gold/20 flex items-center justify-center">
                <User className="w-4 h-4 text-[#D4AF37]" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-white leading-none">{user?.name}</span>
                {isAdmin && (
                  <div className="flex items-center gap-1 mt-1">
                    <Crown className="w-3 h-3 text-[#D4AF37]" />
                    <span className="text-[10px] text-[#D4AF37] font-medium tracking-wide">ADMINISTRATOR</span>
                  </div>
                )}
              </div>
            </motion.div>
            <motion.button
              onClick={handleLogout}
              className="p-3 rounded-xl glass-light hover:bg-white/5 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <LogOut className="w-5 h-5 text-white/60" />
            </motion.button>
          </div>
        </div>
      </div>
    </nav>
  )
}

function SweetCard({ 
  sweet, 
  onPurchase, 
  onEdit, 
  onDelete, 
  onRestock,
  isAdmin 
}: { 
  sweet: Sweet
  onPurchase: (id: string, qty: number) => void
  onEdit: (sweet: Sweet) => void
  onDelete: (id: string) => void
  onRestock: (id: string, qty: number) => void
  isAdmin: boolean
}) {
  const [quantity, setQuantity] = useState(1)
  const [isHovered, setIsHovered] = useState(false)
  const [purchasing, setPurchasing] = useState(false)
  
  const handlePurchase = async () => {
    setPurchasing(true)
    await onPurchase(sweet.id, quantity)
    setPurchasing(false)
    setQuantity(1)
  }
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative rounded-2xl overflow-hidden glass luxury-border"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-black/20">
        {sweet.image_url ? (
          <Image
            src={sweet.image_url}
            alt={sweet.name}
            fill
            unoptimized
            className="object-cover transition-all duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/10 to-black/40 flex items-center justify-center">
            <Candy className="w-20 h-20 text-white/10" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        <div className="absolute top-4 left-4">
          <motion.span 
            className="px-3 py-1.5 text-[10px] font-medium tracking-wider uppercase rounded-lg glass-light text-white/80"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {sweet.category}
          </motion.span>
        </div>
        
        {sweet.quantity === 0 && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-red-500/20 flex items-center justify-center">
                <Package className="w-6 h-6 text-red-400" />
              </div>
              <span className="px-4 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-xs font-medium tracking-wide uppercase">
                Out of Stock
              </span>
            </div>
          </div>
        )}
        
        <AnimatePresence>
          {isHovered && isAdmin && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-4 right-4 flex gap-2"
            >
              <motion.button
                onClick={() => onEdit(sweet)}
                className="p-2.5 rounded-lg glass-strong hover:bg-[#D4AF37]/20 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Edit2 className="w-4 h-4 text-[#D4AF37]" />
              </motion.button>
              <motion.button
                onClick={() => onDelete(sweet.id)}
                className="p-2.5 rounded-lg glass-strong hover:bg-red-500/20 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Trash2 className="w-4 h-4 text-red-400" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="p-6">
        <div className="mb-4">
          <h3 className="font-semibold text-white text-lg mb-1 tracking-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            {sweet.name}
          </h3>
          <p className="text-sm text-white/40 line-clamp-2 leading-relaxed">{sweet.description}</p>
        </div>
        
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#D4AF37]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              ${sweet.price}
            </span>
            <span className="text-xs text-white/30">USD</span>
          </div>
          <div className="text-right">
            <div className="text-xs text-white/30 uppercase tracking-wider mb-0.5">Stock</div>
            <div className="text-sm font-medium text-white">{sweet.quantity}</div>
          </div>
        </div>
        
        {isAdmin && (
          <motion.button
            onClick={() => onRestock(sweet.id, 10)}
            className="w-full mb-3 flex items-center justify-center gap-2 text-xs text-[#D4AF37] hover:text-[#F4E4B1] transition-colors py-2 rounded-lg glass-light hover:bg-[#D4AF37]/5"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Restock +10 Units
          </motion.button>
        )}
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 glass-light rounded-lg px-3 py-2">
            <motion.button 
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="text-white/40 hover:text-white transition-colors"
              disabled={quantity <= 1}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Minus className="w-4 h-4" />
            </motion.button>
            <span className="w-8 text-center text-white font-medium">{quantity}</span>
            <motion.button 
              onClick={() => setQuantity(Math.min(sweet.quantity, quantity + 1))}
              className="text-white/40 hover:text-white transition-colors"
              disabled={quantity >= sweet.quantity}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Plus className="w-4 h-4" />
            </motion.button>
          </div>
          
          <motion.button
            onClick={handlePurchase}
            disabled={sweet.quantity === 0 || purchasing}
            className="flex-1 py-2.5 bg-gradient-gold rounded-lg font-medium text-black text-sm hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {purchasing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                Purchase
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

function AddEditModal({ 
  sweet, 
  onClose, 
  onSave 
}: { 
  sweet: Sweet | null
  onClose: () => void
  onSave: (data: Partial<Sweet>) => void
}) {
  const [formData, setFormData] = useState({
    name: sweet?.name || "",
    description: sweet?.description || "",
    category: sweet?.category || "Chocolate",
    price: sweet?.price?.toString() || "",
    quantity: sweet?.quantity?.toString() || "0",
    image_url: sweet?.image_url || ""
  })
  const [saving, setSaving] = useState(false)
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await onSave({
      ...formData,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity)
    })
    setSaving(false)
    onClose()
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl glass-strong rounded-2xl p-8 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {sweet ? "Edit Product" : "Add New Product"}
            </h2>
            <p className="text-sm text-white/40">
              {sweet ? "Update product details below" : "Enter product information"}
            </p>
          </div>
          <motion.button
            onClick={onClose}
            className="p-2.5 rounded-lg glass-light hover:bg-white/5 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <X className="w-5 h-5 text-white/60" />
          </motion.button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Product Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3.5 rounded-xl glass-light text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 transition-all"
              placeholder="e.g., Belgian Dark Truffle"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3.5 rounded-xl glass-light text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 transition-all resize-none h-24"
              placeholder="Describe the product..."
            />
          </div>
          
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3.5 rounded-xl glass-light text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 transition-all"
              >
                {categories.slice(1).map(cat => (
                  <option key={cat} value={cat} className="bg-[#0A0A0A]">{cat}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Price (USD)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-3.5 rounded-xl glass-light text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 transition-all"
                placeholder="0.00"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Stock Quantity</label>
              <input
                type="number"
                min="0"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full px-4 py-3.5 rounded-xl glass-light text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 transition-all"
                placeholder="0"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Image URL</label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="w-full px-4 py-3.5 rounded-xl glass-light text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 transition-all"
                placeholder="https://..."
              />
            </div>
          </div>
          
          <div className="flex gap-3 pt-6">
            <motion.button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 rounded-xl glass-light hover:bg-white/5 transition-colors text-white font-medium"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              disabled={saving}
              className="flex-1 py-3.5 bg-gradient-gold rounded-xl font-medium text-black hover:shadow-[0_0_40px_rgba(212,175,55,0.5)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Changes"}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

function RestockModal({ 
  sweet, 
  onClose, 
  onRestock 
}: { 
  sweet: Sweet
  onClose: () => void
  onRestock: (id: string, qty: number) => void
}) {
  const [quantity, setQuantity] = useState("10")
  const [restocking, setRestocking] = useState(false)
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setRestocking(true)
    await onRestock(sweet.id, parseInt(quantity))
    setRestocking(false)
    onClose()
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md glass-strong rounded-2xl p-8 shadow-2xl"
      >
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-gold/20 flex items-center justify-center">
            <RefreshCw className="w-8 h-8 text-[#D4AF37]" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Restock Product
          </h2>
          <p className="text-sm text-white/40">
            Add inventory for <span className="text-white font-medium">{sweet.name}</span>
          </p>
          <div className="mt-3 px-4 py-2 rounded-lg glass-light inline-block">
            <span className="text-xs text-white/50">Current Stock: </span>
            <span className="text-sm font-bold text-[#D4AF37]">{sweet.quantity}</span>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Quantity to Add</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl glass-light text-white text-center text-lg font-bold placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 transition-all"
              required
            />
            <p className="text-xs text-white/30 mt-2 text-center">
              New total: {sweet.quantity + parseInt(quantity || "0")} units
            </p>
          </div>
          
          <div className="flex gap-3">
            <motion.button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 rounded-xl glass-light hover:bg-white/5 transition-colors text-white font-medium"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              disabled={restocking}
              className="flex-1 py-3.5 bg-gradient-gold rounded-xl font-medium text-black hover:shadow-[0_0_40px_rgba(212,175,55,0.5)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              {restocking ? <Loader2 className="w-5 h-5 animate-spin" /> : "Confirm Restock"}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

export default function DashboardPage() {
  const { user, token, isLoading, isAdmin } = useAuth()
  const router = useRouter()
  const [sweets, setSweets] = useState<Sweet[]>([])
  const [filteredSweets, setFilteredSweets] = useState<Sweet[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100])
  const [showFilters, setShowFilters] = useState(false)
  const [editingSweet, setEditingSweet] = useState<Sweet | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [restockSweet, setRestockSweet] = useState<Sweet | null>(null)
  
  const fetchSweets = useCallback(async () => {
    if (!token) return
    
    try {
      const response = await fetch("/api/sweets", {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (response.ok) {
        const data = await response.json()
        setSweets(data.sweets)
        setFilteredSweets(data.sweets)
      }
    } catch {
      toast.error("Failed to load sweets")
    } finally {
      setLoading(false)
    }
  }, [token])
  
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])
  
  useEffect(() => {
    if (token) {
      fetchSweets()
    }
  }, [token, fetchSweets])
  
  useEffect(() => {
    let filtered = sweets
    
    if (searchQuery) {
      filtered = filtered.filter(s => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    if (selectedCategory !== "All") {
      filtered = filtered.filter(s => s.category === selectedCategory)
    }
    
    filtered = filtered.filter(s => 
      s.price >= priceRange[0] && s.price <= priceRange[1]
    )
    
    setFilteredSweets(filtered)
  }, [searchQuery, selectedCategory, priceRange, sweets])
  
  const handlePurchase = async (id: string, quantity: number) => {
    try {
      const response = await fetch(`/api/sweets/${id}/purchase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ quantity })
      })
      
      if (response.ok) {
        const data = await response.json()
        toast.success(`Purchased ${quantity}x ${data.purchase.sweet_name} for $${data.purchase.total_amount.toFixed(2)}`)
        fetchSweets()
      } else {
        const error = await response.json()
        toast.error(error.message)
      }
    } catch {
      toast.error("Purchase failed")
    }
  }
  
  const handleSaveSweet = async (data: Partial<Sweet>) => {
    try {
      const url = editingSweet ? `/api/sweets/${editingSweet.id}` : "/api/sweets"
      const method = editingSweet ? "PUT" : "POST"
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
      })
      
      if (response.ok) {
        toast.success(editingSweet ? "Product updated successfully" : "Product added successfully")
        fetchSweets()
      } else {
        const error = await response.json()
        toast.error(error.message)
      }
    } catch {
      toast.error("Failed to save product")
    }
  }
  
  const handleDeleteSweet = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return
    
    try {
      const response = await fetch(`/api/sweets/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (response.ok) {
        toast.success("Product deleted successfully")
        fetchSweets()
      } else {
        const error = await response.json()
        toast.error(error.message)
      }
    } catch {
      toast.error("Failed to delete product")
    }
  }
  
  const handleRestock = async (id: string, quantity: number) => {
    try {
      const response = await fetch(`/api/sweets/${id}/restock`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ quantity })
      })
      
      if (response.ok) {
        const data = await response.json()
        toast.success(`Restocked successfully! New total: ${data.new_total} units`)
        fetchSweets()
      } else {
        const error = await response.json()
        toast.error(error.message)
      }
    } catch {
      toast.error("Failed to restock")
    }
  }
  
  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-white/40">Loading...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-background noise">
      <Navbar />
      
      <div className="absolute top-0 left-0 w-full h-[600px] overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-[120px]" />
        <div className="absolute top-40 right-20 w-[500px] h-[500px] bg-[#D4AF37]/3 rounded-full blur-[150px]" />
      </div>
      
      <main className="relative max-w-[1400px] mx-auto px-6 pt-32 pb-24">
        <motion.div 
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-[#D4AF37]" />
              <span className="text-xs text-white/40 tracking-[0.2em] uppercase font-medium">Premium Collection</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-3 tracking-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Artisan Confections
            </h1>
            <p className="text-white/40 text-lg">
              {filteredSweets.length} exquisite {filteredSweets.length === 1 ? 'product' : 'products'} available
            </p>
          </div>
          
          {isAdmin && (
            <motion.button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-gold rounded-xl font-medium text-black hover:shadow-[0_0_40px_rgba(212,175,55,0.4)] transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="w-5 h-5" />
              Add Product
            </motion.button>
          )}
        </motion.div>
        
        <motion.div 
          className="flex flex-col lg:flex-row gap-4 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="relative flex-1">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-5 py-4 rounded-xl glass-light text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 transition-all"
            />
          </div>
          
          <div className="flex gap-3">
            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-3 px-6 py-4 glass-light rounded-xl hover:bg-white/5 transition-all"
              >
                <Filter className="w-5 h-5 text-white/60" />
                <span className="text-white font-medium">Filters</span>
                <ChevronDown className={`w-4 h-4 text-white/40 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 top-full mt-3 w-80 glass-strong rounded-2xl p-6 z-20 shadow-2xl"
                  >
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-white/70 mb-4">Price Range</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="number"
                          value={priceRange[0]}
                          onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                          className="w-full px-4 py-3 rounded-lg glass-light text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
                          placeholder="Min"
                        />
                        <span className="text-white/30">—</span>
                        <input
                          type="number"
                          value={priceRange[1]}
                          onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 100])}
                          className="w-full px-4 py-3 rounded-lg glass-light text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
                          placeholder="Max"
                        />
                      </div>
                    </div>
                    
                    <motion.button
                      onClick={() => {
                        setPriceRange([0, 100])
                        setSelectedCategory("All")
                        setSearchQuery("")
                      }}
                      className="w-full py-2.5 text-sm text-[#D4AF37] hover:text-[#F4E4B1] transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Reset All Filters
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="flex gap-3 mb-12 overflow-x-auto pb-2 scrollbar-hide"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {categories.map(category => (
            <motion.button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? "bg-gradient-gold text-black shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                  : "glass-light text-white/60 hover:text-white hover:bg-white/5"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>
        
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-white/40">Loading products...</p>
            </div>
          </div>
        ) : filteredSweets.length === 0 ? (
          <motion.div 
            className="text-center py-32"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl glass-light flex items-center justify-center">
              <Package className="w-10 h-10 text-white/20" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              No Products Found
            </h3>
            <p className="text-white/40">Try adjusting your filters or search criteria</p>
          </motion.div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredSweets.map(sweet => (
                <SweetCard
                  key={sweet.id}
                  sweet={sweet}
                  isAdmin={isAdmin}
                  onPurchase={handlePurchase}
                  onEdit={(s) => setEditingSweet(s)}
                  onDelete={handleDeleteSweet}
                  onRestock={(id) => {
                    const s = sweets.find(sw => sw.id === id)
                    if (s) setRestockSweet(s)
                  }}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>
      
      <AnimatePresence>
        {(showAddModal || editingSweet) && (
          <AddEditModal
            sweet={editingSweet}
            onClose={() => {
              setShowAddModal(false)
              setEditingSweet(null)
            }}
            onSave={handleSaveSweet}
          />
        )}
        
        {restockSweet && (
          <RestockModal
            sweet={restockSweet}
            onClose={() => setRestockSweet(null)}
            onRestock={handleRestock}
          />
        )}
      </AnimatePresence>
    </div>
  )
}