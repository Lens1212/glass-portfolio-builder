
import React, { useState, useCallback } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { GlassCard } from '@/components/ui/glass-card'
import { GlassButton } from '@/components/ui/glass-button'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Save, 
  Eye, 
  Palette, 
  Type, 
  Layout,
  Image,
  User,
  Briefcase,
  Mail,
  Star,
  FileText,
  Trash2,
  GripVertical,
  Settings
} from 'lucide-react'

interface Section {
  id: string
  type: 'hero' | 'about' | 'skills' | 'projects' | 'contact' | 'gallery' | 'testimonials'
  title: string
  content: any
  styles: {
    backgroundColor?: string
    textColor?: string
    padding?: string
  }
}

const SECTION_TEMPLATES = [
  {
    type: 'hero',
    icon: User,
    label: 'Hero',
    color: 'bg-blue-500',
    defaultContent: {
      title: 'Il Tuo Nome',
      subtitle: 'La Tua Professione',
      description: 'Breve descrizione di quello che fai',
      buttonText: 'Contattami'
    }
  },
  {
    type: 'about',
    icon: FileText,
    label: 'Chi Sono',
    color: 'bg-green-500',
    defaultContent: {
      title: 'Chi Sono',
      text: 'Racconta la tua storia professionale...',
      image: null
    }
  },
  {
    type: 'skills',
    icon: Star,
    label: 'Competenze',
    color: 'bg-purple-500',
    defaultContent: {
      title: 'Le Mie Competenze',
      skills: [
        { name: 'JavaScript', level: 90 },
        { name: 'React', level: 85 },
        { name: 'Design', level: 75 }
      ]
    }
  },
  {
    type: 'projects',
    icon: Briefcase,
    label: 'Progetti',
    color: 'bg-orange-500',
    defaultContent: {
      title: 'I Miei Progetti',
      projects: []
    }
  },
  {
    type: 'contact',
    icon: Mail,
    label: 'Contatti',
    color: 'bg-red-500',
    defaultContent: {
      title: 'Contattami',
      email: 'tua@email.com',
      phone: '+39 123 456 789'
    }
  },
  {
    type: 'gallery',
    icon: Image,
    label: 'Galleria',
    color: 'bg-pink-500',
    defaultContent: {
      title: 'Galleria',
      images: []
    }
  }
]

interface PortfolioEditorProps {
  portfolioId?: string
  onSave?: (data: any) => void
}

