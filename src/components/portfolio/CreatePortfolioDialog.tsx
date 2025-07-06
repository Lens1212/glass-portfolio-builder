
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { GlassButton } from '@/components/ui/glass-button'
import { GlassCard } from '@/components/ui/glass-card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'
import { Plus, Palette, Layout, User } from 'lucide-react'

const QUICK_TEMPLATES = [
  {
    id: 'minimal',
    name: 'Minimalista',
    description: 'Design pulito e professionale',
    color: 'bg-blue-500',
    structure: {
      theme: {
        primaryColor: '#3b82f6',
        backgroundColor: '#ffffff',
        textColor: '#1f2937'
      },
      sections: [
        { type: 'hero', title: 'Il Tuo Nome' },
        { type: 'about', title: 'Chi Sono' },
        { type: 'skills', title: 'Competenze' },
        { type: 'projects', title: 'Progetti' },
        { type: 'contact', title: 'Contatti' }
      ]
    }
  },
  {
    id: 'creative',
    name: 'Creativo',
    description: 'Colorato e dinamico',
    color: 'bg-purple-500',
    structure: {
      theme: {
        primaryColor: '#8b5cf6',
        backgroundColor: '#fafafa',
        textColor: '#111827'
      },
      sections: [
        { type: 'hero', title: 'Designer Creativo' },
        { type: 'gallery', title: 'Portfolio' },
        { type: 'about', title: 'La Mia Storia' },
        { type: 'contact', title: 'Collaboriamo' }
      ]
    }
  },
  {
    id: 'professional',
    name: 'Professionale',
    description: 'Per business e consulenti',
    color: 'bg-green-500',
    structure: {
      theme: {
        primaryColor: '#10b981',
        backgroundColor: '#ffffff',
        textColor: '#1f2937'
      },
      sections: [
        { type: 'hero', title: 'Consulente Professionale' },
        { type: 'about', title: 'Chi Sono' },
        { type: 'projects', title: 'Case Study' },
        { type: 'contact', title: 'Inizia Oggi' }
      ]
    }
  }
]

interface CreatePortfolioDialogProps {
  onPortfolioCreated?: () => void
}

export function CreatePortfolioDialog({ onPortfolioCreated }: CreatePortfolioDialogProps) {
  const [open, setOpen] = useState(false)
  const [portfolioName, setPortfolioName] = useState('')
  const [portfolioDescription, setPortfolioDescription] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState('minimal')
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

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

    if (!user) {
      toast.error('Devi essere autenticato')
      return
    }

    setLoading(true)

    try {
      const template = QUICK_TEMPLATES.find(t => t.id === selectedTemplate)
      const slug = generateSlug(portfolioName)

      const { data, error } = await supabase
        .from('portfolios')
        .insert({
          user_id: user.id,
          name: portfolioName.trim(),
          slug,
          description: portfolioDescription.trim() || null,
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
        setSelectedTemplate('minimal')
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
      
      <DialogContent className="sm:max-w-2xl bg-white/95 backdrop-blur-xl border-white/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center">
            <Layout className="h-6 w-6 mr-2" />
            Crea il Tuo Portfolio
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
                placeholder="Il mio Portfolio Creativo"
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
                placeholder="Breve descrizione del tuo portfolio..."
                className="mt-1"
                rows={2}
              />
            </div>
          </div>

          {/* Template Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Palette className="h-5 w-5 mr-2" />
              Scegli uno Stile
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {QUICK_TEMPLATES.map((template) => (
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
                    <div className={`h-24 ${template.color} rounded-lg flex items-center justify-center relative overflow-hidden`}>
                      <div className="text-white opacity-80">
                        <User className="h-8 w-8" />
                      </div>
                      {selectedTemplate === template.id && (
                        <div className="absolute inset-0 bg-white/20 flex items-center justify-center">
                          <div className="bg-white text-blue-600 rounded-full p-2">
                            ✓
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Template Info */}
                    <div className="space-y-1">
                      <h4 className="font-medium text-gray-900">{template.name}</h4>
                      <p className="text-sm text-gray-600">{template.description}</p>
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
              disabled={loading || !portfolioName.trim()}
            >
              {loading ? 'Creazione...' : 'Crea Portfolio'}
            </GlassButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
