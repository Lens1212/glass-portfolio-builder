
import React, { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { GlassCard } from '@/components/ui/glass-card'
import { GlassButton } from '@/components/ui/glass-button'
import { Badge } from '@/components/ui/badge'
import { 
  Save, 
  Eye, 
  Settings, 
  Palette, 
  Type, 
  Layers, 
  Smartphone, 
  Monitor,
  Tablet,
  Code,
  Download
} from 'lucide-react'
import { ThemeEditor } from './ThemeEditor'
import { TypographyControl } from './TypographyControl'
import { TemplateLibrary } from './TemplateLibrary'
import { AnimationSettings } from './AnimationSettings'

interface EditorSection {
  id: string
  type: string
  title: string
  content: any
  styles: any
}

interface PortfolioEditorProps {
  portfolioId: string
  initialData?: any
  onSave?: (data: any) => void
}

export function PortfolioEditor({ portfolioId, initialData, onSave }: PortfolioEditorProps) {
  const [sections, setSections] = useState<EditorSection[]>([])
  const [selectedSection, setSelectedSection] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'design' | 'typography' | 'templates' | 'animations'>('design')
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    if (initialData?.content?.sections) {
      setSections(initialData.content.sections)
    }
  }, [initialData])

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(sections)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setSections(items)
  }

  const addSection = (sectionType: string) => {
    const newSection: EditorSection = {
      id: `section-${Date.now()}`,
      type: sectionType,
      title: `Nuova Sezione ${sectionType}`,
      content: {},
      styles: {}
    }
    setSections([...sections, newSection])
  }

  const updateSection = (sectionId: string, updates: Partial<EditorSection>) => {
    setSections(sections.map(section => 
      section.id === sectionId ? { ...section, ...updates } : section
    ))
  }

  const deleteSection = (sectionId: string) => {
    setSections(sections.filter(section => section.id !== sectionId))
    if (selectedSection === sectionId) {
      setSelectedSection(null)
    }
  }

  const savePortfolio = () => {
    const portfolioData = {
      sections,
      theme: {
        darkMode: isDarkMode,
        // altri settings del tema
      }
    }
    onSave?.(portfolioData)
  }

  const getPreviewWidth = () => {
    switch (previewMode) {
      case 'mobile':
        return 'max-w-sm'
      case 'tablet':
        return 'max-w-2xl'
      default:
        return 'max-w-full'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Sinistra - Controlli */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header Sidebar */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Editor</h2>
            <GlassButton size="sm" onClick={savePortfolio}>
              <Save className="h-4 w-4 mr-1" />
              Salva
            </GlassButton>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {[
              { id: 'design', label: 'Design', icon: Palette },
              { id: 'typography', label: 'Font', icon: Type },
              { id: 'templates', label: 'Blocchi', icon: Layers },
              { id: 'animations', label: 'Animazioni', icon: Settings }
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-3 w-3 mr-1" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Content Sidebar */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'design' && <ThemeEditor />}
          {activeTab === 'typography' && <TypographyControl />}
          {activeTab === 'templates' && <TemplateLibrary onAddSection={addSection} />}
          {activeTab === 'animations' && <AnimationSettings />}
        </div>
      </div>

      {/* Area Centrale - Canvas */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar Superiore */}
        <div className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Preview Mode */}
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Preview:</span>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  {[
                    { mode: 'desktop', icon: Monitor },
                    { mode: 'tablet', icon: Tablet },
                    { mode: 'mobile', icon: Smartphone }
                  ].map(({ mode, icon: Icon }) => (
                    <button
                      key={mode}
                      onClick={() => setPreviewMode(mode as any)}
                      className={`p-2 rounded-md transition-colors ${
                        previewMode === mode
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Dark Mode Toggle */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  isDarkMode
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                {isDarkMode ? 'Dark' : 'Light'}
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <GlassButton size="sm" variant="ghost">
                <Eye className="h-4 w-4 mr-1" />
                Anteprima
              </GlassButton>
              
              <GlassButton size="sm" variant="ghost">
                <Code className="h-4 w-4 mr-1" />
                Codice
              </GlassButton>
              
              <GlassButton size="sm" variant="ghost">
                <Download className="h-4 w-4 mr-1" />
                Esporta
              </GlassButton>
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 overflow-auto p-6 bg-gray-50">
          <div className={`mx-auto transition-all duration-300 ${getPreviewWidth()}`}>
            <GlassCard className="min-h-screen bg-white">
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
                              {...provided.dragHandleProps}
                              className={`group relative border-2 border-dashed rounded-lg p-4 transition-all ${
                                snapshot.isDragging
                                  ? 'border-blue-400 bg-blue-50'
                                  : selectedSection === section.id
                                  ? 'border-blue-400'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                              onClick={() => setSelectedSection(section.id)}
                            >
                              {/* Section Header */}
                              <div className="flex items-center justify-between mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Badge variant="secondary" className="text-xs">
                                  {section.type}
                                </Badge>
                                <div className="flex space-x-1">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      // Open section settings
                                    }}
                                    className="p-1 bg-white rounded border text-gray-500 hover:text-gray-700"
                                  >
                                    <Settings className="h-3 w-3" />
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      deleteSection(section.id)
                                    }}
                                    className="p-1 bg-white rounded border text-red-500 hover:text-red-700"
                                  >
                                    ×
                                  </button>
                                </div>
                              </div>

                              {/* Section Content */}
                              <div className="min-h-24 flex items-center justify-center text-gray-500">
                                {section.title || `Sezione ${section.type}`}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      
                      {sections.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                          <Layers className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                          <p className="text-lg font-medium mb-2">Il tuo canvas è vuoto</p>
                          <p className="text-sm">Aggiungi blocchi dalla libreria template per iniziare</p>
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  )
}
