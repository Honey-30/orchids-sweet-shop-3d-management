"use client"

import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { motion } from "framer-motion"
import { Candy, Sparkles, Star, ArrowRight, Shield, Truck, Award } from "lucide-react"
import Link from "next/link"

function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-20 left-10 w-72 h-72 bg-pink-500/20 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500/15 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-amber-500/15 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-40 right-10 w-64 h-64 bg-pink-400/10 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '0.5s' }} />
    </div>
  )
}

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
      <FloatingOrbs />
      
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(236,72,153,0.08),transparent_50%)]" />
      
      <div className="relative z-10 text-center max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-white/80">Premium Artisan Collection</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            <span className="text-white">Luxe</span>
            <br />
            <span className="gradient-text">Sweet Shop</span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
            Discover an exquisite collection of handcrafted confections, 
            where artisanal tradition meets contemporary elegance.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/login"
            className="group relative px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full font-medium text-white overflow-hidden transition-all hover:shadow-[0_0_40px_rgba(236,72,153,0.4)]"
          >
            <span className="relative z-10 flex items-center gap-2">
              Explore Collection
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
          
          <Link
            href="/register"
            className="px-8 py-4 glass rounded-full font-medium text-white hover:bg-white/10 transition-all"
          >
            Create Account
          </Link>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-20 grid grid-cols-3 gap-8 max-w-lg mx-auto"
        >
          {[
            { icon: Shield, label: "Secure", sublabel: "Payments" },
            { icon: Truck, label: "Fast", sublabel: "Delivery" },
            { icon: Award, label: "Premium", sublabel: "Quality" },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full glass flex items-center justify-center">
                <item.icon className="w-5 h-5 text-pink-400" />
              </div>
              <p className="text-sm font-medium text-white">{item.label}</p>
              <p className="text-xs text-white/50">{item.sublabel}</p>
            </div>
          ))}
        </motion.div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}

function FeaturedSection() {
  const categories = [
    { name: "Chocolates", image: "https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=400", count: 24 },
    { name: "Pastries", image: "https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=400", count: 18 },
    { name: "Candies", image: "https://images.unsplash.com/photo-1575224300306-1b8da36134ec?w=400", count: 32 },
    { name: "Ice Cream", image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400", count: 12 },
  ]
  
  return (
    <section className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            <span className="text-white">Curated</span>{" "}
            <span className="gradient-text">Categories</span>
          </h2>
          <p className="text-white/50 max-w-md mx-auto">
            Explore our carefully curated selection of premium confections
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, i) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative aspect-[3/4] rounded-3xl overflow-hidden cursor-pointer"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${category.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-pink-500/20" />
              
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-xs text-pink-400 mb-1">{category.count} items</p>
                <h3 className="text-xl font-semibold text-white">{category.name}</h3>
              </div>
              
              <div className="absolute top-4 right-4 w-10 h-10 rounded-full glass flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                <ArrowRight className="w-4 h-4 text-white" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function TestimonialsSection() {
  const testimonials = [
    { name: "Sarah M.", text: "The Belgian truffles are absolutely divine. Best I've ever tasted!", rating: 5 },
    { name: "James K.", text: "Exceptional quality and beautiful packaging. Perfect for gifting.", rating: 5 },
    { name: "Emily R.", text: "The macarons melt in your mouth. Worth every penny!", rating: 5 },
  ]
  
  return (
    <section className="relative py-32 px-6 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/10 rounded-full blur-[150px]" />
      
      <div className="relative max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            <span className="text-white">What Our</span>{" "}
            <span className="gradient-text">Customers Say</span>
          </h2>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-3xl p-8"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-white/70 mb-6 leading-relaxed">{testimonial.text}</p>
              <p className="text-sm font-medium text-white">{testimonial.name}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  return (
    <section className="relative py-32 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-[40px] overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-amber-500/20" />
          <div className="absolute inset-0 glass" />
          
          <div className="relative z-10 text-center py-20 px-8">
            <Candy className="w-16 h-16 mx-auto mb-8 text-pink-400" />
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
              Ready to Indulge?
            </h2>
            <p className="text-white/60 max-w-md mx-auto mb-8">
              Join our exclusive membership and get access to limited edition sweets and special offers.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-all"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="relative py-16 px-6 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
              <Candy className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
              Luxe Sweet Shop
            </span>
          </div>
          
          <div className="flex items-center gap-8 text-sm text-white/50">
            <Link href="/login" className="hover:text-white transition-colors">Login</Link>
            <Link href="/register" className="hover:text-white transition-colors">Register</Link>
            <Link href="/dashboard" className="hover:text-white transition-colors">Shop</Link>
          </div>
          
          <p className="text-sm text-white/30">
            © 2024 Luxe Sweet Shop. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default function Home() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  
  useEffect(() => {
    if (!isLoading && user) {
      router.push("/dashboard")
    }
  }, [user, isLoading, router])
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }
  
  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <HeroSection />
      <FeaturedSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </main>
  )
}
