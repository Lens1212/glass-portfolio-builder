
import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { GlassButton } from '@/components/ui/glass-button'
import { GlassCard } from '@/components/ui/glass-card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'
import { Plus, Crown, Check } from 'lucide-react'

interface Template {
  id: string
  name: string
  description: string
  structure: any
  is_premium: boolean
  thumbnail_url?: string
}

interface CreatePortfolioDialogProps {
  onPortfolioCreated?: () => void
}

export function CreatePortfolioDialog({ onPortfolioCreated }: CreatePortfolioDialogProps) {
  const [open, setOpen] = useState(false)
  const [templates, setTemplates] = useState<Template[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [portfolioName, setPortfolioName] = useState('')
  const [portfolioDescription, setPortfolioDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    if (open) {
      fetchTemplates()
    }
  }, [open])

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Error fetching templates:', error)
        toast.error('Errore nel caricamento dei template')
      } else {
        setTemplates(data || [])
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Errore di connessione')
    }
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
      + '-' + Date.now()
  }

  const createPortfolio = async () => {
    if (!portfolioName.trim()) {
      toast.error('Inserisci un nome per il portfolio')
      return
    }

    if (!selectedTemplate) {
      toast.error('Seleziona un template')
      return
    }

    if (!user) {
      toast.error('Devi essere autenticato')
      return
    }

    setLoading(true)

    try {
      const template = templates.find(t => t.id === selectedTemplate)
      const slug = generateSlug(portfolioName)

      const { data, error } = await supabase
        .from('portfolios')
        .insert({
          user_id: user.id,
          name: portfolioName.trim(),
          slug,
          description: portfolioDescription.trim() || null,
          template_id: selectedTemplate,
          content: template?.structure || {},
          theme_settings: template?.structure?.theme || {},
          visibility_status: 'draft'
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating portfolio:', error)
        toast.error('Errore nella creazione del portfolio')
      } else {
        toast.success('Portfolio creato con successo!')
        setOpen(false)
        setPortfolioName('')
        setPortfolioDescription('')
        setSelectedTemplate(null)
        onPortfolioCreated?.()
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Errore di connessione')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <GlassButton variant="primary">
          <Plus className="h-4 w-4 mr-2" />
          Nuovo Portfolio
        </GlassButton>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-xl border-white/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Crea Nuovo Portfolio
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 p-1">
          {/* Portfolio Info */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="portfolio-name" className="text-gray-900 font-medium">
                Nome Portfolio *
              </Label>
              <Input
                id="portfolio-name"
                value={portfolioName}
                onChange={(e) => setPortfolioName(e.target.value)}
                placeholder="Il mio Portfolio Professionale"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="portfolio-description" className="text-gray-900 font-medium">
                Descrizione (opzionale)
              </Label>
              <Textarea
                id="portfolio-description"
                value={portfolioDescription}
                onChange={(e) => setPortfolioDescription(e.target.value)}
                placeholder="Descrivi il tuo portfolio..."
                className="mt-1"
                rows={3}
              />
            </div>
          </div>

          {/* Template Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Scegli un Template
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((template) => (
                <GlassCard
                  key={template.id}
                  className={`p-4 cursor-pointer transition-all duration-200 ${
                    selectedTemplate === template.id
                      ? 'ring-2 ring-blue-500 bg-blue-50/50'
                      : 'hover:bg-gray-50/50'
                  }`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <div className="space-y-3">
                    {/* Template Preview */}
                    <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center relative overflow-hidden">
                      {template.thumbnail_url ? (
                        <img 
                          src={template.thumbnail_url} 
                          alt={template.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-gray-400 text-sm">Preview</div>
                      )}
                      
                      {selectedTemplate === template.id && (
                        <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                          <div className="bg-blue-500 text-white rounded-full p-1">
                            <Check className="h-4 w-4" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Template Info */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">{template.name}</h4>
                        {template.is_premium && (
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                            <Crown className="h-3 w-3 mr-1" />
                            Premium
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {template.description}
                      </p>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <GlassButton
              variant="ghost"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Annulla
            </GlassButton>
            
            <GlassButton
              variant="primary"
              onClick={createPortfolio}
              disabled={loading || !portfolioName.trim() || !selectedTemplate}
            >
              {loading ? 'Creazione...' : 'Crea Portfolio'}
            </GlassButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
