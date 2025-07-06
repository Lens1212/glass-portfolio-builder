
import React, { useState, useCallback } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { GlassCard } from '@/components/ui/glass-card'
import { GlassButton } from '@/components/ui/glass-button'
import { Badge } from '@/components/ui/badge'
import { EditorSidebar } from './EditorSidebar'
import { StatusManager } from './StatusManager'
import { 
  Save, 
  Eye, 
  GripVertical,
  Trash2,
  Settings,
  Monitor,
  Tablet,
  Smartphone,
  Maximize2,
  Edit3,
  Copy,
  MoreHorizontal
} from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'sonner'

interface Section {
  id: string
  type: 'hero' | 'about' | 'skills' | 'projects' | 'contact' | 'gallery' | 'testimonials' | 'experience'
  title: string
  content: any
  styles: {
    backgroundColor?: string
    textColor?: string
    padding?: string
  }
}

interface AdvancedPortfolioEditorProps {
  portfolioId: string
  portfolioSlug: string
  initialData?: {
    sections: Section[]
    theme: any
    status: 'draft' | 'published_private' | 'published_public'
  }
  onSave?: (data: any) => void
}

const DEVICE_PRESETS = [
  { id: 'desktop', icon: Monitor, label: 'Desktop', width: '100%' },
  { id: 'tablet', icon: Tablet, label: 'Tablet', width: '768px' },
  { id: 'mobile', icon: Smartphone, label: 'Mobile', width: '375px' }
]

