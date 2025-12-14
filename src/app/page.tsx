"use client"

import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { motion } from "framer-motion"
import { Crown, Sparkles, Star, ArrowRight, Shield, Truck, Award } from "lucide-react"
import Link from "next/link"

function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-20 left-10 w-72 h-72 bg-[#D4AF37]/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute top-40 right-20 w-96 h-96 bg-[#D4AF37]/8 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '1.5s' }} />
      <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-white/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '3s' }} />
    </div>
  )
}

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
      <FloatingOrbs />
      
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.06),transparent_60%)]" />
      
      <div className="relative z-10 text-center max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass mb-10">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-sm text-white/70 tracking-wide">Est. 1889 • Artisan Heritage</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl lg:text-[120px] font-bold tracking-tight mb-8 leading-[0.95]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            <span className="text-white">Maison du</span>
            <br />
            <span className="text-[#D4AF37]">Chocolat</span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
            Experience the pinnacle of artisanal chocolate craftsmanship.
            <br className="hidden md:block" />
            Where centuries of tradition meet contemporary refinement.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/login"
            className="group relative px-10 py-4 bg-[#D4AF37] rounded-full font-medium text-black overflow-hidden transition-all hover:shadow-[0_0_50px_rgba(212,175,55,0.3)] hover:scale-[1.02]"
          >
            <span className="relative z-10 flex items-center gap-2" style={{ fontFamily: "'Inter', sans-serif" }}>
              Enter Boutique
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
          
          <Link
            href="/register"
            className="px-10 py-4 glass-premium rounded-full font-medium text-white hover:bg-white/[0.08] transition-all border border-white/10"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Membership
          </Link>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.8 }}
          className="mt-24 grid grid-cols-3 gap-12 max-w-2xl mx-auto"
        >
          {[
            { icon: Shield, label: "Secure", sublabel: "Transactions" },
            { icon: Truck, label: "Express", sublabel: "Delivery" },
            { icon: Award, label: "Artisan", sublabel: "Quality" },
          ].map((item, i) => (
            <div key={i} className="text-center group cursor-default">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full glass-premium flex items-center justify-center border border-[#D4AF37]/20 transition-all group-hover:border-[#D4AF37]/40 group-hover:shadow-[0_0_20px_rgba(212,175,55,0.15)]">
                <item.icon className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <p className="text-sm font-medium text-white mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>{item.label}</p>
              <p className="text-xs text-white/40">{item.sublabel}</p>
            </div>
          ))}
        </motion.div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}

function FeaturedSection() {
  const categories = [
    { name: "Dark Collection", image: "https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=500", count: 24, accent: "85% Cacao" },
    { name: "Signature Truffles", image: "https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=500", count: 18, accent: "Hand Rolled" },
    { name: "Pralines", image: "https://images.unsplash.com/photo-1575224300306-1b8da36134ec?w=500", count: 32, accent: "Belgian Style" },
    { name: "Ganache", image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500", count: 12, accent: "Limited Edition" },
  ]
  
  return (
    <section className="relative py-40 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            <span className="text-white">Curated</span>{" "}
            <span className="text-[#D4AF37]">Collections</span>
          </h2>
          <p className="text-white/40 max-w-lg mx-auto text-lg" style={{ fontFamily: "'Inter', sans-serif" }}>
            Explore our meticulously crafted selections
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category, i) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[800ms] ease-out group-hover:scale-110"
                style={{ backgroundImage: `url(${category.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[#D4AF37]/10" />
              
              <div className="absolute inset-0 border border-white/10 rounded-2xl group-hover:border-[#D4AF37]/30 transition-colors duration-500" />
              
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <p className="text-xs text-[#D4AF37] mb-2 tracking-wider uppercase">{category.accent}</p>
                <h3 className="text-2xl font-semibold text-white mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{category.name}</h3>
                <p className="text-xs text-white/40">{category.count} variations</p>
              </div>
              
              <div className="absolute top-6 right-6 w-12 h-12 rounded-full glass-premium border border-[#D4AF37]/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
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
    { name: "Victoria Ashford", text: "The single-origin Venezuelan dark chocolate is nothing short of extraordinary. A revelation in every bite.", rating: 5, title: "Connoisseur" },
    { name: "Jonathan Pierce", text: "Impeccable craftsmanship. The attention to detail in both flavor and presentation is unmatched.", rating: 5, title: "Sommelier" },
    { name: "Élise Laurent", text: "These truffles transport you to the finest chocolateries of Europe. Absolutely sublime.", rating: 5, title: "Critic" },
  ]
  
  return (
    <section className="relative py-40 px-6 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-[#D4AF37]/5 rounded-full blur-[200px]" />
      
      <div className="relative max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            <span className="text-white">Client</span>{" "}
            <span className="text-[#D4AF37]">Testimonials</span>
          </h2>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.8 }}
              className="glass-premium rounded-2xl p-10 border border-white/10 hover:border-[#D4AF37]/20 transition-all duration-500"
            >
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />
                ))}
              </div>
              <p className="text-white/60 mb-8 leading-relaxed text-[15px]" style={{ fontFamily: "'Inter', sans-serif" }}>{testimonial.text}</p>
              <div>
                <p className="text-sm font-medium text-white mb-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>{testimonial.name}</p>
                <p className="text-xs text-white/30">{testimonial.title}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  return (
    <section className="relative py-40 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-3xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/10 via-white/5 to-[#D4AF37]/5" />
          <div className="absolute inset-0 glass-premium" />
          <div className="absolute inset-0 border border-[#D4AF37]/20 rounded-3xl" />
          
          <div className="relative z-10 text-center py-24 px-8">
            <Crown className="w-16 h-16 mx-auto mb-10 text-[#D4AF37]" />
            <h2 className="text-4xl md:text-6xl font-bold mb-8 text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Begin Your Journey
            </h2>
            <p className="text-white/50 max-w-lg mx-auto mb-10 text-lg leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
              Join our exclusive membership for privileged access to limited editions and bespoke creations.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-10 py-4 bg-[#D4AF37] text-black rounded-full font-medium hover:bg-[#C9A557] transition-all hover:shadow-[0_0_40px_rgba(212,175,55,0.3)] hover:scale-[1.02]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Become a Member
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
    <footer className="relative py-20 px-6 border-t border-white/[0.08]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center">
              <Crown className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Maison du Chocolat
            </span>
          </div>
          
          <div className="flex items-center gap-10 text-sm text-white/40" style={{ fontFamily: "'Inter', sans-serif" }}>
            <Link href="/login" className="hover:text-white transition-colors">Login</Link>
            <Link href="/register" className="hover:text-white transition-colors">Register</Link>
            <Link href="/dashboard" className="hover:text-white transition-colors">Boutique</Link>
          </div>
          
          <p className="text-sm text-white/30" style={{ fontFamily: "'Inter', sans-serif" }}>
            © 2024 Maison du Chocolat
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
        <div className="w-12 h-12 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
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