export function PortfolioEditor({ portfolioId, onSave }: PortfolioEditorProps) {
  const [sections, setSections] = useState<Section[]>([])
  const [selectedSection, setSelectedSection] = useState<string | null>(null)
  const [theme, setTheme] = useState({
    primaryColor: '#3b82f6',
    backgroundColor: '#ffffff',
    textColor: '#1f2937'
  })

  const handleDragEnd = useCallback((result: any) => {
    if (!result.destination) return

    const items = Array.from(sections)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setSections(items)
  }, [sections])

  const addSection = useCallback((sectionType: string) => {
    const template = SECTION_TEMPLATES.find(t => t.type === sectionType)
    if (!template) return

    const newSection: Section = {
      id: `section-${Date.now()}`,
      type: sectionType as any,
      title: template.defaultContent.title || template.label,
      content: template.defaultContent,
      styles: {
        backgroundColor: theme.backgroundColor,
        textColor: theme.textColor,
        padding: '2rem'
      }
    }

    setSections(prev => [...prev, newSection])
  }, [theme])

  const removeSection = useCallback((sectionId: string) => {
    setSections(prev => prev.filter(s => s.id !== sectionId))
    if (selectedSection === sectionId) {
      setSelectedSection(null)
    }
  }, [selectedSection])

  const updateSection = useCallback((sectionId: string, updates: Partial<Section>) => {
    setSections(prev => prev.map(section => 
      section.id === sectionId ? { ...section, ...updates } : section
    ))
  }, [])

  const renderSectionPreview = (section: Section) => {
    const template = SECTION_TEMPLATES.find(t => t.type === section.type)
    const Icon = template?.icon || FileText

    return (
      <div className="min-h-32 p-6 rounded-lg border-2 border-dashed border-gray-200 bg-gray-50/50 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className={`p-2 rounded-lg ${template?.color || 'bg-gray-500'} text-white`}>
              <Icon className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{section.title}</h3>
              <Badge variant="secondary" className="text-xs">
                {template?.label || section.type}
              </Badge>
            </div>
          </div>
        </div>

        {/* Section Content Preview */}
        <div className="flex-1 text-sm text-gray-600">
          {section.type === 'hero' && (
            <div>
              <div className="font-medium mb-1">{section.content.title}</div>
              <div className="text-xs">{section.content.subtitle}</div>
            </div>
          )}
          {section.type === 'about' && (
            <div className="line-clamp-3">{section.content.text}</div>
          )}
          {section.type === 'skills' && (
            <div className="space-y-1">
              {section.content.skills?.slice(0, 3).map((skill: any, idx: number) => (
                <div key={idx} className="flex items-center space-x-2">
                  <span className="text-xs">{skill.name}</span>
                  <div className="flex-1 h-1 bg-gray-200 rounded">
                    <div 
                      className="h-1 bg-blue-500 rounded" 
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
          {(section.type === 'projects' || section.type === 'gallery') && (
            <div className="grid grid-cols-3 gap-2">
              {[1,2,3].map(i => (
                <div key={i} className="aspect-square bg-gray-200 rounded" />
              ))}
            </div>
          )}
          {section.type === 'contact' && (
            <div className="space-y-1">
              <div className="text-xs">{section.content.email}</div>
              <div className="text-xs">{section.content.phone}</div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar con Template */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Builder</h2>
          
          <div className="flex items-center justify-between mb-4">
            <GlassButton size="sm" onClick={() => onSave?.({ sections, theme })}>
              <Save className="h-4 w-4 mr-1" />
              Salva
            </GlassButton>
            <GlassButton size="sm" variant="ghost">
              <Eye className="h-4 w-4 mr-1" />
              Preview
            </GlassButton>
          </div>

          {/* Theme Controls */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700 flex items-center">
              <Palette className="h-4 w-4 mr-1" />
              Tema
            </h3>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setTheme({ primaryColor: '#3b82f6', backgroundColor: '#ffffff', textColor: '#1f2937' })}
                className="h-8 rounded bg-blue-500 hover:opacity-80"
              />
              <button
                onClick={() => setTheme({ primaryColor: '#10b981', backgroundColor: '#ffffff', textColor: '#1f2937' })}
                className="h-8 rounded bg-green-500 hover:opacity-80"
              />
              <button
                onClick={() => setTheme({ primaryColor: '#f59e0b', backgroundColor: '#1f2937', textColor: '#ffffff' })}
                className="h-8 rounded bg-yellow-500 hover:opacity-80"
              />
            </div>
          </div>
        </div>

        {/* Template Library */}
        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
            <Layout className="h-4 w-4 mr-1" />
            Aggiungi Sezioni
          </h3>
          
          <div className="space-y-2">
            {SECTION_TEMPLATES.map((template) => {
              const Icon = template.icon
              return (
                <button
                  key={template.type}
                  onClick={() => addSection(template.type)}
                  className="w-full p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded ${template.color} text-white group-hover:scale-110 transition-transform`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{template.label}</div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <GlassCard className="min-h-screen" style={{ backgroundColor: theme.backgroundColor }}>
            {sections.length === 0 ? (
              <div className="h-96 flex flex-col items-center justify-center text-gray-500">
                <Layout className="h-16 w-16 mb-4 text-gray-300" />
                <h3 className="text-xl font-medium mb-2">Inizia a costruire</h3>
                <p className="text-center max-w-sm">
                  Aggiungi sezioni dalla barra laterale per iniziare a creare il tuo portfolio
                </p>
              </div>
            ) : (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="portfolio-sections">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-4 p-6"
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
                                snapshot.isDragging ? 'scale-105 shadow-xl' : ''
                              }`}
                            >
                              {/* Drag Handle */}
                              <div 
                                {...provided.dragHandleProps}
                                className="absolute -left-8 top-4 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
                              >
                                <div className="p-2 bg-white rounded shadow-sm border">
                                  <GripVertical className="h-4 w-4 text-gray-400" />
                                </div>
                              </div>

                              {/* Delete Button */}
                              <button
                                onClick={() => removeSection(section.id)}
                                className="absolute -right-2 -top-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-10"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>

                              {/* Section Content */}
                              <div
                                onClick={() => setSelectedSection(section.id)}
                                className={`cursor-pointer transition-all ${
                                  selectedSection === section.id 
                                    ? 'ring-2 ring-blue-500 ring-offset-2' 
                                    : 'hover:shadow-md'
                                }`}
                              >
                                {renderSectionPreview(section)}
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
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