export function AdvancedPortfolioEditor({ 
  portfolioId, 
  portfolioSlug, 
  initialData,
  onSave 
}: AdvancedPortfolioEditorProps) {
  const [sections, setSections] = useState<Section[]>(initialData?.sections || [])
  const [selectedSection, setSelectedSection] = useState<string | null>(null)
  const [currentDevice, setCurrentDevice] = useState('desktop')
  const [portfolioStatus, setPortfolioStatus] = useState(initialData?.status || 'draft')
  const [theme, setTheme] = useState(initialData?.theme || {
    primary: '#2563eb',
    secondary: '#64748b',
    accent: '#3b82f6',
    background: '#ffffff',
    text: '#1e293b'
  })
  const [saving, setSaving] = useState(false)

  const handleDragEnd = useCallback((result: any) => {
    if (!result.destination) return

    const items = Array.from(sections)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setSections(items)
  }, [sections])

  const addSection = useCallback((sectionType: string) => {
    const newSection: Section = {
      id: `section-${Date.now()}`,
      type: sectionType as any,
      title: getSectionTitle(sectionType),
      content: getDefaultContent(sectionType),
      styles: {
        backgroundColor: theme.background,
        textColor: theme.text,
        padding: '4rem 2rem'
      }
    }

    setSections(prev => [...prev, newSection])
    setSelectedSection(newSection.id)
  }, [theme])

  const removeSection = useCallback((sectionId: string) => {
    setSections(prev => prev.filter(s => s.id !== sectionId))
    if (selectedSection === sectionId) {
      setSelectedSection(null)
    }
  }, [selectedSection])

  const duplicateSection = useCallback((sectionId: string) => {
    const sectionToDuplicate = sections.find(s => s.id === sectionId)
    if (!sectionToDuplicate) return

    const duplicatedSection: Section = {
      ...sectionToDuplicate,
      id: `section-${Date.now()}`,
      title: `${sectionToDuplicate.title} (Copia)`
    }

    const sectionIndex = sections.findIndex(s => s.id === sectionId)
    const newSections = [...sections]
    newSections.splice(sectionIndex + 1, 0, duplicatedSection)
    setSections(newSections)
  }, [sections])

  const savePortfolio = async () => {
    setSaving(true)
    try {
      const portfolioData = {
        content: { sections },
        theme_settings: theme,
        updated_at: new Date().toISOString()
      }

      const { error } = await supabase
        .from('portfolios')
        .update(portfolioData)
        .eq('id', portfolioId)

      if (error) {
        toast.error('Errore nel salvataggio')
        console.error('Error saving portfolio:', error)
      } else {
        toast.success('Portfolio salvato con successo!')
        onSave?.(portfolioData)
      }
    } catch (error) {
      toast.error('Errore di connessione')
      console.error('Error:', error)
    } finally {
      setSaving(false)
    }
  }

  const previewPortfolio = () => {
    window.open(`/portfolio/${portfolioSlug}`, '_blank')
  }

  const currentDeviceConfig = DEVICE_PRESETS.find(d => d.id === currentDevice)

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <EditorSidebar 
        onAddSection={addSection}
        onThemeChange={setTheme}
        currentTheme={theme}
      />

      {/* Main Editor */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">Editor Portfolio</h1>
              <Badge variant="secondary" className="text-xs">
                {sections.length} sezioni
              </Badge>
            </div>

            <div className="flex items-center space-x-3">
              {/* Device Selector */}
              <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                {DEVICE_PRESETS.map((device) => {
                  const DeviceIcon = device.icon
                  return (
                    <button
                      key={device.id}
                      onClick={() => setCurrentDevice(device.id)}
                      className={`p-2 rounded text-xs font-medium transition-all ${
                        currentDevice === device.id
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                      title={device.label}
                    >
                      <DeviceIcon className="h-4 w-4" />
                    </button>
                  )
                })}
              </div>

              {/* Status Manager */}
              <StatusManager
                portfolioId={portfolioId}
                portfolioSlug={portfolioSlug}
                currentStatus={portfolioStatus}
                onStatusChange={setPortfolioStatus}
              />

              {/* Action Buttons */}
              <GlassButton variant="ghost" onClick={previewPortfolio}>
                <Eye className="h-4 w-4 mr-1" />
                Anteprima
              </GlassButton>

              <GlassButton 
                variant="primary" 
                onClick={savePortfolio}
                disabled={saving}
              >
                <Save className="h-4 w-4 mr-1" />
                {saving ? 'Salvataggio...' : 'Salva'}
              </GlassButton>
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <div 
              className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300"
              style={{ 
                width: currentDeviceConfig?.width,
                margin: '0 auto',
                minHeight: '100vh'
              }}
            >
              {sections.length === 0 ? (
                <div className="h-96 flex flex-col items-center justify-center text-gray-500 border-2 border-dashed border-gray-200 m-8 rounded-lg">
                  <Edit3 className="h-16 w-16 mb-4 text-gray-300" />
                  <h3 className="text-xl font-medium mb-2">Inizia a Creare</h3>
                  <p className="text-center max-w-sm text-gray-400">
                    Aggiungi sezioni dalla barra laterale per iniziare a costruire il tuo portfolio
                  </p>
                </div>
              ) : (
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="portfolio-sections">
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="min-h-screen"
                      >
                        {sections.map((section, index) => (
                          <Draggable 
                            key={section.id} 
                            draggableId={section.id} 
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={`group relative transition-all ${
                                  snapshot.isDragging ? 'scale-105 shadow-2xl z-50' : ''
                                } ${
                                  selectedSection === section.id ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                                }`}
                                onClick={() => setSelectedSection(section.id)}
                              >
                                {/* Section Controls */}
                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center space-x-2">
                                  <GlassButton 
                                    size="sm" 
                                    variant="ghost"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      duplicateSection(section.id)
                                    }}
                                  >
                                    <Copy className="h-3 w-3" />
                                  </GlassButton>
                                  
                                  <GlassButton 
                                    size="sm" 
                                    variant="ghost"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      removeSection(section.id)
                                    }}
                                    className="hover:bg-red-500/20"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </GlassButton>
                                </div>

                                {/* Drag Handle */}
                                <div 
                                  {...provided.dragHandleProps}
                                  className="absolute -left-8 top-4 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
                                >
                                  <div className="p-2 bg-white rounded shadow-sm border">
                                    <GripVertical className="h-4 w-4 text-gray-400" />
                                  </div>
                                </div>

                                {/* Section Content */}
                                <div 
                                  className="min-h-64 cursor-pointer hover:bg-gray-50/50 transition-colors"
                                  style={{
                                    backgroundColor: section.styles.backgroundColor,
                                    color: section.styles.textColor,
                                    padding: section.styles.padding
                                  }}
                                >
                                  {renderSectionContent(section, theme)}
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function getSectionTitle(type: string): string {
  const titles = {
    hero: 'Hero Section',
    about: 'Chi Sono',
    skills: 'Competenze',
    projects: 'Progetti',
    contact: 'Contatti',
    gallery: 'Galleria',
    testimonials: 'Testimonianze',
    experience: 'Esperienza'
  }
  return titles[type as keyof typeof titles] || 'Nuova Sezione'
}

function getDefaultContent(type: string): any {
  const defaults = {
    hero: {
      title: 'Il Tuo Nome',
      subtitle: 'La Tua Professione',
      description: 'Una breve descrizione di quello che fai e della tua passione',
      buttonText: 'Scopri di più',
      backgroundImage: null
    },
    about: {
      title: 'Chi Sono',
      text: 'Racconta la tua storia professionale, le tue passioni e quello che ti distingue nel tuo campo.',
      image: null,
      highlights: ['Esperienza pluriennale', 'Progetti innovativi', 'Passione per la qualità']
    },
    skills: {
      title: 'Le Mie Competenze',
      skills: [
        { name: 'JavaScript', level: 90 },
        { name: 'React', level: 85 },
        { name: 'Node.js', level: 80 },
        { name: 'Python', level: 75 },
        { name: 'Design', level: 70 }
      ]
    },
    projects: {
      title: 'I Miei Progetti',
      projects: []
    },
    contact: {
      title: 'Contattami',
      email: 'tua@email.com',
      phone: '+39 123 456 789',
      location: 'La tua città, Italia',
      socials: []
    }
  }
  return defaults[type as keyof typeof defaults] || {}
}

function renderSectionContent(section: Section, theme: any) {
  switch (section.type) {
    case 'hero':
      return (
        <div className="text-center py-20">
          <h1 className="text-5xl font-bold mb-4" style={{ color: theme.primary }}>
            {section.content.title}
          </h1>
          <h2 className="text-2xl mb-6 opacity-80">
            {section.content.subtitle}
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-70">
            {section.content.description}
          </p>
          <button 
            className="px-8 py-3 rounded-lg font-medium transition-colors"
            style={{ backgroundColor: theme.primary, color: 'white' }}
          >
            {section.content.buttonText}
          </button>
        </div>
      )

    case 'about':
      return (
        <div className="py-16">
          <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: theme.primary }}>
            {section.content.title}
          </h2>
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-lg leading-relaxed mb-6">
                {section.content.text}
              </p>
              {section.content.highlights && (
                <ul className="space-y-2">
                  {section.content.highlights.map((highlight: string, idx: number) => (
                    <li key={idx} className="flex items-center">
                      <span className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: theme.accent }} />
                      {highlight}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">Immagine profilo</span>
            </div>
          </div>
        </div>
      )

    case 'skills':
      return (
        <div className="py-16">
          <h2 className="text-3xl font-bold mb-12 text-center" style={{ color: theme.primary }}>
            {section.content.title}
          </h2>
          <div className="max-w-2xl mx-auto space-y-6">
            {section.content.skills?.map((skill: any, idx: number) => (
              <div key={idx}>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">{skill.name}</span>
                  <span className="text-sm opacity-70">{skill.level}%</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ 
                      width: `${skill.level}%`,
                      backgroundColor: theme.accent
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )

    case 'contact':
      return (
        <div className="py-16">
          <h2 className="text-3xl font-bold mb-12 text-center" style={{ color: theme.primary }}>
            {section.content.title}
          </h2>
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: theme.accent }}>
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium">Email</h3>
                  <p className="opacity-70">{section.content.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: theme.accent }}>
                  <span className="text-white text-sm">📞</span>
                </div>
                <div>
                  <h3 className="font-medium">Telefono</h3>
                  <p className="opacity-70">{section.content.phone}</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-100 rounded-lg p-6">
              <h3 className="font-medium mb-4">Invia un messaggio</h3>
              <form className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Il tuo nome"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                />
                <input 
                  type="email" 
                  placeholder="La tua email"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                />
                <textarea 
                  placeholder="Il tuo messaggio"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                />
                <button 
                  type="button"
                  className="w-full py-2 rounded-lg font-medium text-white"
                  style={{ backgroundColor: theme.primary }}
                >
                  Invia Messaggio
                </button>
              </form>
            </div>
          </div>
        </div>
      )

    default:
      return (
        <div className="py-16 text-center">
          <h2 className="text-3xl font-bold mb-4" style={{ color: theme.primary }}>
            {section.title}
          </h2>
          <p className="text-lg opacity-70">
            Sezione {section.type} - Clicca per personalizzare
          </p>
        </div>
      )
  }
}
