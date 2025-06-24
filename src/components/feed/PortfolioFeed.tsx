
import React, { useState, useEffect } from 'react'
import { GlassCard } from '@/components/ui/glass-card'
import { GlassButton } from '@/components/ui/glass-button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Heart, Copy, Eye, User, Calendar, Tag } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'

interface PublicPortfolio {
  id: string
  name: string
  description?: string
  copy_count: number
  tags?: string[]
  cover_image_url?: string
  created_at: string
  user_display_name?: string
  user_avatar_url?: string
  user_public_profile?: any
}

interface PortfolioFeedProps {
  sortBy?: 'recent' | 'popular'
  filterTags?: string[]
}

export function PortfolioFeed({ sortBy = 'recent', filterTags = [] }: PortfolioFeedProps) {
  const [portfolios, setPortfolios] = useState<PublicPortfolio[]>([])
  const [loading, setLoading] = useState(true)
  const [copying, setCopying] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    fetchPublicPortfolios()
  }, [sortBy, filterTags])

  const fetchPublicPortfolios = async () => {
    try {
      setLoading(true)
      
      let query = supabase
        .from('public_portfolios')
        .select('*')

      // Applicare filtri per tag se specificati
      if (filterTags.length > 0) {
        query = query.contains('tags', filterTags)
      }

      // Ordinamento
      if (sortBy === 'popular') {
        query = query.order('copy_count', { ascending: false })
      } else {
        query = query.order('created_at', { ascending: false })
      }

      const { data, error } = await query.limit(12)

      if (error) {
        toast.error('Errore nel caricamento del feed')
        console.error('Error fetching public portfolios:', error)
      } else {
        setPortfolios(data || [])
      }
    } catch (error) {
      toast.error('Errore di connessione')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCopyPortfolio = async (portfolioId: string, portfolioName: string) => {
    if (!user) {
      toast.error('Devi essere autenticato per copiare un portfolio')
      return
    }

    try {
      setCopying(portfolioId)
      
      const { data, error } = await supabase.rpc('copy_portfolio', {
        source_portfolio_id: portfolioId
      })

      if (error) {
        toast.error('Errore durante la copia del portfolio')
        console.error('Error copying portfolio:', error)
      } else {
        toast.success(`Portfolio "${portfolioName}" copiato con successo!`)
        // Aggiorna il conteggio delle copie nel feed
        setPortfolios(prev => 
          prev.map(p => 
            p.id === portfolioId 
              ? { ...p, copy_count: p.copy_count + 1 }
              : p
          )
        )
      }
    } catch (error) {
      toast.error('Errore durante la copia')
      console.error('Error:', error)
    } finally {
      setCopying(null)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <GlassCard key={i} className="p-4 animate-pulse">
            <div className="space-y-4">
              <div className="h-32 bg-white/20 rounded"></div>
              <div className="h-4 bg-white/20 rounded w-3/4"></div>
              <div className="h-3 bg-white/10 rounded w-full"></div>
              <div className="flex space-x-2">
                <div className="h-6 bg-white/10 rounded w-16"></div>
                <div className="h-6 bg-white/10 rounded w-16"></div>
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
            Nessun portfolio pubblico trovato
          </h3>
          <p className="text-white/70 max-w-md mx-auto">
            Non ci sono ancora portfolio pubblici con i filtri selezionati.
          </p>
        </div>
      </GlassCard>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {portfolios.map((portfolio) => (
        <GlassCard key={portfolio.id} className="p-4 space-y-4 hover:bg-white/15 transition-all duration-300">
          {/* Cover Image */}
          <div className="relative h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg overflow-hidden">
            {portfolio.cover_image_url ? (
              <img 
                src={portfolio.cover_image_url} 
                alt={portfolio.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Eye className="h-8 w-8 text-white/40" />
              </div>
            )}
          </div>

          {/* Portfolio Info */}
          <div className="space-y-3">
            <div>
              <h3 className="text-lg font-semibold text-white truncate">
                {portfolio.name}
              </h3>
              {portfolio.description && (
                <p className="text-white/70 text-sm line-clamp-2 mt-1">
                  {portfolio.description}
                </p>
              )}
            </div>

            {/* Creator Info */}
            <div className="flex items-center space-x-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={portfolio.user_avatar_url} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                  <User className="h-3 w-3" />
                </AvatarFallback>
              </Avatar>
              <span className="text-white/80 text-sm">
                {portfolio.user_display_name || 'Utente'}
              </span>
            </div>

            {/* Tags */}
            {portfolio.tags && portfolio.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {portfolio.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs bg-white/10 text-white/80">
                    <Tag className="h-2 w-2 mr-1" />
                    {tag}
                  </Badge>
                ))}
                {portfolio.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs bg-white/10 text-white/80">
                    +{portfolio.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}

            {/* Stats and Actions */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center space-x-3 text-white/60 text-xs">
                <div className="flex items-center space-x-1">
                  <Copy className="h-3 w-3" />
                  <span>{portfolio.copy_count}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(portfolio.created_at).toLocaleDateString('it-IT')}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2 pt-2">
              <GlassButton 
                size="sm" 
                variant="ghost" 
                className="flex-1"
              >
                <Eye className="h-3 w-3 mr-1" />
                Anteprima
              </GlassButton>
              
              <GlassButton 
                size="sm" 
                variant="primary"
                onClick={() => handleCopyPortfolio(portfolio.id, portfolio.name)}
                disabled={copying === portfolio.id}
                className="flex-1"
              >
                {copying === portfolio.id ? (
                  <div className="animate-spin h-3 w-3 border border-white/30 border-t-white rounded-full mr-1" />
                ) : (
                  <Copy className="h-3 w-3 mr-1" />
                )}
                Copia
              </GlassButton>
            </div>
          </div>
        </GlassCard>
      ))}
    </div>
  )
}
