'use client'

import { motion } from 'motion/react'
import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

interface PageHeroProps {
  title: string
  subtitle?: string
  breadcrumb?: { label: string; href: string }[]
}

export function PageHero({ title, subtitle, breadcrumb }: PageHeroProps) {
  return (
    <section className="relative pt-32 pb-16 overflow-hidden" aria-label={`${title} page header`}>
      {/* Grid bg */}
      <div className="absolute inset-0 hero-grid opacity-40" aria-hidden="true" />
      {/* Glow */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, hsl(162 69% 37% / 0.15) 0%, transparent 70%)' }}
      />

      <div className="section-container relative z-10">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
            <Home className="w-3.5 h-3.5" />
            Home
          </Link>
          {breadcrumb?.map((crumb) => (
            <span key={crumb.href} className="flex items-center gap-1.5">
              <ChevronRight className="w-3.5 h-3.5 opacity-40" />
              <Link href={crumb.href} className="hover:text-primary transition-colors">{crumb.label}</Link>
            </span>
          ))}
          <ChevronRight className="w-3.5 h-3.5 opacity-40" />
          <span className="text-foreground font-medium">{title}</span>
        </nav>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-foreground mb-3">
            {title}
          </h1>
          {subtitle && (
            <p className="text-muted-foreground text-lg max-w-2xl">{subtitle}</p>
          )}
        </motion.div>

        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8 h-px origin-left"
          style={{ background: 'linear-gradient(to right, hsl(var(--primary)), transparent)' }}
        />
      </div>
    </section>
  )
}
