
import React, { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { GlassButton } from '@/components/ui/glass-button'
import { 
  Globe, 
  Lock, 
  FileText, 
  Eye, 
  Share2, 
  Settings,
  ExternalLink,
  Copy,
  CheckCircle
} from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'sonner'

interface StatusManagerProps {
  portfolioId: string
  currentStatus: 'draft' | 'published_private' | 'published_public'
  portfolioSlug: string
  onStatusChange?: (newStatus: string) => void
}

const STATUS_OPTIONS = [
  {
    value: 'draft',
    label: 'Bozza',
    description: 'Solo tu puoi vedere questo portfolio',
    icon: FileText,
    color: 'bg-gray-500/20 text-gray-300 border-gray-400/30',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-700'
  },
  {
    value: 'published_private',
    label: 'Privato',
    description: 'Visibile solo con link diretto',
    icon: Lock,
    color: 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30',
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-800'
  },
  {
    value: 'published_public',
    label: 'Pubblico',
    description: 'Visibile a tutti nel feed pubblico',
    icon: Globe,
    color: 'bg-green-500/20 text-green-300 border-green-400/30',
    bgColor: 'bg-green-50',
    textColor: 'text-green-800'
  }
]

export function StatusManager({ portfolioId, currentStatus, portfolioSlug, onStatusChange }: StatusManagerProps) {
  const [loading, setLoading] = useState(false)
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const currentStatusInfo = STATUS_OPTIONS.find(option => option.value === currentStatus)
  const StatusIcon = currentStatusInfo?.icon || FileText

  const updateStatus = async (newStatus: string) => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from('portfolios')
        .update({ visibility_status: newStatus })
        .eq('id', portfolioId)

      if (error) {
        toast.error('Errore nell\'aggiornamento dello stato')
        console.error('Error updating status:', error)
      } else {
        toast.success('Stato aggiornato con successo!')
        onStatusChange?.(newStatus)
      }
    } catch (error) {
      toast.error('Errore di connessione')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const copyLink = async () => {
    const url = `${window.location.origin}/portfolio/${portfolioSlug}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast.success('Link copiato!')
    } catch {
      toast.error('Impossibile copiare il link')
    }
  }

  const openPortfolio = () => {
    window.open(`/portfolio/${portfolioSlug}`, '_blank')
  }

  return (
    <div className="flex items-center space-x-3">
      {/* Current Status Badge */}
      <Badge variant="secondary" className={currentStatusInfo?.color}>
        <StatusIcon className="h-3 w-3 mr-1" />
        {currentStatusInfo?.label}
      </Badge>

      {/* Status Selector */}
      <Select value={currentStatus} onValueChange={updateStatus} disabled={loading}>
        <SelectTrigger className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {STATUS_OPTIONS.map((option) => {
            const OptionIcon = option.icon
            return (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center space-x-2">
                  <div className={`p-1 rounded ${option.bgColor}`}>
                    <OptionIcon className={`h-3 w-3 ${option.textColor}`} />
                  </div>
                  <div>
                    <div className="font-medium">{option.label}</div>
                    <div className="text-xs text-gray-500">{option.description}</div>
                  </div>
                </div>
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>

      {/* Action Buttons */}
      <div className="flex items-center space-x-2">
        {(currentStatus === 'published_private' || currentStatus === 'published_public') && (
          <>
            <GlassButton size="sm" variant="ghost" onClick={openPortfolio}>
              <ExternalLink className="h-3 w-3" />
            </GlassButton>
            
            <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
              <DialogTrigger asChild>
                <GlassButton size="sm" variant="ghost">
                  <Share2 className="h-3 w-3" />
                </GlassButton>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Condividi Portfolio</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <input
                      readOnly
                      value={`${window.location.origin}/portfolio/${portfolioSlug}`}
                      className="flex-1 bg-transparent border-none outline-none text-sm"
                    />
                    <Button size="sm" onClick={copyLink}>
                      {copied ? (
                        <CheckCircle className="h-3 w-3 text-green-600" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500">
                    {currentStatus === 'published_public' 
                      ? 'Questo portfolio è pubblico e può essere visto da chiunque'
                      : 'Questo portfolio è privato e accessibile solo tramite questo link'
                    }
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          </>
        )}
      </div>
    </div>
  )
}
