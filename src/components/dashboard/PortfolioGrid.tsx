import React from 'react'
import { GlassCard } from '@/components/ui/glass-card'
import { GlassButton } from '@/components/ui/glass-button'
import { Badge } from '@/components/ui/badge'
import { Eye, Edit, ExternalLink, Trash2, Calendar, Lock, Globe, FileText } from 'lucide-react'
import { CreatePortfolioDialog } from '@/components/portfolio/CreatePortfolioDialog'
import { useNavigate } from 'react-router-dom'

interface Portfolio {
  id: string
  name: string
  description?: string
  visibility_status: 'draft' | 'published_private' | 'published_public'
  created_at: string
  slug: string
}

interface PortfolioGridProps {
  portfolios: Portfolio[]
  loading?: boolean
  onPortfolioCreated?: () => void
}

const getStatusInfo = (status: string) => {
  switch (status) {
    case 'draft':
      return {
        label: 'Bozza',
        className: 'bg-gray-500/20 text-gray-300 border-gray-400/30',
        icon: FileText
      }
    case 'published_private':
      return {
        label: 'Pubblicato Privato',
        className: 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30',
        icon: Lock
      }
    case 'published_public':
      return {
        label: 'Pubblico',
        className: 'bg-green-500/20 text-green-300 border-green-400/30',
        icon: Globe
      }
    default:
      return {
        label: 'Bozza',
        className: 'bg-gray-500/20 text-gray-300 border-gray-400/30',
        icon: FileText
      }
  }
}

export function PortfolioGrid({ portfolios, loading, onPortfolioCreated }: PortfolioGridProps) {
  const navigate = useNavigate()

  const openEditor = (portfolioId: string) => {
    navigate(`/editor/${portfolioId}`)
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <GlassCard key={i} className="p-6 animate-pulse">
            <div className="space-y-4">
              <div className="h-6 bg-white/20 rounded w-3/4"></div>
              <div className="h-4 bg-white/10 rounded w-full"></div>
              <div className="h-4 bg-white/10 rounded w-2/3"></div>
              <div className="flex space-x-2">
                <div className="h-8 bg-white/10 rounded w-20"></div>
                <div className="h-8 bg-white/10 rounded w-20"></div>
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
            Nessun portfolio trovato
          </h3>
          <p className="text-white/70 max-w-md mx-auto">
            Inizia creando il tuo primo portfolio dinamico.
          </p>
          <CreatePortfolioDialog onPortfolioCreated={onPortfolioCreated} />
        </div>
      </GlassCard>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <CreatePortfolioDialog onPortfolioCreated={onPortfolioCreated} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolios.map((portfolio) => {
          const statusInfo = getStatusInfo(portfolio.visibility_status)
          const StatusIcon = statusInfo.icon
          
          return (
            <GlassCard key={portfolio.id} className="p-6 space-y-4 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-semibold text-white truncate">
                  {portfolio.name}
                </h3>
                <Badge 
                  variant="secondary"
                  className={statusInfo.className}
                >
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {statusInfo.label}
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
                  <GlassButton 
                    size="sm" 
                    variant="ghost"
                    onClick={() => openEditor(portfolio.id)}
                  >
                    <Edit className="h-3 w-3" />
                  </GlassButton>
                  
                  {(portfolio.visibility_status === 'published_private' || portfolio.visibility_status === 'published_public') && (
                    <GlassButton size="sm" variant="ghost">
                      <ExternalLink className="h-3 w-3" />
                    </GlassButton>
                  )}
                  
                  <GlassButton size="sm" variant="ghost" className="hover:bg-red-500/20">
                    <Trash2 className="h-3 w-3" />
                  </GlassButton>
                </div>
                
                <GlassButton 
                  size="sm" 
                  variant="primary"
                  onClick={() => openEditor(portfolio.id)}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  Modifica
                </GlassButton>
              </div>
            </GlassCard>
          )
        })}
      </div>
    </div>
  )
}
