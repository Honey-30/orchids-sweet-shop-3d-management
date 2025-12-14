"use client"

import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Candy, Search, Filter, LogOut, ShoppingBag, Package, 
  Plus, X, Edit2, Trash2, RefreshCw, Loader2, User,
  ChevronDown, Minus
} from "lucide-react"
import { toast } from "sonner"
import { Sweet } from "@/lib/types"
import Image from "next/image"

const categories = ["All", "Chocolate", "Pastry", "Candy", "Ice Cream", "Fudge"]

function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const router = useRouter()
  
  const handleLogout = () => {
    logout()
    router.push("/")
  }
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
              <Candy className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
              Luxe Sweet Shop
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full glass">
              <User className="w-4 h-4 text-pink-400" />
              <span className="text-sm text-white">{user?.name}</span>
              {isAdmin && (
                <span className="px-2 py-0.5 text-[10px] bg-amber-500/20 text-amber-400 rounded-full">
                  Admin
                </span>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="p-2.5 rounded-full glass hover:bg-white/10 transition-colors"
            >
              <LogOut className="w-5 h-5 text-white/70" />
            </button>
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
      exit={{ opacity: 0, scale: 0.9 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative rounded-3xl overflow-hidden glass"
    >
      <div className="relative aspect-square overflow-hidden">
        {sweet.image_url ? (
          <Image
            src={sweet.image_url}
            alt={sweet.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center">
            <Candy className="w-16 h-16 text-white/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-white/10 backdrop-blur-sm text-white">
            {sweet.category}
          </span>
        </div>
        
        {sweet.quantity === 0 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="px-4 py-2 bg-red-500/20 text-red-400 rounded-full text-sm font-medium">
              Out of Stock
            </span>
          </div>
        )}
        
        <AnimatePresence>
          {isHovered && isAdmin && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-4 right-4 flex gap-2"
            >
              <button
                onClick={() => onEdit(sweet)}
                className="p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
              >
                <Edit2 className="w-4 h-4 text-white" />
              </button>
              <button
                onClick={() => onDelete(sweet.id)}
                className="p-2 rounded-full bg-red-500/20 backdrop-blur-sm hover:bg-red-500/30 transition-colors"
              >
                <Trash2 className="w-4 h-4 text-red-400" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-white text-lg">{sweet.name}</h3>
            <p className="text-sm text-white/50 line-clamp-1">{sweet.description}</p>
          </div>
          <span className="text-xl font-bold text-pink-400">${sweet.price}</span>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-white/40">
            {sweet.quantity} in stock
          </span>
          
          {isAdmin && (
            <button
              onClick={() => onRestock(sweet.id, 10)}
              className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              Restock +10
            </button>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 glass rounded-xl px-3 py-2">
            <button 
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="text-white/50 hover:text-white transition-colors"
              disabled={quantity <= 1}
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center text-white font-medium">{quantity}</span>
            <button 
              onClick={() => setQuantity(Math.min(sweet.quantity, quantity + 1))}
              className="text-white/50 hover:text-white transition-colors"
              disabled={quantity >= sweet.quantity}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          <button
            onClick={handlePurchase}
            disabled={sweet.quantity === 0 || purchasing}
            className="flex-1 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl font-medium text-white text-sm hover:shadow-[0_0_20px_rgba(236,72,153,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {purchasing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                Buy
              </>
            )}
          </button>
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
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg glass rounded-3xl p-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
            {sweet ? "Edit Sweet" : "Add New Sweet"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-white/70" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-pink-500/50 transition-all"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-pink-500/50 transition-all resize-none h-20"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-pink-500/50 transition-all"
              >
                {categories.slice(1).map(cat => (
                  <option key={cat} value={cat} className="bg-gray-900">{cat}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Price ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-pink-500/50 transition-all"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Quantity</label>
              <input
                type="number"
                min="0"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-pink-500/50 transition-all"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Image URL</label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-pink-500/50 transition-all"
                placeholder="https://..."
              />
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl glass hover:bg-white/10 transition-colors text-white font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl font-medium text-white hover:shadow-[0_0_20px_rgba(236,72,153,0.3)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save"}
            </button>
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
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm glass rounded-3xl p-8"
      >
        <h2 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
          Restock {sweet.name}
        </h2>
        <p className="text-sm text-white/50 mb-6">Current stock: {sweet.quantity}</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Add Quantity</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-pink-500/50 transition-all"
              required
            />
          </div>
          
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl glass hover:bg-white/10 transition-colors text-white font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={restocking}
              className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl font-medium text-white hover:shadow-[0_0_20px_rgba(251,191,36,0.3)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {restocking ? <Loader2 className="w-5 h-5 animate-spin" /> : "Restock"}
            </button>
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
        toast.success(`Purchased ${quantity}x ${data.purchase.sweet_name} for $${data.purchase.total_amount.toFixed(2)}!`)
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
        toast.success(editingSweet ? "Sweet updated!" : "Sweet added!")
        fetchSweets()
      } else {
        const error = await response.json()
        toast.error(error.message)
      }
    } catch {
      toast.error("Failed to save sweet")
    }
  }
  
  const handleDeleteSweet = async (id: string) => {
    if (!confirm("Are you sure you want to delete this sweet?")) return
    
    try {
      const response = await fetch(`/api/sweets/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (response.ok) {
        toast.success("Sweet deleted!")
        fetchSweets()
      } else {
        const error = await response.json()
        toast.error(error.message)
      }
    } catch {
      toast.error("Failed to delete sweet")
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
        toast.success(`Restocked! New total: ${data.new_total}`)
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
        <div className="w-12 h-12 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="absolute top-0 left-0 w-full h-[500px] overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-pink-500/10 rounded-full blur-[100px]" />
        <div className="absolute top-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]" />
      </div>
      
      <main className="relative max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              Sweet Collection
            </h1>
            <p className="text-white/50">
              {filteredSweets.length} premium sweets available
            </p>
          </div>
          
          {isAdmin && (
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl font-medium text-white hover:shadow-[0_0_30px_rgba(236,72,153,0.4)] transition-all"
            >
              <Plus className="w-5 h-5" />
              Add Sweet
            </button>
          )}
        </div>
        
        <div className="flex flex-col lg:flex-row gap-4 mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
            <input
              type="text"
              placeholder="Search sweets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-pink-500/50 transition-all"
            />
          </div>
          
          <div className="flex gap-3">
            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-5 py-3.5 glass rounded-xl hover:bg-white/10 transition-colors"
              >
                <Filter className="w-5 h-5 text-white/70" />
                <span className="text-white">Filters</span>
                <ChevronDown className={`w-4 h-4 text-white/50 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 top-full mt-2 w-72 glass rounded-2xl p-5 z-20"
                  >
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-white/70 mb-3">Price Range</label>
                      <div className="flex items-center gap-3">
                        <input
                          type="number"
                          value={priceRange[0]}
                          onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-pink-500/50"
                          placeholder="Min"
                        />
                        <span className="text-white/30">-</span>
                        <input
                          type="number"
                          value={priceRange[1]}
                          onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 100])}
                          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-pink-500/50"
                          placeholder="Max"
                        />
                      </div>
                    </div>
                    
                    <button
                      onClick={() => {
                        setPriceRange([0, 100])
                        setSelectedCategory("All")
                        setSearchQuery("")
                      }}
                      className="w-full py-2 text-sm text-pink-400 hover:text-pink-300 transition-colors"
                    >
                      Reset Filters
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3 mb-10 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                  : "glass text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredSweets.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-16 h-16 mx-auto mb-4 text-white/20" />
            <h3 className="text-xl font-semibold text-white mb-2">No sweets found</h3>
            <p className="text-white/50">Try adjusting your filters or search query</p>
          </div>
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
