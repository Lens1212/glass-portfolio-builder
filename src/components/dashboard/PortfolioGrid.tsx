
import React from 'react'
import { GlassCard } from '@/components/ui/glass-card'
import { GlassButton } from '@/components/ui/glass-button'
import { Badge } from '@/components/ui/badge'
import { Eye, Edit, ExternalLink, Trash2, Calendar } from 'lucide-react'

interface Portfolio {
  id: string
  name: string
  description?: string
  is_published: boolean
  created_at: string
  slug: string
}

interface PortfolioGridProps {
  portfolios: Portfolio[]
  loading?: boolean
}

export function PortfolioGrid({ portfolios, loading }: PortfolioGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <GlassCard key={i} className="p-6 animate-pulse">
            <div className="space-y-4">
              <div className="h-4 bg-white/20 rounded w-3/4"></div>
              <div className="h-3 bg-white/10 rounded w-full"></div>
              <div className="h-3 bg-white/10 rounded w-2/3"></div>
              <div className="flex space-x-2">
                <div className="h-8 bg-white/10 rounded w-16"></div>
                <div className="h-8 bg-white/10 rounded w-16"></div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    )
  }

  if (portfolios.length === 0) {
    return (
      <GlassCard className="p-12 text-center">
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
            <Eye className="h-8 w-8 text-white/60" />
          </div>
          <h3 className="text-xl font-semibold text-white">
            Nessun portfolio ancora
          </h3>
          <p className="text-white/70 max-w-md mx-auto">
            Inizia creando il tuo primo portfolio dinamico. Scegli un template o parti da zero!
          </p>
          <GlassButton variant="primary" className="mt-4">
            Crea il tuo primo portfolio
          </GlassButton>
        </div>
      </GlassCard>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {portfolios.map((portfolio) => (
        <GlassCard key={portfolio.id} className="p-6 space-y-4 hover:bg-white/15 transition-all duration-300">
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-semibold text-white truncate">
              {portfolio.name}
            </h3>
            <Badge 
              variant={portfolio.is_published ? "default" : "secondary"}
              className={portfolio.is_published 
                ? "bg-green-500/20 text-green-300 border-green-400/30" 
                : "bg-yellow-500/20 text-yellow-300 border-yellow-400/30"
              }
            >
              {portfolio.is_published ? 'Pubblicato' : 'Bozza'}
            </Badge>
          </div>
          
          {portfolio.description && (
            <p className="text-white/70 text-sm line-clamp-2">
              {portfolio.description}
            </p>
          )}
          
          <div className="flex items-center space-x-2 text-white/60 text-xs">
            <Calendar className="h-3 w-3" />
            <span>
              Creato il {new Date(portfolio.created_at).toLocaleDateString('it-IT')}
            </span>
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <div className="flex space-x-2">
              <GlassButton size="sm" variant="ghost">
                <Edit className="h-3 w-3" />
              </GlassButton>
              
              {portfolio.is_published && (
                <GlassButton size="sm" variant="ghost">
                  <ExternalLink className="h-3 w-3" />
                </GlassButton>
              )}
              
              <GlassButton size="sm" variant="ghost" className="hover:bg-red-500/20">
                <Trash2 className="h-3 w-3" />
              </GlassButton>
            </div>
            
            <GlassButton size="sm" variant="primary">
              <Eye className="h-3 w-3 mr-1" />
              Visualizza
            </GlassButton>
          </div>
        </GlassCard>
      ))}
    </div>
  )
}
