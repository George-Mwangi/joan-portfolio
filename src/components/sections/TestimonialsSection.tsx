'use client'
export const dynamic = 'force-dynamic'

import { motion } from 'motion/react'
import { Quote, Star } from 'lucide-react'

interface Testimonial {
  id: string
  authorName: string
  authorTitle?: string | null
  authorCompany?: string | null
  content: string
  rating: number
}

export function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <section id="testimonials" className="py-24" aria-label="Testimonials">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-medium tracking-widest uppercase">Reviews</span>
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-foreground mt-2 mb-4">
            Testimonials
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-2xl p-6 border border-border/50 flex flex-col"
            >
              <Quote className="w-8 h-8 text-primary/40 mb-4" />
              <p className="text-muted-foreground leading-relaxed flex-1">{t.content}</p>
              <div className="mt-5 pt-5 border-t border-border flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                  {t.authorName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">{t.authorName}</p>
                  {(t.authorTitle || t.authorCompany) && (
                    <p className="text-xs text-muted-foreground">
                      {[t.authorTitle, t.authorCompany].filter(Boolean).join(' · ')}
                    </p>
                  )}
                </div>
                <div className="ml-auto flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, si) => (
                    <Star
                      key={si}
                      className={`w-3.5 h-3.5 ${si < t.rating ? 'text-amber-400 fill-amber-400' : 'text-muted-foreground'}`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
